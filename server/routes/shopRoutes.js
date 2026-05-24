import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createCatalog,
  getCatalog,
  saveCatalog,
  deleteCatalog,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getCommerceSettings,
} from '../controllers/shopController.js';

const router = express.Router();

// Catalog
router.post  ('/catalog/create',       protect, createCatalog);   // Create new catalog via Meta API
router.get   ('/catalog',              protect, getCatalog);       // Get this user's saved catalog
router.post  ('/catalog',              protect, saveCatalog);      // Manual fallback — paste existing ID
router.delete('/catalog',              protect, deleteCatalog);    // Disconnect / delete from DB

// Products (all scoped to user's catalogId from DB)
router.get   ('/products',             protect, getProducts);
router.post  ('/products',             protect, addProduct);
router.patch ('/products/:productId',  protect, updateProduct);
router.delete('/products/:productId',  protect, deleteProduct);

// Commerce settings
router.get   ('/commerce-settings',    protect, getCommerceSettings);

export default router;
