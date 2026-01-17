"use strict";
// project-handi/backend/src/middleware/authMiddleware.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'ma_cle_secrete_super_secure';
/**
 * Middleware de base : Vérifie si l'utilisateur est connecté via un JWT valide
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "Accès refusé. Token manquant." });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: "Token invalide ou expiré." });
    }
};
exports.authenticateToken = authenticateToken;
/**
 * Middleware d'autorisation : Vérifie si l'utilisateur possède un rôle autorisé
 * Usage : authorizeRole(['RECRUITER', 'ADMIN'])
 */
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Authentification requise." });
        }
        // Conversion en tableau pour gérer un ou plusieurs rôles
        const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: `Accès interdit. Rôles autorisés : ${roles.join(', ')}`
            });
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
