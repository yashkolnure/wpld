import axios from 'axios';
import WhatsApp from '../models/WhatsApp.js';
import { decrypt } from '../utils/encrypt.js';

const getWaCreds = async (userId) => {
  const wa = await WhatsApp.findOne({ userId, isVerified: true });
  if (!wa) throw new Error('WhatsApp not connected');
  return { token: decrypt(wa.encryptedToken), wabaId: wa.wabaId, phoneNumberId: wa.phoneNumberId };
};

// GET /api/templates
export const listTemplates = async (req, res) => {
  try {
    const { token, wabaId } = await getWaCreds(req.user._id);
    const metaRes = await axios.get(
      `https://graph.facebook.com/v19.0/${wabaId}/message_templates`,
      {
        params: { fields: 'id,name,status,category,language,components', limit: 100 },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json(metaRes.data.data || []);
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message;
    res.status(500).json({ message: msg });
  }
};

// POST /api/templates
export const createTemplate = async (req, res) => {
  try {
    const { token, wabaId } = await getWaCreds(req.user._id);
    const { name, category, language, header, body, footer, buttons } = req.body;

    if (!name || !category || !language || !body) {
      return res.status(400).json({ message: 'name, category, language and body are required' });
    }

    // Sanitize template name: lowercase, underscores only
    const safeName = name.toLowerCase().replace(/[^a-z0-9_]/g, '_');

    const components = [];

    if (header?.trim()) {
      components.push({ type: 'HEADER', format: 'TEXT', text: header.trim() });
    }

    components.push({ type: 'BODY', text: body.trim() });

    if (footer?.trim()) {
      components.push({ type: 'FOOTER', text: footer.trim() });
    }

    if (buttons?.length > 0) {
      components.push({
        type: 'BUTTONS',
        buttons: buttons.map(b => ({
          type: b.type || 'QUICK_REPLY',
          text: b.text,
          ...(b.type === 'URL' ? { url: b.url } : {}),
          ...(b.type === 'PHONE_NUMBER' ? { phone_number: b.phone } : {}),
        })),
      });
    }

    const metaRes = await axios.post(
      `https://graph.facebook.com/v19.0/${wabaId}/message_templates`,
      { name: safeName, language, category, components },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );

    res.json({ success: true, template: metaRes.data });
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message;
    res.status(400).json({ message: msg });
  }
};

// DELETE /api/templates/:name
export const deleteTemplate = async (req, res) => {
  try {
    const { token, wabaId } = await getWaCreds(req.user._id);
    await axios.delete(
      `https://graph.facebook.com/v19.0/${wabaId}/message_templates`,
      {
        params: { name: req.params.name },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json({ success: true });
  } catch (err) {
    const msg = err.response?.data?.error?.message || err.message;
    res.status(400).json({ message: msg });
  }
};
