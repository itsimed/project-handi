// project-handi/backend/src/controllers/authController.ts

import { Request, Response } from 'express';
import * as userService from '../services/userService';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
        console.error
        (
            "Erreur détaillée:", 
            error
        );

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
        const { email, password } = req.body;

        console.log('🔐 [LOGIN] Tentative de connexion');
        console.log('📧 Email reçu:', email);
        console.log('🔑 Mot de passe reçu:', password ? `${password.length} caractères` : 'VIDE');

        const user = await userService.findUserByEmail(email);

        if (!user)
        {
            console.log('❌ [LOGIN] Utilisateur non trouvé:', email);
            return res.status(401).json({ error: "Identifiants incorrects." });
        }

        console.log('✅ [LOGIN] Utilisateur trouvé:', user.email);
        console.log('🔐 [LOGIN] Hash en BDD:', user.password.substring(0, 20) + '...');

        const isPasswordValid = await bcrypt.compare
        (
            password, 
            user.password
        );

        console.log('🔐 [LOGIN] Résultat bcrypt.compare:', isPasswordValid ? '✅ VALIDE' : '❌ INVALIDE');

        if (!isPasswordValid)
        {
            console.log('❌ [LOGIN] Mot de passe invalide pour:', email);
            return res.status(401).json({ error: "Identifiants incorrects." });
        }

        const token = jwt.sign
        (
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('✅ [LOGIN] Connexion réussie pour:', user.email);
        console.log('🎫 [LOGIN] Token généré');

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
    catch (error)
    {
        console.error('❌ [LOGIN] Erreur lors de la connexion:', error);

        res.status(500).json({ error: "Erreur lors de la connexion." });
    }
};