import { useState } from 'react';

// Delay is stored canonically as `delayMinutes` (the executor does delayMinutes*60*1000).
// This UI lets the user think in seconds / minutes / hours instead of typing "0.1".
const UNIT_TO_MIN = { seconds: 1 / 60, minutes: 1, hours: 60 };
const PRESETS = [
  { label: '5s',  min: 5 / 60 },
  { label: '30s', min: 0.5 },
  { label: '1m',  min: 1 },
  { label: '5m',  min: 5 },
  { label: '1h',  min: 60 },
];

// Pick the friendliest unit to display a stored minutes value in.
const bestUnit = (mins) => {
  if (mins == null) return { value: 5, unit: 'minutes' };
  if (mins < 1)            return { value: Math.round(mins * 60), unit: 'seconds' };
  if (mins % 60 === 0)     return { value: mins / 60, unit: 'hours' };
  return { value: mins, unit: 'minutes' };
};

export default function DelayConfig({ data, onChange }) {
  const init = bestUnit(data.delayMinutes);
  const [unit, setUnit]   = useState(init.unit);
  const [value, setValue] = useState(String(init.value));

  const commit = (rawValue, rawUnit) => {
    const v = parseFloat(rawValue);
    const safe = isNaN(v) || v <= 0 ? 0 : v;
    const minutes = Math.min(safe * UNIT_TO_MIN[rawUnit], 1440); // cap at 24h
    onChange({ ...data, delayMinutes: minutes });
  };

  const onValue = (raw) => { setValue(raw); commit(raw, unit); };
  const onUnit  = (u)   => { setUnit(u);   commit(value, u); };
  const applyPreset = (p) => {
    const b = bestUnit(p.min);
    setUnit(b.unit); setValue(String(b.value));
    onChange({ ...data, delayMinutes: p.min });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={labelStyle}>Wait duration</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="number" min={1} step="any"
            style={{ ...inputStyle, flex: 1 }}
            value={value}
            onChange={e => onValue(e.target.value)}
          />
          <select style={{ ...inputStyle, width: 110, flexShrink: 0 }} value={unit} onChange={e => onUnit(e.target.value)}>
            <option value="seconds">seconds</option>
            <option value="minutes">minutes</option>
            <option value="hours">hours</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {PRESETS.map(p => (
          <button key={p.label} onClick={() => applyPreset(p)}
            style={{ fontSize: 11, fontWeight: 600, color: '#374151', background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 16, padding: '4px 11px', cursor: 'pointer' }}>
            {p.label}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 11, color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>
        The flow pauses here before the next step. Max 24 hours.
      </p>
    </div>
  );
}

const labelStyle = { fontSize: 11, fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' };
const inputStyle = { border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 10px', fontSize: 13, boxSizing: 'border-box', background: '#fff', outline: 'none' };
