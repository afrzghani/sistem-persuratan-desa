import { Router } from 'express';
import authRoutes from './authRoutes.js';
import adminRoutes from './adminRoutes.js';
import profileRoutes from './profileRoutes.js';
import desaRoutes from './desaRoutes.js';
import ocrRoutes from './ocrRoutes.js';
import residentRoutes from './residentRoutes.js';
import letterRoutes from './letterRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/admins', adminRoutes);
apiRouter.use('/admin', profileRoutes);
apiRouter.use('/desa', desaRoutes);
apiRouter.use('/ocr', ocrRoutes);
apiRouter.use('/residents', residentRoutes);
apiRouter.use('/letters', letterRoutes);
apiRouter.use('/dashboard', dashboardRoutes);

export default apiRouter;
