import { Router } from 'express';
import {
  getResidentByNik,
  listResidents,
  createOrUpdateResident
} from '../controllers/residentController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/nik/:nik', getResidentByNik);
router.get('/', listResidents);
router.post('/', createOrUpdateResident);

export default router;
