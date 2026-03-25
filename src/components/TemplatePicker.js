import { templates } from '../data/workflowTemplates';

export default function TemplatePicker({ onSelect }) {
  return (
    <div style={{
      minHeight: '100vh', background: '#f9fafb',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px', fontFamily: 'sans-serif',
    }}>
      <div style={{ maxWidth: 860, width: '100%' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
            Start with a template
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
            Pick a ready-made workflow or build from scratch
          </p>
        </div>

        {/* Blank option */}
        <div
          onClick={() => onSelect(null)}
          style={{
            border: '1.5px dashed #d1d5db', borderRadius: 12,
            padding: '18px 24px', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 16,
            cursor: 'pointer', background: '#fff',
            transition: 'border-color .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#d1d5db'}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            background: '#f3f4f6', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>＋</div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: '0 0 2px' }}>Blank workflow</p>
            <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Start from scratch with an empty canvas</p>
          </div>
        </div>

        {/* Template grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 16,
        }}>
          {templates.map(t => (
            <div
              key={t.id}
              onClick={() => onSelect(t)}
              style={{
                background: '#fff',
                border: `1.5px solid ${t.border}`,
                borderRadius: 12, padding: '20px',
                cursor: 'pointer',
                transition: 'transform .1s, box-shadow .1s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: t.bg, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 22, marginBottom: 12,
              }}>
                {t.icon}
              </div>

              <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: '0 0 4px' }}>
                {t.name}
              </p>
              <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px', lineHeight: 1.5 }}>
                {t.description}
              </p>

              {/* Node type pills */}
              <NodePills template={t} />

              <div style={{
                marginTop: 14, fontSize: 12, fontWeight: 600,
                color: t.color, display: 'flex', alignItems: 'center', gap: 4,
              }}>
                Use template →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Show what node types are in each template
function NodePills({ template }) {
  const built = template.build();
  const counts = built.nodes.reduce((acc, n) => {
    const type = n.type === 'trigger' ? 'trigger' : (n.data?.message?.type || n.type);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const pillColors = {
    trigger: { bg: '#EEEDFE', color: '#534AB7' },
    text:    { bg: '#E1F5EE', color: '#0F6E56' },
    button:  { bg: '#E6F1FB', color: '#185FA5' },
    list:    { bg: '#FAEEDA', color: '#854F0B' },
    media:   { bg: '#FAECE7', color: '#993C1D' },
    delay:   { bg: '#F1EFE8', color: '#5F5E5A' },
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
      {Object.entries(counts).map(([type, count]) => {
        const c = pillColors[type] || pillColors.text;
        return (
          <span key={type} style={{
            fontSize: 10, fontWeight: 600,
            background: c.bg, color: c.color,
            padding: '2px 8px', borderRadius: 20,
          }}>
            {count}× {type}
          </span>
        );
      })}
    </div>
  );
}