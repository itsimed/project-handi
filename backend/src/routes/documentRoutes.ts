import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
  uploadDocumentController,
  downloadDocumentController,
  deleteDocumentController,
  listDocumentsController,
} from '../controllers/documentController';

const router = Router();

// Configuration multer pour upload en mémoire
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
  },
});

// POST /documents/upload - Upload un document
router.post('/upload', authenticateToken, upload.single('file'), uploadDocumentController);

// GET /documents/:id - Télécharger un document
router.get('/:id', authenticateToken, downloadDocumentController);

// DELETE /documents/:id - Supprimer un document
router.delete('/:id', authenticateToken, deleteDocumentController);

// GET /documents/application/:applicationId - Liste des documents d'une candidature
router.get('/application/:applicationId', authenticateToken, listDocumentsController);

export default router;
