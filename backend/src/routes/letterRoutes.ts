import { Router } from 'express';
import {
  listTemplates,
  issueLetter,
  listIssuedLetters,
  downloadGeneratedLetter
} from '../controllers/letterController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

// Public / direct download for generated files
router.get('/download/:filename', downloadGeneratedLetter);

// Protected routes
router.use(authenticate);
router.get('/templates', listTemplates);
router.post('/issue', issueLetter);
router.get('/history', listIssuedLetters);

export default router;
