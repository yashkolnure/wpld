import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5002';

const PROVIDERS = [
  { id: 'openai',    name: 'ChatGPT',  sub: 'OpenAI',    emoji: '🟢', models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini'], keyHint: 'sk-...',     keyUrl: 'https://platform.openai.com/api-keys' },
  { id: 'gemini',    name: 'Gemini',   sub: 'Google',    emoji: '🔷', models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'], keyHint: 'AIza...', keyUrl: 'https://aistudio.google.com/app/apikey' },
  { id: 'anthropic',  name: 'Claude',     sub: 'Anthropic', emoji: '🟣', models: ['claude-haiku-4-5', 'claude-sonnet-4-5', 'claude-3-5-haiku-latest'], keyHint: 'sk-ant-...', keyUrl: 'https://console.anthropic.com/settings/keys' },
  { id: 'openrouter', name: 'OpenRouter', sub: '400+ models, one key', emoji: '🧭', models: ['openai/gpt-4o-mini', 'anthropic/claude-3.5-sonnet', 'google/gemini-2.0-flash-001', 'meta-llama/llama-3.3-70b-instruct'], keyHint: 'sk-or-v1-...', keyUrl: 'https://openrouter.ai/keys' },
  { id: 'custom',     name: 'Custom',     sub: 'OpenAI-compatible', emoji: '⚙️', models: [], keyHint: 'your API key', keyUrl: null },
];

const DEFAULT_PROMPT = 'You are a helpful customer-support assistant for our business, replying on WhatsApp. Keep answers short, friendly and clear. If you do not know something, offer to connect the customer with a human.';

const PRESETS = [
  { label: '🎧 Support',     prompt: DEFAULT_PROMPT },
  { label: '💼 Sales',       prompt: 'You are a warm, persuasive sales assistant on WhatsApp. Understand the customer\'s need, recommend the right product, and gently move them toward booking a demo or buying. Keep replies short and end with a question.' },
  { label: '❓ FAQ bot',     prompt: 'You answer frequently asked questions about our business concisely and accurately on WhatsApp. If a question is outside common FAQs, say you\'ll connect them with the team. Never invent policies or prices.' },
  { label: '📅 Receptionist', prompt: 'You are a friendly receptionist on WhatsApp. Greet the customer, find out what they need, collect their name and preferred time, and confirm next steps. Keep it brief and polite.' },
];

const PROVIDER_NAME = Object.fromEntries(PROVIDERS.map(p => [p.id, p.name]));

export default function AISettings() {
  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);

  const [provider, setProvider]         = useState('openai');
  const [model, setModel]               = useState('gpt-4o-mini');
  const [modelManual, setModelManual]   = useState(false); // true = typing a custom model name
  const [apiKey, setApiKey]             = useState('');
  const [showKey, setShowKey]           = useState(false);
  const [hasApiKey, setHasApiKey]       = useState(false);
  const [baseUrl, setBaseUrl]           = useState('');
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_PROMPT);
  const [temperature, setTemperature]   = useState(0.7);
  const [maxTokens, setMaxTokens]       = useState(500);
  const [enabled, setEnabled]           = useState(false);
  const [directConnect, setDirect]      = useState(false);

  const [savedSnap, setSavedSnap] = useState('');   // snapshot of last-saved state
  const [saveMsg, setSaveMsg]     = useState(null);  // { ok, text }

  const meta     = PROVIDERS.find(p => p.id === provider) || PROVIDERS[0];
  const keyReady = hasApiKey || apiKey.trim().length > 0;

  const snapshot = () => JSON.stringify({
    provider, model: (model || '').trim(), baseUrl: (baseUrl || '').trim(),
    systemPrompt, temperature: Number(temperature), maxTokens: Number(maxTokens),
    enabled, directConnect,
  });
  const dirty = snapshot() !== savedSnap || apiKey.trim().length > 0;

  // ── Load ──
  useEffect(() => {
    axios.get(`${API}/api/ai/config`, { headers })
      .then(r => {
        const c = r.data.config;
        if (c) {
          setProvider(c.provider || 'openai');
          setModel(c.model || 'gpt-4o-mini');
          // If the saved model isn't one of the known presets, start in manual mode.
          const known = (PROVIDERS.find(p => p.id === (c.provider || 'openai'))?.models) || [];
          setModelManual((c.provider === 'custom') || !known.includes(c.model || ''));
          setHasApiKey(!!c.hasApiKey);
          setBaseUrl(c.baseUrl || '');
          setSystemPrompt(c.systemPrompt || DEFAULT_PROMPT);
          setTemperature(c.temperature ?? 0.7);
          setMaxTokens(c.maxTokens ?? 500);
          setEnabled(!!c.enabled);
          setDirect(!!c.directConnect);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  // After first load, capture the saved snapshot so "dirty" starts false.
  useEffect(() => {
    if (!loading) setSavedSnap(snapshot());
  }, [loading]); // eslint-disable-line

  const pickProvider = (id) => {
    setProvider(id);
    const p = PROVIDERS.find(x => x.id === id);
    if (p && p.models.length) { setModel(p.models[0]); setModelManual(false); }
    else { setModel(''); setModelManual(true); } // custom provider → free-text model
  };

  const toggleEnabled = () => {
    setEnabled(v => {
      const next = !v;
      if (!next) setDirect(false); // direct-connect can't be on without AI enabled
      return next;
    });
  };

  const save = async () => {
    if (!model.trim()) { setSaveMsg({ ok: false, text: 'Enter a model name' }); return; }
    setSaving(true); setSaveMsg(null);
    try {
      const body = {
        // Base URL only belongs to the Custom provider; send '' otherwise so a
        // leftover value can't get attached to OpenRouter/OpenAI/etc.
        provider, model: model.trim(), baseUrl: provider === 'custom' ? baseUrl.trim() : '', systemPrompt,
        temperature: Number(temperature), maxTokens: Number(maxTokens),
        enabled, directConnect,
        ...(apiKey.trim() ? { apiKey: apiKey.trim() } : {}),
      };
      const r = await axios.put(`${API}/api/ai/config`, body, { headers });
      const c = r.data.config;
      setHasApiKey(!!c.hasApiKey);
      setApiKey('');
      // recompute saved snapshot from the values we just persisted
      setSavedSnap(JSON.stringify({
        provider: c.provider, model: (c.model || '').trim(), baseUrl: (c.baseUrl || '').trim(),
        systemPrompt: c.systemPrompt, temperature: Number(c.temperature), maxTokens: Number(c.maxTokens),
        enabled: !!c.enabled, directConnect: !!c.directConnect,
      }));
      setSaveMsg({ ok: true, text: 'Saved' });
      setTimeout(() => setSaveMsg(null), 2500);
    } catch (e) {
      setSaveMsg({ ok: false, text: e.response?.data?.message || 'Save failed' });
    } finally {
      setSaving(false);
    }
  };

  const disconnect = async () => {
    if (!window.confirm('Disconnect AI and delete the stored API key? This cannot be undone.')) return;
    try {
      await axios.delete(`${API}/api/ai/config`, { headers });
    } catch { /* ignore — reset locally regardless */ }
    setProvider('openai'); setModel('gpt-4o-mini'); setApiKey(''); setHasApiKey(false);
    setBaseUrl(''); setSystemPrompt(DEFAULT_PROMPT); setTemperature(0.7); setMaxTokens(500);
    setEnabled(false); setDirect(false);
    setSavedSnap(JSON.stringify({ provider: 'openai', model: 'gpt-4o-mini', baseUrl: '', systemPrompt: DEFAULT_PROMPT, temperature: 0.7, maxTokens: 500, enabled: false, directConnect: false }));
    setSaveMsg({ ok: true, text: 'Disconnected' });
    setTimeout(() => setSaveMsg(null), 2500);
  };

  const previewSettings = { provider, model, baseUrl: provider === 'custom' ? baseUrl : '', systemPrompt, temperature, maxTokens, apiKey };

  if (loading) {
    return <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>Loading AI settings…</div>;
  }

  // ── Status badge ──
  const status = !keyReady ? { label: 'Not connected', color: '#6b7280', bg: '#f3f4f6', dot: '#9ca3af' }
    : !enabled            ? { label: 'Connected · off', color: '#b45309', bg: '#fffbeb', dot: '#f59e0b' }
    :                       { label: 'Active', color: '#047857', bg: '#ecfdf5', dot: '#10b981' };

  return (
    <div style={{ animation: 'wpl-fadein 0.4s ease both', maxWidth: 1080 }}>
      <style>{`
        .aiset { display:grid; grid-template-columns:1fr; gap:16px; }
        @media (min-width:1040px){
          .aiset { grid-template-columns:minmax(0,1fr) 388px; align-items:start; }
          .aiset-side { position:sticky; top:8px; }
        }
        .ai-dot { animation: ai-pulse 1.6s ease-in-out infinite; }
        @keyframes ai-pulse { 0%,100%{opacity:1} 50%{opacity:.35} }
        @keyframes ai-typing { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }
      `}</style>

      {/* ── STATUS HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '14px 18px', marginBottom: 16 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#9333ea,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🤖</div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#111827' }}>AI Assistant</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280' }}>
            {keyReady ? <>{PROVIDER_NAME[provider]} · <code style={{ fontSize: 11, color: '#9333ea' }}>{model || '—'}</code></> : 'Bring your own LLM — used by the AI Reply node & direct chat'}
          </p>
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 700, color: status.color, background: status.bg, borderRadius: 20, padding: '6px 13px' }}>
          <span className={status.dot === '#10b981' ? 'ai-dot' : ''} style={{ width: 8, height: 8, borderRadius: '50%', background: status.dot }} />
          {status.label}
        </span>
        {directConnect && enabled && (
          <span style={{ fontSize: 11, fontWeight: 700, color: '#1d4ed8', background: '#eff6ff', borderRadius: 20, padding: '6px 12px' }}>⚡ Auto-replies on</span>
        )}
      </div>

      <div className="aiset">
        {/* ════ LEFT: configuration ════ */}
        <div>
          {/* 1 · Provider */}
          <Section step="1" title="Choose your AI provider">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: 10 }}>
              {PROVIDERS.map(p => {
                const on = provider === p.id;
                return (
                  <button key={p.id} onClick={() => pickProvider(p.id)}
                    style={{
                      textAlign: 'left', cursor: 'pointer', borderRadius: 12, padding: '12px 14px',
                      border: `1.5px solid ${on ? '#9333ea' : '#e5e7eb'}`,
                      background: on ? '#faf5ff' : '#fff',
                      boxShadow: on ? '0 2px 10px rgba(147,51,234,0.12)' : 'none', transition: 'all 0.12s',
                    }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{p.emoji}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: on ? '#7e22ce' : '#111827' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{p.sub}</div>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* 2 · Credentials */}
          <Section step="2" title="API key & model">
            <label style={labelStyle}>Model</label>
            {meta.models.length > 0 && !modelManual ? (
              <select
                style={{ ...inputStyle, appearance: 'auto', cursor: 'pointer' }}
                value={meta.models.includes(model) ? model : meta.models[0]}
                onChange={e => {
                  if (e.target.value === '__custom__') { setModelManual(true); setModel(''); }
                  else setModel(e.target.value);
                }}>
                {meta.models.map(m => <option key={m} value={m}>{m}</option>)}
                <option value="__custom__">✏️  Other / custom model…</option>
              </select>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <input style={{ ...inputStyle, flex: 1 }} value={model} onChange={e => setModel(e.target.value)}
                  placeholder={meta.models[0] || 'e.g. gpt-4o-mini'} autoFocus={meta.models.length > 0} />
                {meta.models.length > 0 && (
                  <button style={ghostBtn} onClick={() => { setModelManual(false); setModel(meta.models[0]); }}>
                    Presets
                  </button>
                )}
              </div>
            )}

            <label style={{ ...labelStyle, marginTop: 14 }}>
              API key {hasApiKey && <span style={{ color: '#059669', fontWeight: 700 }}>· saved ✓</span>}
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type={showKey ? 'text' : 'password'} style={{ ...inputStyle, flex: 1 }} value={apiKey}
                onChange={e => setApiKey(e.target.value)} autoComplete="off"
                placeholder={hasApiKey ? '•••••••••• (leave blank to keep current)' : meta.keyHint} />
              <button onClick={() => setShowKey(v => !v)} style={ghostBtn}>{showKey ? 'Hide' : 'Show'}</button>
            </div>
            {meta.keyUrl && (
              <p style={hintStyle}>
                Get a key from <a href={meta.keyUrl} target="_blank" rel="noreferrer" style={{ color: '#9333ea', fontWeight: 600 }}>{meta.keyUrl.replace(/^https?:\/\//, '')}</a> · stored encrypted, never shown again.
              </p>
            )}

            {provider === 'custom' && (
              <>
                <label style={{ ...labelStyle, marginTop: 14 }}>Base URL (OpenAI-compatible)</label>
                <input style={inputStyle} value={baseUrl} onChange={e => setBaseUrl(e.target.value)} placeholder="https://your-endpoint.com/v1" />
                <p style={hintStyle}>The server posts to <code style={codeStyle}>{'{base}/chat/completions'}</code>.</p>
              </>
            )}
          </Section>

          {/* 3 · Behaviour */}
          <Section step="3" title="Personality & behaviour">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ ...labelStyle, margin: 0 }}>System prompt</label>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                {PRESETS.map(p => (
                  <button key={p.label} onClick={() => setSystemPrompt(p.prompt)} title="Use this template"
                    style={chipBtn}>{p.label}</button>
                ))}
              </div>
            </div>
            <textarea style={{ ...inputStyle, minHeight: 96, resize: 'vertical' }} value={systemPrompt}
              onChange={e => setSystemPrompt(e.target.value)} placeholder={DEFAULT_PROMPT} />

            <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 190 }}>
                <label style={labelStyle}>Creativity · {Number(temperature).toFixed(1)}</label>
                <input type="range" min={0} max={1} step={0.1} value={temperature}
                  onChange={e => setTemperature(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#9333ea' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9ca3af' }}><span>Precise</span><span>Creative</span></div>
              </div>
              <div style={{ width: 130 }}>
                <label style={labelStyle}>Max length</label>
                <input type="number" min={50} max={4000} step={50} style={inputStyle} value={maxTokens}
                  onChange={e => setMaxTokens(e.target.value)} />
                <p style={hintStyle}>tokens / reply</p>
              </div>
            </div>
          </Section>

          {/* 4 · Activation */}
          <Section step="4" title="Where it runs">
            <Toggle checked={enabled} onChange={toggleEnabled} disabled={!keyReady}
              title="Enable AI"
              desc="Master switch. Required for the AI Reply node in workflows and for direct chat." />
            {!keyReady && <p style={{ ...hintStyle, color: '#b45309', marginLeft: 54 }}>Add an API key above to enable.</p>}

            <div style={{ height: 1, background: '#f1f5f9', margin: '14px 0' }} />

            <Toggle checked={directConnect} onChange={() => setDirect(v => !v)} disabled={!enabled}
              title="Direct connect to WhatsApp"
              desc="When no workflow keyword matches an incoming message, the AI answers it automatically — a full chatbot with zero setup." />
            {directConnect && enabled && (
              <div style={{ marginLeft: 54, marginTop: 8, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '8px 11px' }}>
                <p style={{ margin: 0, fontSize: 11.5, color: '#1e40af', lineHeight: 1.5 }}>
                  ⚡ The AI will reply to <b>every</b> message your workflows don't handle. It uses recent
                  chat history for context and only sends within WhatsApp's 24-hour window.
                </p>
              </div>
            )}
          </Section>

          {/* Save bar */}
          <div style={{ position: 'sticky', bottom: 0, display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(6px)', borderTop: '1px solid #f1f5f9', padding: '12px 2px', marginTop: 4 }}>
            <button onClick={save} disabled={saving || !dirty}
              style={{ ...primaryBtn, opacity: (saving || !dirty) ? 0.55 : 1, cursor: (saving || !dirty) ? 'default' : 'pointer' }}>
              {saving ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
            </button>
            {dirty && !saving && <span style={{ fontSize: 12, color: '#b45309', fontWeight: 600 }}>Unsaved changes</span>}
            {saveMsg && <span style={{ fontSize: 13, fontWeight: 700, color: saveMsg.ok ? '#059669' : '#dc2626' }}>{saveMsg.ok ? '✓ ' : ''}{saveMsg.text}</span>}
            <div style={{ flex: 1 }} />
            {(hasApiKey || enabled) && (
              <button onClick={disconnect} style={{ ...ghostBtn, color: '#dc2626', borderColor: '#fecaca' }}>Disconnect</button>
            )}
          </div>
        </div>

        {/* ════ RIGHT: live preview ════ */}
        <div className="aiset-side">
          <PreviewChat settings={previewSettings} keyReady={keyReady} headers={headers} />
        </div>
      </div>
    </div>
  );
}

// ── Live test chat ────────────────────────────────────────────────────────────
function PreviewChat({ settings, keyReady, headers }) {
  const [msgs, setMsgs]   = useState([]);   // { role:'user'|'assistant'|'error', content }
  const [input, setInput] = useState('');
  const [busy, setBusy]   = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, busy]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    const history = [...msgs.filter(m => m.role !== 'error'), { role: 'user', content: text }];
    setMsgs(m => [...m, { role: 'user', content: text }]);
    setInput(''); setBusy(true);
    try {
      const r = await axios.post(`${API}/api/ai/test`, {
        provider: settings.provider, model: settings.model, baseUrl: settings.baseUrl,
        systemPrompt: settings.systemPrompt, temperature: Number(settings.temperature),
        maxTokens: Number(settings.maxTokens),
        ...(settings.apiKey.trim() ? { apiKey: settings.apiKey.trim() } : {}),
        messages: history.map(m => ({ role: m.role, content: m.content })),
      }, { headers });
      setMsgs(m => [...m, { role: 'assistant', content: r.data.reply || '(empty response)' }]);
    } catch (e) {
      setMsgs(m => [...m, { role: 'error', content: e.response?.data?.message || 'Request failed' }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 540, maxHeight: '78vh' }}>
      {/* header */}
      <div style={{ background: '#075e54', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#128c7e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>Try your assistant</p>
          <p style={{ fontSize: 10.5, color: '#b2dfdb', margin: 0 }}>Live preview · uses current settings</p>
        </div>
        {msgs.length > 0 && (
          <button onClick={() => setMsgs([])} style={{ fontSize: 11, color: '#b2dfdb', background: 'none', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, padding: '4px 9px', cursor: 'pointer', fontWeight: 600 }}>↺ Reset</button>
        )}
      </div>

      {/* messages */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#efeae2', padding: '14px 12px' }}>
        {!keyReady ? (
          <div style={{ textAlign: 'center', padding: '48px 18px', color: '#6b7280' }}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>🔑</div>
            <p style={{ fontSize: 12.5, margin: 0, lineHeight: 1.6 }}>Add your API key to chat with your assistant here — no need to save first.</p>
          </div>
        ) : msgs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 18px', color: '#6b7280' }}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>💬</div>
            <p style={{ fontSize: 12.5, margin: 0, lineHeight: 1.6 }}>Send a message below to test how your AI replies on WhatsApp.</p>
          </div>
        ) : msgs.map((m, i) => {
          if (m.role === 'error') {
            return <div key={i} style={{ margin: '6px auto', maxWidth: '90%', background: '#fff', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 11px' }}>
              <p style={{ margin: 0, fontSize: 11.5, color: '#dc2626' }}>⚠️ {m.content}</p>
            </div>;
          }
          const isUser = m.role === 'user';
          return (
            <div key={i} style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 5 }}>
              <div style={{ background: isUser ? '#d9fdd3' : '#fff', borderRadius: 8, padding: '6px 9px 7px', maxWidth: '82%', boxShadow: '0 1px 0.5px rgba(11,20,26,0.13)' }}>
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.45, color: '#111b21', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{m.content}</p>
              </div>
            </div>
          );
        })}
        {busy && (
          <div style={{ display: 'flex', marginBottom: 5 }}>
            <div style={{ background: '#fff', borderRadius: 8, padding: '9px 13px', boxShadow: '0 1px 0.5px rgba(11,20,26,0.13)' }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(j => <span key={j} style={{ width: 7, height: 7, borderRadius: '50%', background: '#90a4ae', animation: `ai-typing 1.2s ease-in-out ${j * 0.2}s infinite` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* input */}
      <div style={{ background: '#f0f0f0', padding: '9px 11px', display: 'flex', gap: 8, alignItems: 'center', borderTop: '1px solid #ddd', flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          disabled={!keyReady || busy}
          placeholder={keyReady ? 'Type a test message…' : 'Add an API key first'}
          style={{ flex: 1, border: 'none', borderRadius: 20, padding: '9px 14px', fontSize: 13, outline: 'none', background: '#fff', opacity: keyReady ? 1 : 0.6 }} />
        <button onClick={send} disabled={!keyReady || busy || !input.trim()}
          style={{ width: 38, height: 38, borderRadius: '50%', background: (!keyReady || busy || !input.trim()) ? '#cbd5e1' : '#25d366', border: 'none', cursor: (!keyReady || busy || !input.trim()) ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
        </button>
      </div>
    </div>
  );
}

// ── Presentational helpers ────────────────────────────────────────────────────
function Section({ step, title, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '16px 18px', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
        <span style={{ width: 22, height: 22, borderRadius: 7, background: '#faf5ff', color: '#9333ea', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{step}</span>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#374151' }}>{title}</p>
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, disabled, title, desc }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, opacity: disabled ? 0.55 : 1 }}>
      <button onClick={disabled ? undefined : onChange} aria-pressed={checked}
        style={{ width: 42, height: 24, borderRadius: 24, border: 'none', flexShrink: 0, marginTop: 2, background: checked ? '#9333ea' : '#d1d5db', position: 'relative', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background 0.15s' }}>
        <span style={{ position: 'absolute', top: 3, left: checked ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
      </button>
      <div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#111827' }}>{title}</p>
        <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280', lineHeight: 1.5 }}>{desc}</p>
      </div>
    </div>
  );
}

const labelStyle = { fontSize: 11, fontWeight: 700, color: '#4b5563', display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.04em' };
const inputStyle = { width: '100%', border: '1px solid #e5e7eb', borderRadius: 8, padding: '9px 11px', fontSize: 13, boxSizing: 'border-box', background: '#fff', outline: 'none' };
const hintStyle  = { fontSize: 11, color: '#9ca3af', margin: '6px 0 0', lineHeight: 1.5 };
const codeStyle  = { background: '#faf5ff', color: '#9333ea', borderRadius: 4, padding: '1px 5px', fontSize: 11 };
const primaryBtn = { color: '#fff', border: 'none', borderRadius: 9, padding: '10px 20px', fontSize: 13, fontWeight: 700, background: 'linear-gradient(135deg,#9333ea,#7c3aed)', boxShadow: '0 2px 10px rgba(147,51,234,0.3)' };
const ghostBtn   = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#374151', cursor: 'pointer', flexShrink: 0 };
const chipBtn    = { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 14, padding: '3px 9px', fontSize: 11, fontWeight: 600, color: '#4b5563', cursor: 'pointer' };
