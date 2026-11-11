import { Router } from 'express';
import {
  getDesaSettings,
  updateDesaSettings
} from '../controllers/desaController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/settings', getDesaSettings);
router.put('/settings', updateDesaSettings);

export default router;
