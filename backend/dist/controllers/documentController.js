"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadDocumentController = uploadDocumentController;
exports.downloadDocumentController = downloadDocumentController;
exports.deleteDocumentController = deleteDocumentController;
exports.listDocumentsController = listDocumentsController;
const documentService = __importStar(require("../services/documentService"));
/**
 * POST /api/v1/documents/upload
 * Upload un document pour une candidature
 */
async function uploadDocumentController(req, res) {
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
        const document = await documentService.uploadDocument(parseInt(applicationId), userId, file, documentType);
        return res.status(201).json({
            message: 'Document uploadé avec succès',
            document,
        });
    }
    catch (error) {
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
async function downloadDocumentController(req, res) {
    try {
        const userId = req.user?.userId;
        const documentId = parseInt(req.params.id);
        if (!userId) {
            return res.status(401).json({ error: 'Non authentifié' });
        }
        const { buffer, fileName, mimeType } = await documentService.getDocument(documentId, userId);
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        return res.send(buffer);
    }
    catch (error) {
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
async function deleteDocumentController(req, res) {
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
    }
    catch (error) {
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
async function listDocumentsController(req, res) {
    try {
        const userId = req.user?.userId;
        const applicationId = parseInt(req.params.applicationId);
        if (!userId) {
            return res.status(401).json({ error: 'Non authentifié' });
        }
        const documents = await documentService.getApplicationDocuments(applicationId, userId);
        return res.status(200).json(documents);
    }
    catch (error) {
        console.error('Erreur liste documents:', error);
        if (error.message.includes('non autorisé')) {
            return res.status(403).json({ error: error.message });
        }
        return res.status(500).json({
            error: 'Erreur lors de la récupération des documents'
        });
    }
}
