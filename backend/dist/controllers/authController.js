"use strict";
// project-handi/backend/src/controllers/authController.ts
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const userService = __importStar(require("../services/userService"));
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
const JWT_SECRET = process.env.JWT_SECRET || 'ma_cle_secrete_super_secure';
/**
 * Gère l'inscription des nouveaux utilisateurs.
 * Hash le mot de passe avant stockage et vérifie l'unicité de l'email.
 */
const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role, companyId, companyName } = req.body;
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "Cet email est déjà utilisé." });
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = await userService.createUser({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            role,
            companyId: companyId ? Number(companyId) : undefined,
            companyName: companyName || undefined
        });
        // Générer le JWT token automatiquement après inscription
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            message: "Utilisateur créé avec succès",
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role,
                firstName: newUser.firstName,
                lastName: newUser.lastName
            }
        });
    }
    catch (error) {
        logger_1.logger.error("Erreur lors de l'inscription", {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({
            error: "Erreur lors de l'inscription.",
            message: error.message
        });
    }
};
exports.register = register;
/**
 * Authentifie un utilisateur et génère un token JWT.
 */
const login = async (req, res) => {
    try {
        logger_1.logger.info('[LOGIN] Début de la tentative de connexion');
        const { email, password } = req.body;
        logger_1.logger.info('[LOGIN] Email reçu', { email });
        logger_1.logger.info('[LOGIN] Recherche de l\'utilisateur...');
        const user = await userService.findUserByEmail(email);
        logger_1.logger.info('[LOGIN] Utilisateur trouvé', { found: !!user, userId: user?.id });
        if (!user) {
            return res.status(401).json({ error: "Identifiants incorrects." });
        }
        logger_1.logger.info('[LOGIN] Vérification du mot de passe...');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        logger_1.logger.info('[LOGIN] Mot de passe valide', { valid: isPasswordValid });
        if (!isPasswordValid) {
            logger_1.logger.warn('[LOGIN] Mot de passe incorrect');
            return res.status(401).json({ error: "Identifiants incorrects." });
        }
        logger_1.logger.info('[LOGIN] Génération du token JWT...');
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        logger_1.logger.info('[LOGIN] ✅ Connexion réussie', { email, userId: user.id });
        res.json({
            message: "Connexion réussie",
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                company: user.company ? { id: user.company.id, name: user.company.name } : null
            }
        });
    }
    catch (error) {
        logger_1.logger.error('[LOGIN] ❌ ERREUR lors de la connexion', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            name: error.constructor.name
        });
        res.status(500).json({
            error: "Erreur lors de la connexion.",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
exports.login = login;
