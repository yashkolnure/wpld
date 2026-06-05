import { useState } from 'react';

export default function TriggerConfig({ data, onChange }) {
  const [draft, setDraft] = useState('');

  // keywords are stored as comma-separated string in data.keyword
  const keywords = (data.keyword || '')
    .split(',')
    .map(k => k.trim())
    .filter(Boolean);

  const saveKeywords = (list) =>
    onChange({ ...data, keyword: list.join(', ') });

  const addKeyword = (raw) => {
    const trimmed = raw.trim().toLowerCase();
    if (!trimmed || keywords.includes(trimmed)) return;
    saveKeywords([...keywords, trimmed]);
  };

  const removeKeyword = (kw) =>
    saveKeywords(keywords.filter(k => k !== kw));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeyword(draft);
      setDraft('');
    }
    if (e.key === 'Backspace' && draft === '' && keywords.length) {
      removeKeyword(keywords[keywords.length - 1]);
    }
  };

  const handleBlur = () => {
    if (draft.trim()) {
      addKeyword(draft);
      setDraft('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Info banner */}
      <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 8, padding: '8px 10px', fontSize: 11, color: '#6d28d9', lineHeight: 1.5 }}>
        ⚡ This flow starts when a user sends any of these keywords. Press <strong>Enter</strong> or <strong>comma</strong> to add each one.
      </div>

      {/* Tag input */}
      <div>
        <label style={labelStyle}>
          Keywords
          <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 500, color: '#9ca3af' }}>
            ({keywords.length} added)
          </span>
        </label>
        <div
          style={{
            display: 'flex', flexWrap: 'wrap', gap: 6,
            border: '1px solid #e5e7eb', borderRadius: 8,
            padding: '6px 8px', background: '#fff', cursor: 'text',
            minHeight: 40,
          }}
          onClick={() => document.getElementById('kw-input')?.focus()}
        >
          {keywords.map(kw => (
            <span
              key={kw}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: '#f5f3ff', border: '1px solid #c4b5fd',
                borderRadius: 6, padding: '3px 8px',
                fontSize: 12, fontWeight: 700, color: '#6d28d9',
              }}
            >
              {kw}
              <button
                onClick={(e) => { e.stopPropagation(); removeKeyword(kw); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a78bfa', fontSize: 14, lineHeight: 1, padding: 0, display: 'flex', alignItems: 'center' }}
              >×</button>
            </span>
          ))}
          <input
            id="kw-input"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={keywords.length === 0 ? 'e.g. hi, hello, start...' : 'Add another...'}
            style={{
              border: 'none', outline: 'none', fontSize: 12,
              minWidth: 100, flex: 1, background: 'transparent', padding: '2px 4px',
            }}
          />
        </div>
        <p style={{ fontSize: 10, color: '#9ca3af', margin: '4px 0 0' }}>
          Press Enter or comma after each keyword. Backspace removes the last one.
        </p>
      </div>

      {/* Match type */}
      <div>
        <label style={labelStyle}>Match type</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { value: 'contains', label: '≈ Contains', desc: 'Message includes the keyword anywhere' },
            { value: 'exact',    label: '= Exact',    desc: 'Message is exactly the keyword' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...data, matchType: opt.value })}
              title={opt.desc}
              style={{
                flex: 1, padding: '7px 0', borderRadius: 8, fontSize: 12, fontWeight: 700,
                cursor: 'pointer',
                border: `1.5px solid ${(data.matchType || 'contains') === opt.value ? '#7c3aed' : '#e5e7eb'}`,
                background: (data.matchType || 'contains') === opt.value ? '#f5f3ff' : '#fff',
                color: (data.matchType || 'contains') === opt.value ? '#6d28d9' : '#6b7280',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 10, color: '#9ca3af', margin: '4px 0 0' }}>
          {(data.matchType || 'contains') === 'contains'
            ? '"hello world" triggers on keyword "hello"'
            : '"hello" only triggers if the whole message is exactly "hello"'}
        </p>
      </div>

    </div>
  );
}

const labelStyle = { fontSize: 11, fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' };
