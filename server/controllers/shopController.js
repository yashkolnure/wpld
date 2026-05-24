import axios from 'axios';
import WhatsApp from '../models/WhatsApp.js';
import ShopCatalog from '../models/ShopCatalog.js';
import { decrypt } from '../utils/encrypt.js';

const GRAPH = 'https://graph.facebook.com/v19.0';

// ── Helpers ────────────────────────────────────────────────────────────────────
const getWaAndToken = async (userId) => {
  const wa = await WhatsApp.findOne({ userId, isVerified: true });
  if (!wa) throw new Error('WhatsApp not connected. Please connect WhatsApp first.');
  const token = (wa.connectionType === 'platform')
    ? process.env.SYSTEM_USER_TOKEN
    : decrypt(wa.encryptedToken);
  // For platform users the real WABA is the shared one stored in env
  const wabaId = (wa.connectionType === 'platform') ? process.env.WABA_ID : wa.wabaId;
  return { wa, token, wabaId };
};

const metaErr = (err) => {
  const e = err.response?.data?.error;
  return { status: err.response?.status || 500, message: e?.message || err.message, code: e?.code };
};

// ── POST /api/shop/catalog/create ───────────────────────────────────────────────
// Always uses SYSTEM_USER_TOKEN + BUSINESS_ID from env for catalog creation.
// Reason: embedded-signup user tokens only get `whatsapp_business_management`
// scope — NOT `catalog_management`. Only the platform system user has the
// correct permissions to create catalogs via API.
// The catalog is then linked to the user's WABA and stored in our DB with userId.
export const createCatalog = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Catalog name is required' });

    // Validate server config
    const sysToken    = process.env.SYSTEM_USER_TOKEN;
    const businessId  = process.env.BUSINESS_ID;
    if (!sysToken || !businessId) {
      return res.status(500).json({
        message: 'Server not configured for catalog creation. Ensure SYSTEM_USER_TOKEN and BUSINESS_ID are set in server/.env.',
      });
    }

    // Get user's WABA for linking
    const { wabaId, token: userToken } = await getWaAndToken(req.user._id);

    // 1. Create the catalog using platform system token (has catalog_management permission)
    const { data: catData } = await axios.post(
      `${GRAPH}/${businessId}/owned_product_catalogs`,
      { name: name.trim(), vertical: 'commerce' },
      { params: { access_token: sysToken } }
    );

    const catalogId = catData?.id;
    if (!catalogId) return res.status(500).json({ message: 'Catalog created but no ID returned from Meta' });

    // 2. Link catalog to user's WABA (try system token first, then user token)
    //    This enables the WhatsApp Commerce tab on their number.
    //    Non-fatal — products can still be sent via message payload even if this fails.
    const linkPayload = { catalog_id: catalogId };
    try {
      await axios.post(`${GRAPH}/${wabaId}/product_catalogs`, linkPayload, { params: { access_token: sysToken } });
    } catch (_) {
      try {
        await axios.post(`${GRAPH}/${wabaId}/product_catalogs`, linkPayload, { params: { access_token: userToken } });
      } catch (_2) { /* non-fatal — catalog is created, just not linked to WABA commerce tab */ }
    }

    // 3. Save scoped to this user — never shared across users
    const catalog = await ShopCatalog.findOneAndUpdate(
      { userId: req.user._id },
      { catalogId, name: name.trim(), isActive: true },
      { upsert: true, new: true }
    );

    res.status(201).json({ catalog, created: true });
  } catch (err) {
    const e = metaErr(err);
    res.status(e.status).json({ message: e.message, code: e.code });
  }
};

// ── GET /api/shop/catalog ────────────────────────────────────────────────────────
// Returns only this user's catalog from our DB — never exposes other users' catalogs.
export const getCatalog = async (req, res) => {
  try {
    const catalog = await ShopCatalog.findOne({ userId: req.user._id });
    res.json({ catalog: catalog || null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/shop/catalog ───────────────────────────────────────────────────────
// Manual save (fallback — user pastes an existing catalog ID they already have).
export const saveCatalog = async (req, res) => {
  try {
    const { catalogId, name } = req.body;
    if (!catalogId) return res.status(400).json({ message: 'catalogId is required' });
    const catalog = await ShopCatalog.findOneAndUpdate(
      { userId: req.user._id },
      { catalogId, name: name || '', isActive: true },
      { upsert: true, new: true }
    );
    res.json({ catalog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE /api/shop/catalog ─────────────────────────────────────────────────────
export const deleteCatalog = async (req, res) => {
  try {
    await ShopCatalog.deleteOne({ userId: req.user._id });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/shop/products ───────────────────────────────────────────────────────
// Always reads catalogId from DB (scoped to userId) — never lists platform catalogs directly.
export const getProducts = async (req, res) => {
  try {
    const catalog = await ShopCatalog.findOne({ userId: req.user._id });
    if (!catalog) return res.status(404).json({ message: 'No catalog found. Create one first.' });

    const { token } = await getWaAndToken(req.user._id);
    const fields = 'id,retailer_id,name,description,price,currency,image_url,availability,condition';
    const { data } = await axios.get(`${GRAPH}/${catalog.catalogId}/products`, {
      params: { fields, limit: 100, access_token: token },
    });

    res.json({ products: data.data || [], paging: data.paging });
  } catch (err) {
    const e = metaErr(err);
    res.status(e.status).json({ message: e.message, code: e.code });
  }
};

// ── POST /api/shop/products ──────────────────────────────────────────────────────
export const addProduct = async (req, res) => {
  try {
    const catalog = await ShopCatalog.findOne({ userId: req.user._id });
    if (!catalog) return res.status(404).json({ message: 'No catalog found' });

    const { token } = await getWaAndToken(req.user._id);
    const { retailer_id, name, description, price, currency, image_url, availability, condition } = req.body;

    if (!retailer_id || !name || !price || !currency) {
      return res.status(400).json({ message: 'retailer_id, name, price, currency are required' });
    }

    const { data } = await axios.post(
      `${GRAPH}/${catalog.catalogId}/products`,
      {
        retailer_id,
        name,
        description: description || '',
        price: parseInt(price),
        currency,
        image_url: image_url || '',
        availability: availability || 'in stock',
        condition: condition || 'new',
      },
      { params: { access_token: token } }
    );

    res.json({ product: data });
  } catch (err) {
    const e = metaErr(err);
    res.status(e.status).json({ message: e.message, code: e.code });
  }
};

// ── PATCH /api/shop/products/:productId ─────────────────────────────────────────
export const updateProduct = async (req, res) => {
  try {
    const catalog = await ShopCatalog.findOne({ userId: req.user._id });
    if (!catalog) return res.status(404).json({ message: 'No catalog found' });

    const { token } = await getWaAndToken(req.user._id);
    const { productId } = req.params;

    const allowed = ['name', 'description', 'price', 'currency', 'image_url', 'availability', 'condition'];
    const payload = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        payload[key] = key === 'price' ? parseInt(req.body[key]) : req.body[key];
      }
    }

    await axios.post(`${GRAPH}/${productId}`, payload, { params: { access_token: token } });
    res.json({ updated: true });
  } catch (err) {
    const e = metaErr(err);
    res.status(e.status).json({ message: e.message, code: e.code });
  }
};

// ── DELETE /api/shop/products/:productId ─────────────────────────────────────────
export const deleteProduct = async (req, res) => {
  try {
    const catalog = await ShopCatalog.findOne({ userId: req.user._id });
    if (!catalog) return res.status(404).json({ message: 'No catalog found' });

    const { token } = await getWaAndToken(req.user._id);
    await axios.delete(`${GRAPH}/${req.params.productId}`, { params: { access_token: token } });
    res.json({ deleted: true });
  } catch (err) {
    const e = metaErr(err);
    res.status(e.status).json({ message: e.message });
  }
};

// ── GET /api/shop/commerce-settings ─────────────────────────────────────────────
export const getCommerceSettings = async (req, res) => {
  try {
    const { token, wabaId } = await getWaAndToken(req.user._id);
    const { data } = await axios.get(`${GRAPH}/${wabaId}/whatsapp_commerce_settings`, {
      params: { access_token: token },
    });
    res.json({ settings: data.data?.[0] || data });
  } catch (err) {
    const e = metaErr(err);
    res.status(e.status).json({ message: e.message });
  }
};
