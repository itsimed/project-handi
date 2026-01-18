// project-handi/backend/src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client'; // Importation de l'Enum

const JWT_SECRET = process.env.JWT_SECRET || 'ma_cle_secrete_super_secure';

// Extension de l'interface Request d'Express
export interface AuthRequest extends Request
{
    user?: {
        userId: number;
        role: UserRole; // Utilisation du type exact de Prisma
    };
}

/**
 * Middleware de base : Vérifie si l'utilisateur est connecté via un JWT valide
 */
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) =>
{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Accès refusé. Token manquant." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: UserRole };
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: "Token invalide ou expiré." });
    }
};

/**
 * Middleware d'authentification optionnelle : Vérifie le token s'il existe, sinon continue
 * Permet d'avoir des routes accessibles publiquement mais avec des fonctionnalités supplémentaires si connecté
 */
export const authenticateTokenOptional = (req: AuthRequest, res: Response, next: NextFunction) =>
{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // Pas de token, on continue sans user
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: UserRole };
        req.user = decoded;
        next();
    } catch (error) {
        // Token invalide, on continue quand même sans user (plutôt que de bloquer)
        next();
    }
};

/**
 * Middleware d'autorisation : Vérifie si l'utilisateur possède un rôle autorisé
 * Usage : authorizeRole(['RECRUITER', 'ADMIN'])
 */
export const authorizeRole = (allowedRoles: UserRole | UserRole[]) =>
{
    return (req: AuthRequest, res: Response, next: NextFunction) => {
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