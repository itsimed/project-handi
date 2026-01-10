// project-handi/backend/src/controllers/authController.ts

import { Request, Response } from 'express';
import * as userService from '../services/userService';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'ma_cle_secrete_super_secure';

/**
 * Gère l'inscription des nouveaux utilisateurs.
 * Hash le mot de passe avant stockage et vérifie l'unicité de l'email.
 */
export const register = async (req: Request, res: Response) =>
{
    try
    {
        const { email, password, firstName, lastName, role, companyId, companyName } = req.body;

        const existingUser = await userService.findUserByEmail(email);

        if (existingUser)
        {
            return res.status(400).json({ error: "Cet email est déjà utilisé." });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash
        (
            password, 
            saltRounds
        );

        const newUser = await userService.createUser
        (
            {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                role,
                companyId: companyId ? Number(companyId) : undefined,
                companyName: companyName || undefined
            }
        );

        res.status(201).json
        (
            {
                message: "Utilisateur créé avec succès",
                user: { id: newUser.id, email: newUser.email }
            }
        );
    }
    catch (error: any)
    {
        logger.error("Erreur lors de l'inscription", {
            message: error.message,
            stack: error.stack
        });

        res.status(500).json
        (
            {
                error: "Erreur lors de l'inscription.",
                message: error.message
            }
        );
    }
};

/**
 * Authentifie un utilisateur et génère un token JWT.
 */
export const login = async (req: Request, res: Response) =>
{
    try
    {
        logger.info('[LOGIN] Début de la tentative de connexion');
        const { email, password } = req.body;
        logger.info('[LOGIN] Email reçu', { email });

        logger.info('[LOGIN] Recherche de l\'utilisateur...');
        const user = await userService.findUserByEmail(email);
        logger.info('[LOGIN] Utilisateur trouvé', { found: !!user, userId: user?.id });

        if (!user)
        {
            return res.status(401).json({ error: "Identifiants incorrects." });
        }

        logger.info('[LOGIN] Vérification du mot de passe...');
        const isPasswordValid = await bcrypt.compare
        (
            password, 
            user.password
        );
        logger.info('[LOGIN] Mot de passe valide', { valid: isPasswordValid });

        if (!isPasswordValid)
        {
            logger.warn('[LOGIN] Mot de passe incorrect');
            return res.status(401).json({ error: "Identifiants incorrects." });
        }

        logger.info('[LOGIN] Génération du token JWT...');
        const token = jwt.sign
        (
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        logger.info('[LOGIN] ✅ Connexion réussie', { email, userId: user.id });
        res.json
        (
            {
                message: "Connexion réussie",
                token,
                user: 
                {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    company: user.company ? { id: user.company.id, name: user.company.name } : null
                }
            }
        );
    }
    catch (error: any)
    {
        logger.error('[LOGIN] ❌ ERREUR lors de la connexion', {
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