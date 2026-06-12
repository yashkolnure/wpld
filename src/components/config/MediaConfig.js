import { useRef, useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5002';

// Accept filter per media type (mirrors the server's ALLOWED list).
const ACCEPT = {
  image:    'image/png,image/jpeg,image/webp,image/gif',
  video:    'video/mp4,video/3gpp',
  document: '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};
const HELP = { image: 'JPG, PNG, WEBP, GIF', video: 'MP4, 3GPP', document: 'PDF, DOC, DOCX' };

export default function MediaConfig({ data, onChange }) {
  const msg       = data.message || {};
  const mediaType = msg.mediaType || 'image';
  const update    = (patch) => onChange({ ...data, message: { ...msg, type: 'media', ...patch } });

  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    setErr(''); setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const token = localStorage.getItem('token');
      const r = await axios.post(`${API}/api/media/upload`, form, { headers: { Authorization: `Bearer ${token}` } });
      update({ mediaUrl: r.data.url, mediaFilename: r.data.filename });
    } catch (e) {
      setErr(e.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label style={labelStyle}>Media type</label>
        <select style={inputStyle} value={mediaType} onChange={e => update({ mediaType: e.target.value })}>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="document">Document</option>
        </select>
      </div>

      {/* Upload */}
      <div>
        <label style={labelStyle}>Upload file</label>
        <input ref={fileRef} type="file" accept={ACCEPT[mediaType]} style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files?.[0])} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          style={{ width: '100%', border: '1.5px dashed #d1d5db', borderRadius: 10, padding: '14px', background: '#f9fafb', cursor: uploading ? 'default' : 'pointer', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>
          {uploading ? 'Uploading…' : '⬆️  Choose a file to upload'}
        </button>
        {err && <p style={{ fontSize: 11, color: '#dc2626', margin: '6px 0 0' }}>{err}</p>}
        <p style={hintStyle}>Max 16 MB · {HELP[mediaType]}</p>
      </div>

      {/* Current media */}
      {msg.mediaUrl && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 10, background: '#fff', display: 'flex', gap: 10, alignItems: 'center' }}>
          {mediaType === 'image'
            ? <img src={msg.mediaUrl} alt="" style={{ width: 46, height: 46, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} onError={e => { e.target.style.visibility = 'hidden'; }} />
            : <span style={{ fontSize: 24, width: 46, textAlign: 'center' }}>{mediaType === 'video' ? '🎬' : '📄'}</span>}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {msg.mediaFilename || msg.mediaUrl.split('/').pop()}
            </p>
            <p style={{ margin: 0, fontSize: 10, color: '#16a34a' }}>Ready to send ✓</p>
          </div>
          <button onClick={() => update({ mediaUrl: '', mediaFilename: '' })} title="Remove"
            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>×</button>
        </div>
      )}

      {/* OR paste a URL */}
      <div>
        <label style={labelStyle}>…or paste a media URL</label>
        <input style={inputStyle} value={msg.mediaUrl || ''} onChange={e => update({ mediaUrl: e.target.value, mediaFilename: '' })} placeholder="https://..." />
      </div>

      <div>
        <label style={labelStyle}>Caption (optional)</label>
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} value={msg.mediaCaption || ''} onChange={e => update({ mediaCaption: e.target.value })} placeholder="Caption text" />
      </div>
    </div>
  );
}

const labelStyle = { fontSize: 11, fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: 4 };
const inputStyle = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '7px 10px', fontSize: 13, boxSizing: 'border-box', background: '#fff' };
const hintStyle  = { fontSize: 11, color: '#9ca3af', margin: '6px 0 0', lineHeight: 1.5 };
