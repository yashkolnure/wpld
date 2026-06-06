/**
 * WhatsApp Cloud API message limits — single source of truth.
 *
 * All values verified against Meta's official Cloud API docs (2026).
 * Lengths are counted in Unicode CODE POINTS ([...str].length), not .length,
 * because emoji count as 1 toward Meta's limit but 2 in JS string length.
 *
 * Docs:
 *  - Reply buttons / List: developers.facebook.com/docs/whatsapp/cloud-api/messages
 *  - CTA URL / Flow:        developers.facebook.com/docs/whatsapp/cloud-api/messages/interactive-*
 */

export const META = {
  // ── Reply Buttons (interactive type=button) ──
  button: {
    maxButtons:   3,
    title:        20,    // per button
    body:         1024,
    header:       60,
    footer:       60,
  },

  // ── List (interactive type=list) ──
  list: {
    buttonText:   20,    // the "View options" CTA
    body:         4096,
    header:       60,
    footer:       60,
    maxSections:  10,
    maxRowsTotal: 10,    // across ALL sections combined
    sectionTitle: 24,
    rowTitle:     24,
    rowDesc:      72,
  },

  // ── Plain text ──
  text: {
    body:         4096,
  },

  // ── Media caption ──
  media: {
    caption:      1024,
  },

  // ── CTA URL button (interactive type=cta_url) ──
  ctaUrl: {
    buttonText:   20,
    body:         1024,
    header:       60,
    footer:       60,
  },

  // ── Flow (interactive type=flow) ──
  flow: {
    cta:          20,    // flow_cta button label
    body:         1024,
    header:       60,
    footer:       60,
  },
};

/** Unicode-aware length (emoji = 1). */
export const cpLength = (str = '') => [...String(str)].length;

/** True when the string is within the limit (inclusive). */
export const withinLimit = (str, limit) => cpLength(str) <= limit;

/** Truncate to `limit` code points (used as a last-resort safety net). */
export const clampToLimit = (str = '', limit) => {
  const cps = [...String(str)];
  return cps.length <= limit ? String(str) : cps.slice(0, limit).join('');
};

/**
 * Validate a single message node's data against Meta limits.
 * Returns an array of human-readable error strings (empty = valid).
 */
export function validateMessageNode(node) {
  const errors = [];
  const t = node.type;
  const m = node.data?.message || {};

  const check = (val, limit, label, required = false) => {
    const len = cpLength(val || '');
    if (required && len === 0) errors.push(`${label} is required`);
    if (len > limit)           errors.push(`${label} is ${len}/${limit} chars — too long`);
  };

  if (t === 'trigger') {
    const isFallback = node.data?.matchType === 'fallback';
    if (!isFallback && !(node.data?.keyword || '').trim()) errors.push('Trigger needs at least one keyword');
  }

  if (t === 'collect_input') {
    if (!(node.data?.variableName || '').trim()) errors.push('Collect Input needs a variable name');
    if (!(node.data?.question || '').trim())     errors.push('Collect Input needs a question');
  }

  if (t === 'condition') {
    if (!(node.data?.variable || '').trim()) errors.push('Condition needs a variable to check');
  }

  // message-type nodes
  if (m.type === 'text') {
    check(m.text, META.text.body, 'Text message', true);
  }

  if (m.type === 'button') {
    check(m.buttonHeader, META.button.header, 'Button header');
    check(m.buttonBody,   META.button.body,   'Button body', true);
    check(m.buttonFooter, META.button.footer, 'Button footer');
    const btns = m.buttons || [];
    if (btns.length === 0)               errors.push('Button message needs at least 1 button');
    if (btns.length > META.button.maxButtons) errors.push(`Max ${META.button.maxButtons} buttons (has ${btns.length})`);
    btns.forEach((b, i) => check(b.title, META.button.title, `Button ${i + 1} title`, true));
  }

  if (m.type === 'list') {
    check(m.listHeader,     META.list.header,     'List header');
    check(m.listBody,       META.list.body,       'List body', true);
    check(m.listFooter,     META.list.footer,     'List footer');
    check(m.listButtonText, META.list.buttonText, 'List button text');
    const secs = m.sections || [];
    if (secs.length === 0)             errors.push('List needs at least 1 section');
    if (secs.length > META.list.maxSections) errors.push(`Max ${META.list.maxSections} sections (has ${secs.length})`);
    let totalRows = 0;
    secs.forEach((s, si) => {
      check(s.title, META.list.sectionTitle, `Section ${si + 1} title`);
      (s.rows || []).forEach((r, ri) => {
        totalRows++;
        check(r.title,       META.list.rowTitle, `Section ${si + 1} row ${ri + 1} title`, true);
        check(r.description, META.list.rowDesc,  `Section ${si + 1} row ${ri + 1} description`);
      });
    });
    if (totalRows === 0)                 errors.push('List needs at least 1 row');
    if (totalRows > META.list.maxRowsTotal) errors.push(`Max ${META.list.maxRowsTotal} rows total (has ${totalRows})`);
  }

  if (m.type === 'media') {
    if (!(m.mediaUrl || '').trim()) errors.push('Media needs a URL or uploaded file');
    check(m.mediaCaption, META.media.caption, 'Media caption');
  }

  if (m.type === 'cta_url') {
    check(m.header,     META.ctaUrl.header,     'CTA header');
    check(m.body,       META.ctaUrl.body,       'CTA body', true);
    check(m.footer,     META.ctaUrl.footer,     'CTA footer');
    check(m.buttonText, META.ctaUrl.buttonText, 'CTA button text', true);
    if (!/^https?:\/\/.+/i.test(m.url || '')) errors.push('CTA needs a valid URL (https://...)');
  }

  if (m.type === 'flow') {
    check(m.header, META.flow.header, 'Flow header');
    check(m.body,   META.flow.body,   'Flow body', true);
    check(m.footer, META.flow.footer, 'Flow footer');
    check(m.flowCta, META.flow.cta,   'Flow button text', true);
    if (!(m.flowId || '').trim()) errors.push('Flow needs a published Flow ID');
  }

  return errors;
}

/** Validate a whole workflow (nodes + edges). Returns { ok, issues: [{nodeId, label, errors}] }. */
export function validateWorkflow(nodes = [], edges = []) {
  const issues = [];

  const hasTrigger = nodes.some(n => n.type === 'trigger');
  if (!hasTrigger) issues.push({ nodeId: null, label: 'Workflow', errors: ['Needs a Trigger node'] });

  // Per-node field validation
  nodes.forEach(n => {
    const errs = validateMessageNode(n);
    if (errs.length) {
      issues.push({ nodeId: n.id, label: nodeLabel(n), errors: errs });
    }
  });

  // Orphan detection: non-trigger nodes with no incoming edge
  const targets = new Set(edges.map(e => e.target));
  nodes.forEach(n => {
    if (n.type !== 'trigger' && !targets.has(n.id)) {
      issues.push({ nodeId: n.id, label: nodeLabel(n), errors: ['Not connected — no incoming arrow (orphan node)'] });
    }
  });

  return { ok: issues.length === 0, issues };
}

/** Friendly label for a node (used in error messages). */
export function nodeLabel(n) {
  if (n.type === 'trigger')       return n.data?.matchType === 'fallback' ? 'Default Reply' : 'Keyword Trigger';
  if (n.type === 'delay')         return 'Delay';
  if (n.type === 'collect_input') return `Collect Input (${n.data?.variableName || '?'})`;
  if (n.type === 'condition')     return `Condition (${n.data?.variable || '?'})`;
  const mt = n.data?.message?.type;
  const map = { text: 'Text', button: 'Buttons', list: 'List', media: 'Media', product: 'Product', product_list: 'Product List', cta_url: 'Link Button', flow: 'Form (Flow)' };
  return map[mt] || 'Message';
}
