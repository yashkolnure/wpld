import { META } from '../../utils/metaLimits';
import { ValidatedInput, labelStyle, inputStyle } from './ValidatedField';

export default function CtaUrlConfig({ data, onChange }) {
  const msg = data.message || {};
  const update = (patch) => onChange({ ...data, message: { ...msg, type: 'cta_url', ...patch } });
  const urlValid = !msg.url || /^https?:\/\/.+/i.test(msg.url);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: '#f0fdfa', border: '1px solid #5eead4', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: '#0f766e', lineHeight: 1.5 }}>
        🔗 Sends a message with a *native tappable button* that opens a website. This is the official Meta way to share a link — cleaner and more clickable than pasting a URL in text.
      </div>

      <ValidatedInput label="Header (optional)" value={msg.header || ''} limit={META.ctaUrl.header}
        onChange={v => update({ header: v })} placeholder="Header text" />
      <ValidatedInput label="Body" value={msg.body || ''} limit={META.ctaUrl.body} required textarea
        onChange={v => update({ body: v })} placeholder="Message text shown above the button. Supports {{variable}}." />
      <ValidatedInput label="Footer (optional)" value={msg.footer || ''} limit={META.ctaUrl.footer}
        onChange={v => update({ footer: v })} placeholder="Footer text" />
      <ValidatedInput label="Button text" value={msg.buttonText || ''} limit={META.ctaUrl.buttonText} required
        onChange={v => update({ buttonText: v })} placeholder="e.g. Visit Website, Book Now" />

      <div>
        <label style={labelStyle}>Button URL <span style={{ color: '#e53e3e' }}>*</span></label>
        <input
          style={{ ...inputStyle, border: `1px solid ${urlValid ? '#e5e7eb' : '#fca5a5'}` }}
          value={msg.url || ''}
          onChange={e => update({ url: e.target.value })}
          placeholder="https://wpleads.in/register"
        />
        {!urlValid && <p style={{ fontSize: 10, color: '#dc2626', margin: '4px 0 0' }}>URL must start with http:// or https://</p>}
      </div>
    </div>
  );
}
