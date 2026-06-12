export default function AINodeConfig({ data, onChange }) {
  const update = (patch) => onChange({ ...data, ...patch });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 8, padding: '10px 12px' }}>
        <p style={{ fontSize: 11, color: '#7e22ce', margin: 0, lineHeight: 1.5 }}>
          Uses the AI you connected in <b>Dashboard → Configure AI</b>. Make sure AI is
          enabled there, or this step is skipped.
        </p>
      </div>

      <div>
        <label style={labelStyle}>What should the AI do?</label>
        <textarea
          style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
          value={data.aiPrompt || ''}
          onChange={e => update({ aiPrompt: e.target.value })}
          placeholder={"Leave empty to answer the customer's last message.\n\nOr give an instruction, e.g.\n“Suggest 3 plans based on {{interest}} and ask which they prefer.”"}
        />
        <p style={hintStyle}>
          You can insert variables like <code style={codeStyle}>{'{{name}}'}</code> captured by
          earlier Collect Input steps. Leave blank to simply reply to whatever the customer said.
        </p>
      </div>

      <div>
        <label style={labelStyle}>Personality / instructions (optional)</label>
        <textarea
          style={{ ...inputStyle, minHeight: 64, resize: 'vertical' }}
          value={data.aiSystemPrompt || ''}
          onChange={e => update({ aiSystemPrompt: e.target.value })}
          placeholder="Override the default system prompt for this step only — e.g. “You are a polite sales assistant. Keep replies under 2 sentences.”"
        />
        <p style={hintStyle}>Leave empty to use the system prompt from your AI settings.</p>
      </div>

      <div>
        <label style={labelStyle}>Save AI reply as variable (optional)</label>
        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', overflow: 'hidden' }}>
          <span style={{ fontSize: 13, color: '#9ca3af', padding: '8px 2px 8px 10px', fontWeight: 700 }}>{'{{'}</span>
          <input
            style={{ ...inputStyle, border: 'none', borderRadius: 0, padding: '8px 2px' }}
            value={data.aiSaveAs || ''}
            onChange={e => update({ aiSaveAs: e.target.value.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 30) })}
            placeholder="ai_reply"
          />
          <span style={{ fontSize: 13, color: '#9ca3af', padding: '8px 10px 8px 2px', fontWeight: 700 }}>{'}}'}</span>
        </div>
        <p style={hintStyle}>Reuse the reply in later steps (e.g. in a Condition).</p>
      </div>
    </div>
  );
}

const labelStyle = { fontSize: 11, fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' };
const inputStyle = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 10px', fontSize: 13, boxSizing: 'border-box', background: '#fff', outline: 'none' };
const hintStyle  = { fontSize: 11, color: '#9ca3af', margin: '5px 0 0', lineHeight: 1.5 };
const codeStyle  = { background: '#faf5ff', color: '#9333ea', borderRadius: 4, padding: '1px 5px', fontSize: 11, fontWeight: 600 };
