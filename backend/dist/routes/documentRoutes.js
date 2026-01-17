"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const documentController_1 = require("../controllers/documentController");
const router = (0, express_1.Router)();
// Configuration multer pour upload en mémoire
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
    },
});
// POST /documents/upload - Upload un document
router.post('/upload', authMiddleware_1.authenticateToken, upload.single('file'), documentController_1.uploadDocumentController);
// GET /documents/:id - Télécharger un document
router.get('/:id', authMiddleware_1.authenticateToken, documentController_1.downloadDocumentController);
// DELETE /documents/:id - Supprimer un document
router.delete('/:id', authMiddleware_1.authenticateToken, documentController_1.deleteDocumentController);
// GET /documents/application/:applicationId - Liste des documents d'une candidature
router.get('/application/:applicationId', authMiddleware_1.authenticateToken, documentController_1.listDocumentsController);
exports.default = router;
