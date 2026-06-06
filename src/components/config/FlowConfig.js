import { META } from '../../utils/metaLimits';
import { ValidatedInput, labelStyle, inputStyle } from './ValidatedField';

export default function FlowConfig({ data, onChange }) {
  const msg = data.message || {};
  const update = (patch) => onChange({ ...data, message: { ...msg, type: 'flow', ...patch } });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: '#6d28d9', lineHeight: 1.5 }}>
        📋 Sends a *native WhatsApp form* (Flow) that opens right inside the chat — date pickers, dropdowns, text fields. Perfect for *appointment booking*, lead forms & surveys.
      </div>

      {/* How-to */}
      <details style={{ background: '#fafafa', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 10px' }}>
        <summary style={{ fontSize: 11, fontWeight: 700, color: '#4b5563', cursor: 'pointer' }}>
          ⓘ How to get a Flow ID
        </summary>
        <ol style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.6, margin: '8px 0 0', paddingLeft: 18 }}>
          <li>Go to <b>Meta Business Manager → WhatsApp Manager → Flows</b></li>
          <li>Click <b>Create Flow</b>, pick a template (e.g. Appointment Booking, Lead Gen)</li>
          <li>Design screens with the drag-and-drop builder, then <b>Publish</b></li>
          <li>Copy the <b>Flow ID</b> and paste it below</li>
        </ol>
      </details>

      <div>
        <label style={labelStyle}>Flow ID <span style={{ color: '#e53e3e' }}>*</span></label>
        <input
          style={inputStyle}
          value={msg.flowId || ''}
          onChange={e => update({ flowId: e.target.value.trim() })}
          placeholder="e.g. 1234567890123456"
        />
        <p style={{ fontSize: 10, color: '#9ca3af', margin: '4px 0 0' }}>The published Flow's ID from Meta Business Manager.</p>
      </div>

      <ValidatedInput label="Header (optional)" value={msg.header || ''} limit={META.flow.header}
        onChange={v => update({ header: v })} placeholder="e.g. Book Your Appointment" />
      <ValidatedInput label="Body" value={msg.body || ''} limit={META.flow.body} required textarea
        onChange={v => update({ body: v })} placeholder="Intro text shown above the form button. Supports {{variable}}." />
      <ValidatedInput label="Footer (optional)" value={msg.footer || ''} limit={META.flow.footer}
        onChange={v => update({ footer: v })} placeholder="Footer text" />
      <ValidatedInput label="Form button text" value={msg.flowCta || ''} limit={META.flow.cta} required
        onChange={v => update({ flowCta: v })} placeholder="e.g. Book Now, Fill Form" />

      <div>
        <label style={labelStyle}>First screen name (optional)</label>
        <input
          style={inputStyle}
          value={msg.flowScreen || ''}
          onChange={e => update({ flowScreen: e.target.value.trim() })}
          placeholder="e.g. WELCOME or APPOINTMENT"
        />
        <p style={{ fontSize: 10, color: '#9ca3af', margin: '4px 0 0' }}>
          The screen the form opens on. Leave blank if your Flow has a single entry screen.
        </p>
      </div>
    </div>
  );
}
