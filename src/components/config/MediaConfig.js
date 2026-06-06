import { useState, useRef } from 'react';
import axios from 'axios';
import { META, cpLength } from '../../utils/metaLimits';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5005';

const ACCEPT = {
  image:    'image/jpeg,image/png,image/webp,image/gif',
  video:    'video/mp4,video/3gpp',
  document: 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export default function MediaConfig({ data, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState('');
  const fileRef = useRef(null);

  const msg    = data.message || {};
  const update = (patch) => onChange({ ...data, message: { ...msg, type: 'media', ...patch } });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadErr('');
    try {
      const form = new FormData();
      form.append('file', file);
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API}/api/media/upload`, form, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      update({ mediaUrl: res.data.url });
    } catch (err) {
      setUploadErr(err.response?.data?.message || 'Upload failed. Try pasting a direct URL instead.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const mediaType = msg.mediaType || 'image';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* Media type toggle */}
      <div>
        <label style={labelStyle}>Media type</label>
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          {[
            { t: 'image',    icon: '🖼️' },
            { t: 'video',    icon: '🎬' },
            { t: 'document', icon: '📄' },
          ].map(({ t, icon }) => (
            <button
              key={t}
              onClick={() => update({ mediaType: t, mediaUrl: '' })}
              style={{
                flex: 1, padding: '7px 0', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                border: `1.5px solid ${mediaType === t ? '#db2777' : '#e5e7eb'}`,
                background: mediaType === t ? '#fdf2f8' : '#fff',
                color: mediaType === t ? '#9d174d' : '#6b7280',
              }}
            >
              {icon} {t}
            </button>
          ))}
        </div>
      </div>

      {/* URL input */}
      <div>
        <label style={labelStyle}>Media URL <span style={{ color: '#e53e3e' }}>*</span></label>
        <input
          style={inputStyle}
          value={msg.mediaUrl || ''}
          onChange={e => update({ mediaUrl: e.target.value })}
          placeholder="https://..."
        />
      </div>

      {/* Upload button */}
      <div>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT[mediaType]}
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{
            width: '100%', padding: '9px 0', borderRadius: 8,
            border: '1.5px dashed #e5e7eb', background: uploading ? '#f3f4f6' : '#fafafa',
            fontSize: 12, fontWeight: 600, color: uploading ? '#9ca3af' : '#374151',
            cursor: uploading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {uploading
            ? '⏳ Uploading...'
            : `⬆️  Upload ${mediaType} file`
          }
        </button>
        {uploadErr && (
          <p style={{ fontSize: 11, color: '#ef4444', margin: '4px 0 0' }}>{uploadErr}</p>
        )}
        <p style={{ fontSize: 10, color: '#9ca3af', margin: '4px 0 0' }}>
          Max 16 MB ·{' '}
          {mediaType === 'video' ? 'MP4, 3GP' : mediaType === 'document' ? 'PDF, DOCX' : 'JPG, PNG, WEBP, GIF'}
        </p>
      </div>

      {/* Inline image preview */}
      {msg.mediaUrl && mediaType === 'image' && (
        <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
          <img
            src={msg.mediaUrl}
            alt="preview"
            style={{ width: '100%', maxHeight: 130, objectFit: 'cover', display: 'block' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        </div>
      )}

      {/* Caption */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <label style={labelStyle}>Caption (optional)</label>
          <span style={{ fontSize: 10, fontWeight: 600, fontFamily: 'monospace', color: cpLength(msg.mediaCaption) > META.media.caption ? '#dc2626' : '#9ca3af' }}>
            {cpLength(msg.mediaCaption)}/{META.media.caption}
          </span>
        </div>
        <textarea
          style={{ ...inputStyle, resize: 'vertical', minHeight: 56 }}
          value={msg.mediaCaption || ''}
          onChange={e => {
            const cps = [...e.target.value];
            update({ mediaCaption: cps.length <= META.media.caption ? e.target.value : cps.slice(0, META.media.caption).join('') });
          }}
          placeholder={`Caption text. Supports {{variable}} personalization.`}
        />
      </div>

    </div>
  );
}

const labelStyle = { fontSize: 11, fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' };
const inputStyle = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 10px', fontSize: 13, boxSizing: 'border-box', background: '#fff', outline: 'none' };
