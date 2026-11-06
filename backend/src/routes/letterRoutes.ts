import { Router } from 'express';
import {
  listTemplates,
  createTemplate,
  getTemplateFile,
  issueLetter,
  listIssuedLetters,
  downloadGeneratedLetter,
  updateLetterStatus,
  getDraft,
  saveDraft,
  deleteDraft,
  listDrafts
} from '../controllers/letterController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { uploadTemplate } from '../middlewares/uploadMiddleware.js';

const router = Router();

// Public / direct download for generated files
router.get('/download/:filename', downloadGeneratedLetter);

// Protected routes
router.use(authenticate);
router.get('/templates', listTemplates);
router.post('/templates', uploadTemplate.single('file'), createTemplate);
router.get('/templates/:id/file', getTemplateFile);
router.post('/issue', issueLetter);
router.patch('/:id/status', updateLetterStatus);
router.get('/draft', getDraft);
router.put('/draft', saveDraft);
router.delete('/draft', deleteDraft);
router.get('/drafts', listDrafts);
router.get('/history', listIssuedLetters);

export default router;
