import express from 'express';
import { listTemplates, createTemplate, deleteTemplate } from '../controllers/templateController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get   ('/',        protect, listTemplates);
router.post  ('/',        protect, createTemplate);
router.delete('/:name',   protect, deleteTemplate);

export default router;
