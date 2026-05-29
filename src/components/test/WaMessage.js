export default function WaMessage({ payload }) {
  if (!payload) return null;
  const { type, text, interactive, image, video, document: doc } = payload;

  const bubble = {
    background: '#fff',
    borderRadius: '12px 12px 12px 2px',
    padding: '8px 12px',
    maxWidth: 240,
    fontSize: 13,
    color: '#111',
    marginBottom: 4,
    boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
  };

  const footer = {
    fontSize: 11,
    color: '#888',
    textAlign: 'right',
    marginTop: 4,
  };

  const btn = {
    border: '1px solid #25d366',
    borderRadius: 8,
    padding: '7px 10px',
    textAlign: 'center',
    fontSize: 12,
    color: '#128c7e',
    background: '#fff',
    marginTop: 4,
    cursor: 'default',
  };

  // Plain text
  if (type === 'text') {
    return (
      <div style={bubble}>
        <p style={{ margin: 0, lineHeight: 1.5 }}>{text?.body}</p>
        <p style={footer}>10:30 AM ✓✓</p>
      </div>
    );
  }

  // Button message
  if (type === 'interactive' && interactive?.type === 'button') {
    const { header, body, footer: ft, action } = interactive;
    return (
      <div>
        <div style={bubble}>
          {header?.text && (
            <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 13 }}>{header.text}</p>
          )}
          <p style={{ margin: 0, lineHeight: 1.5 }}>{body?.text}</p>
          {ft?.text && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#888' }}>{ft.text}</p>}
          <p style={footer}>10:30 AM ✓✓</p>
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 240 }}>
          {action?.buttons?.map(b => (
            <div key={b.reply.id} style={{ ...btn, flex: 1 }}>{b.reply.title}</div>
          ))}
        </div>
      </div>
    );
  }

  // List message
  if (type === 'interactive' && interactive?.type === 'list') {
    const { header, body, footer: ft, action } = interactive;
    return (
      <div>
        <div style={bubble}>
          {header?.text && (
            <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 13 }}>{header.text}</p>
          )}
          <p style={{ margin: 0, lineHeight: 1.5 }}>{body?.text}</p>
          {ft?.text && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#888' }}>{ft.text}</p>}
          <p style={footer}>10:30 AM ✓✓</p>
        </div>
        <div style={{ ...btn, maxWidth: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#128c7e" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          {action?.button || 'View options'}
        </div>
        {/* expanded list rows */}
        <div style={{ background: '#fff', borderRadius: 8, marginTop: 6, maxWidth: 240, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {action?.sections?.map((sec, si) => (
            <div key={si}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#128c7e', padding: '8px 12px 2px', margin: 0, textTransform: 'uppercase' }}>
                {sec.title}
              </p>
              {sec.rows?.map(row => (
                <div key={row.id} style={{ padding: '8px 12px', borderTop: '0.5px solid #f0f0f0' }}>
                  <p style={{ fontSize: 13, fontWeight: 500, margin: '0 0 2px', color: '#111' }}>{row.title}</p>
                  {row.description && <p style={{ fontSize: 11, color: '#888', margin: 0 }}>{row.description}</p>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Media
  if (type === 'image' || type === 'video' || type === 'document') {
    const item = image || video || doc || {};
    return (
      <div style={{ ...bubble, padding: 0, overflow: 'hidden' }}>
        <div style={{ background: '#cfe9ff', height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: 11, color: '#128c7e', margin: 0 }}>{type.toUpperCase()}</p>
        </div>
        {item.caption && (
          <div style={{ padding: '8px 12px' }}>
            <p style={{ margin: 0, fontSize: 12 }}>{item.caption}</p>
            <p style={footer}>10:30 AM ✓✓</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}