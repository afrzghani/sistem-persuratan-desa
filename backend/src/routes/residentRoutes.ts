import { Router } from 'express';
import {
  getResidentByNik,
  listResidents,
  createOrUpdateResident,
  deleteResident
} from '../controllers/residentController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/nik/:nik', getResidentByNik);
router.get('/', listResidents);
router.post('/', createOrUpdateResident);
router.delete('/:nik', deleteResident);

export default router;
