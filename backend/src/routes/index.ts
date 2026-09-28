import { Router } from 'express';
import authRoutes from './authRoutes.js';
import ocrRoutes from './ocrRoutes.js';
import residentRoutes from './residentRoutes.js';
import letterRoutes from './letterRoutes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/ocr', ocrRoutes);
apiRouter.use('/residents', residentRoutes);
apiRouter.use('/letters', letterRoutes);

export default apiRouter;
