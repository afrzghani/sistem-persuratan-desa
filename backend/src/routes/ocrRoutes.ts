import { Router } from 'express';
import { processKtpOcr } from '../controllers/ocrController.js';
import { uploadKtp } from '../middlewares/uploadMiddleware.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

// OCR endpoint protected with JWT authentication as per SKPL workflow
router.post('/ktp', authenticate, uploadKtp.single('file'), processKtpOcr);

export default router;
