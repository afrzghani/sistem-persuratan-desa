import { Router } from 'express';
import {
  activateAdmin,
  createAdmin,
  deactivateAdmin,
  getAdmins,
  updateAdmin
} from '../controllers/adminController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/', getAdmins);
router.post('/', createAdmin);
router.put('/:id', updateAdmin);
router.patch('/:id/deactivate', deactivateAdmin);
router.patch('/:id/activate', activateAdmin);

export default router;
