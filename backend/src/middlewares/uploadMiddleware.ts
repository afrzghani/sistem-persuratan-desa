import multer from 'multer';
import path from 'path';

// Memory storage so we can forward the buffer directly to Python OCR service
// or easily write to disk if needed
const storage = multer.memoryStorage();

export const uploadKtp = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  },
  fileFilter: (_req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(ext) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Format file tidak didukung. Harap unggah foto KTP berformat JPG, JPEG, atau PNG.'));
    }
  }
});
