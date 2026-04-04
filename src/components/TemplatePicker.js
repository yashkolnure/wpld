import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { templates } from '../data/workflowTemplates';

// Theme Configuration
const theme = {
  primary: '#6366f1', // Indigo
  textMain: '#111827',
  textMuted: '#6b7280',
  bgPage: '#f8fafc',
  bgCard: '#ffffff',
  border: '#e2e8f0'
};

export default function TemplatePicker({ onSelect }) {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', 
      background: theme.bgPage,
      fontFamily: 'Inter, system-ui, sans-serif',
      padding: '40px 20px',
    }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        
        {/* Top Navigation */}
        <div style={{ marginBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: 'none',
              color: theme.textMuted,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              padding: '8px 0',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.color = theme.primary}
            onMouseLeave={e => e.currentTarget.style.color = theme.textMuted}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: theme.textMain, letterSpacing: '-0.025em', marginBottom: 12 }}>
            Create a new workflow
          </h1>
          <p style={{ fontSize: 16, color: theme.textMuted, maxWidth: 500, margin: '0 auto' }}>
            Select a pre-built template to jumpstart your automation or design one from the ground up.
          </p>
        </div>

        {/* Main Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 24,
        }}>
          
          {/* Special Option: Blank Workflow */}
          <div
            onClick={() => onSelect(null)}
            style={{
              background: theme.bgCard,
              border: `2px dashed ${theme.border}`,
              borderRadius: 16,
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = theme.primary;
              e.currentTarget.style.background = '#f5f7ff';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = theme.border;
              e.currentTarget.style.background = theme.bgCard;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#eef2ff', color: theme.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, marginBottom: 16, fontWeight: 600
            }}>＋</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: theme.textMain, marginBottom: 8 }}>Blank Canvas</h3>
            <p style={{ fontSize: 14, color: theme.textMuted, lineHeight: 1.5 }}>
              For advanced users. Build every step of your logic manually.
            </p>
          </div>

          {/* Template Cards */}
          {templates.map(t => (
            <TemplateCard key={t.id} template={t} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ template, onSelect }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onClick={() => onSelect(template)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: theme.bgCard,
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
        padding: 24,
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: hover ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : 'none',
        transform: hover ? 'translateY(-4px)' : 'none',
      }}
    >
      {/* Visual Identity */}
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: template.bg, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 24, marginBottom: 16,
        border: `1px solid ${template.border}44`
      }}>
        {template.icon}
      </div>

      <h3 style={{ fontSize: 17, fontWeight: 700, color: theme.textMain, marginBottom: 8 }}>
        {template.name}
      </h3>
      <p style={{ fontSize: 14, color: theme.textMuted, marginBottom: 20, lineHeight: 1.5, flex: 1 }}>
        {template.description}
      </p>

      {/* Meta Information (Pills) */}
      <div style={{ marginBottom: 20 }}>
        <NodePills template={template} />
      </div>

      {/* Footer CTA */}
      <div style={{
        paddingTop: 16,
        borderTop: `1px solid ${theme.border}`,
        fontSize: 13,
        fontWeight: 600,
        color: template.color,
        display: 'flex',
        alignItems: 'center',
        gap: 6
      }}>
        Use Template 
        <span style={{ 
          transform: hover ? 'translateX(4px)' : 'none', 
          transition: 'transform 0.2s' 
        }}>→</span>
      </div>
    </div>
  );
}

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
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {Object.entries(counts).map(([type, count]) => {
        const c = pillColors[type] || pillColors.text;
        return (
          <span key={type} style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            background: c.bg,
            color: c.color,
            padding: '4px 10px',
            borderRadius: 6,
          }}>
            {count} {type}
          </span>
        );
      })}
    </div>
  );
}