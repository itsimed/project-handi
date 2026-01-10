import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import * as documentService from '../services/documentService';
import { DocumentType } from '@prisma/client';

/**
 * POST /api/v1/documents/upload
 * Upload un document pour une candidature
 */
export async function uploadDocumentController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const { applicationId, documentType } = req.body;
    const file = req.file;

    if (!userId) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    if (!file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    if (!applicationId || !documentType) {
      return res.status(400).json({ 
        error: 'applicationId et documentType requis' 
      });
    }

    if (!['CV', 'COVER_LETTER'].includes(documentType)) {
      return res.status(400).json({ 
        error: 'documentType doit être CV ou COVER_LETTER' 
      });
    }

    const document = await documentService.uploadDocument(
      parseInt(applicationId),
      userId,
      file,
      documentType as DocumentType
    );

    return res.status(201).json({
      message: 'Document uploadé avec succès',
      document,
    });
  } catch (error: any) {
    console.error('Erreur upload document:', error);
    return res.status(500).json({ 
      error: error.message || 'Erreur lors de l\'upload du document' 
    });
  }
}

/**
 * GET /api/v1/documents/:id
 * Télécharger un document
 */
export async function downloadDocumentController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const documentId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const { buffer, fileName, mimeType } = await documentService.getDocument(
      documentId,
      userId
    );

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    return res.send(buffer);
  } catch (error: any) {
    console.error('Erreur download document:', error);
    
    if (error.message.includes('non trouvé')) {
      return res.status(404).json({ error: error.message });
    }
    
    if (error.message.includes('non autorisé')) {
      return res.status(403).json({ error: error.message });
    }
    
    return res.status(500).json({ 
      error: 'Erreur lors du téléchargement du document' 
    });
  }
}

/**
 * DELETE /api/v1/documents/:id
 * Supprimer un document
 */
export async function deleteDocumentController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const documentId = parseInt(req.params.id);

    if (!userId) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    await documentService.deleteDocument(documentId, userId);

    return res.status(200).json({ 
      message: 'Document supprimé avec succès' 
    });
  } catch (error: any) {
    console.error('Erreur suppression document:', error);
    
    if (error.message.includes('non trouvé')) {
      return res.status(404).json({ error: error.message });
    }
    
    if (error.message.includes('non autorisé')) {
      return res.status(403).json({ error: error.message });
    }
    
    return res.status(500).json({ 
      error: 'Erreur lors de la suppression du document' 
    });
  }
}

/**
 * GET /api/v1/documents/application/:applicationId
 * Lister les documents d'une candidature
 */
export async function listDocumentsController(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.userId;
    const applicationId = parseInt(req.params.applicationId);

    if (!userId) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    const documents = await documentService.getApplicationDocuments(
      applicationId,
      userId
    );

    return res.status(200).json(documents);
  } catch (error: any) {
    console.error('Erreur liste documents:', error);
    
    if (error.message.includes('non autorisé')) {
      return res.status(403).json({ error: error.message });
    }
    
    return res.status(500).json({ 
      error: 'Erreur lors de la récupération des documents' 
    });
  }
}
