"use strict";
// project-handi/backend/src/controllers/userController.ts
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
exports.getUsersHandler = getUsersHandler;
exports.createUserController = createUserController;
exports.deleteUserController = deleteUserController;
exports.updatePasswordController = updatePasswordController;
exports.updateProfileController = updateProfileController;
const userService = __importStar(require("../services/userService"));
// GET /api/v1/users
async function getUsersHandler(req, res) {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).json(users);
    }
    catch (error) {
        console.error('Erreur dans getUsersHandler:', error);
        return res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
    }
}
// POST /api/v1/users
async function createUserController(req, res) {
    try {
        const newUser = await userService.createUser(req.body);
        // Le service a déjà retiré le mot de passe
        return res.status(201).json(newUser);
    }
    catch (error) {
        console.error('Erreur dans createUserController:', error);
        return res.status(500).json({ message: 'Erreur lors de la création de l’utilisateur.' });
    }
}
// DELETE /api/v1/users/:id
async function deleteUserController(req, res) {
    try {
        const userId = parseInt(req.params.id);
        const currentUserId = req.user?.userId;
        // Vérifier que l'utilisateur supprime bien son propre compte
        if (userId !== currentUserId) {
            return res.status(403).json({
                message: 'Vous ne pouvez supprimer que votre propre compte.'
            });
        }
        await userService.deleteUser(userId);
        return res.status(200).json({
            message: 'Compte supprimé avec succès.'
        });
    }
    catch (error) {
        console.error('Erreur dans deleteUserController:', error);
        return res.status(500).json({
            message: error.message || 'Erreur lors de la suppression du compte.'
        });
    }
}
// PUT /api/v1/users/:id/password
async function updatePasswordController(req, res) {
    try {
        const userId = parseInt(req.params.id);
        const currentUserId = req.user?.userId;
        const { currentPassword, newPassword } = req.body;
        // Vérifier que l'utilisateur modifie son propre mot de passe
        if (userId !== currentUserId) {
            return res.status(403).json({
                error: 'Vous ne pouvez modifier que votre propre mot de passe.'
            });
        }
        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: 'Mot de passe actuel et nouveau mot de passe requis.'
            });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({
                error: 'Le nouveau mot de passe doit contenir au moins 6 caractères.'
            });
        }
        await userService.updatePassword(userId, currentPassword, newPassword);
        return res.status(200).json({
            message: 'Mot de passe modifié avec succès.'
        });
    }
    catch (error) {
        console.error('Erreur updatePasswordController:', error);
        if (error.message === 'Mot de passe actuel incorrect') {
            return res.status(401).json({ error: error.message });
        }
        return res.status(500).json({
            error: 'Erreur lors de la modification du mot de passe.'
        });
    }
}
// PUT /api/v1/users/:id/profile
async function updateProfileController(req, res) {
    try {
        const userId = parseInt(req.params.id);
        const currentUserId = req.user?.userId;
        const { firstName, lastName, email } = req.body;
        // Vérifier que l'utilisateur modifie son propre profil
        if (userId !== currentUserId) {
            return res.status(403).json({
                error: 'Vous ne pouvez modifier que votre propre profil.'
            });
        }
        const updatedUser = await userService.updateProfile(userId, {
            firstName,
            lastName,
            email
        });
        return res.status(200).json({
            message: 'Profil mis à jour avec succès.',
            user: updatedUser
        });
    }
    catch (error) {
        console.error('Erreur updateProfileController:', error);
        if (error.message === 'Cet email est déjà utilisé') {
            return res.status(409).json({ error: error.message });
        }
        return res.status(500).json({
            error: 'Erreur lors de la mise à jour du profil.'
        });
    }
}
