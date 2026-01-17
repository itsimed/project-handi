"use strict";
// project-handi/backend/src/routes/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const offerRoutes_1 = __importDefault(require("./offerRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const companyRoutes_1 = __importDefault(require("./companyRoutes"));
const applicationRoutes_1 = __importDefault(require("./applicationRoutes"));
const documentRoutes_1 = __importDefault(require("./documentRoutes"));
const statsRoutes_1 = __importDefault(require("./statsRoutes"));
const router = (0, express_1.Router)();
/**
 * Note : Le préfixe /api/v1 est déjà défini dans app.ts.
 * On définit ici uniquement les sous-chemins.
 */
// --- Authentification ---
router.use('/auth', authRoutes_1.default);
// --- Entreprises ---
router.use('/companies', companyRoutes_1.default);
// --- Offres d'emploi ---
router.use('/offers', offerRoutes_1.default);
// --- Utilisateurs ---
router.use('/users', userRoutes_1.default);
// --- Candidatures ---
router.use('/applications', applicationRoutes_1.default);
// --- Documents ---
router.use('/documents', documentRoutes_1.default);
// --- Statistiques ---
router.use('/stats', statsRoutes_1.default);
// Route de test (Health Check)
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Project Handi API is online',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
