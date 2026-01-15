"use strict";
// project-handi/backend/src/services/userService.ts
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
exports.getAllUsers = getAllUsers;
exports.findUserByEmail = findUserByEmail;
exports.createUser = createUser;
exports.findUserById = findUserById;
exports.deleteUser = deleteUser;
exports.updatePassword = updatePassword;
exports.updateProfile = updateProfile;
const bcrypt = __importStar(require("bcrypt"));
const prisma_1 = __importDefault(require("../config/prisma"));
// --- Fonctions CRUD pour l'utilisateur ---
// Récupérer tous les utilisateurs
async function getAllUsers() {
    // Sélectionner uniquement les champs non sensibles
    return prisma_1.default.user.findMany({
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
            companyId: true // Utile pour identifier à quelle entreprise appartient un recruteur
        }
    });
}
// Trouver un utilisateur par son email (indispensable pour le Login)
async function findUserByEmail(email) {
    return prisma_1.default.user.findUnique({
        where: { email },
        include: { company: true /* Permet de récupérer les infos de l'entreprise si c'est un recruteur */ }
    });
}
// Créer un nouvel utilisateur
async function createUser(userData) {
    let finalCompanyId = userData.companyId;
    // Si c'est un recruteur avec un nom d'entreprise, créer ou trouver l'entreprise
    if (userData.role === 'RECRUITER' && userData.companyName && !userData.companyId) {
        // Vérifier si l'entreprise existe déjà
        let company = await prisma_1.default.company.findUnique({
            where: { name: userData.companyName }
        });
        // Si elle n'existe pas, la créer
        if (!company) {
            company = await prisma_1.default.company.create({
                data: { name: userData.companyName }
            });
        }
        finalCompanyId = company.id;
    }
    return prisma_1.default.user.create({
        data: {
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            ...(finalCompanyId && { company: { connect: { id: finalCompanyId } } })
        }
    });
}
// Trouver par ID
async function findUserById(id) {
    return prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
        }
    });
}
// Supprimer un utilisateur et toutes ses données associées
async function deleteUser(userId) {
    // Prisma gère la suppression en cascade si configuré dans le schéma
    // Sinon, nous devons supprimer manuellement les relations
    // 1. Supprimer toutes les candidatures de l'utilisateur
    await prisma_1.default.application.deleteMany({
        where: { userId }
    });
    // 2. Si c'est un recruteur, supprimer ses offres (et leurs candidatures associées)
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        select: { role: true }
    });
    if (user?.role === 'RECRUITER') {
        // Supprimer les candidatures liées aux offres du recruteur
        await prisma_1.default.application.deleteMany({
            where: {
                offer: {
                    recruiterId: userId
                }
            }
        });
        // Supprimer les offres du recruteur
        await prisma_1.default.offer.deleteMany({
            where: { recruiterId: userId }
        });
    }
    // 3. Supprimer l'utilisateur
    return prisma_1.default.user.delete({
        where: { id: userId }
    });
}
// Changer le mot de passe d'un utilisateur
async function updatePassword(userId, currentPassword, newPassword) {
    // 1. Récupérer l'utilisateur avec son mot de passe
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        select: { id: true, password: true }
    });
    if (!user) {
        throw new Error('Utilisateur non trouvé');
    }
    // 2. Vérifier l'ancien mot de passe
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
        throw new Error('Mot de passe actuel incorrect');
    }
    // 3. Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // 4. Mettre à jour en base
    return prisma_1.default.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
        select: { id: true, email: true }
    });
}
// Mettre à jour le profil d'un utilisateur
async function updateProfile(userId, data) {
    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (data.email) {
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email: data.email }
        });
        if (existingUser && existingUser.id !== userId) {
            throw new Error('Cet email est déjà utilisé');
        }
    }
    // Mettre à jour l'utilisateur
    return prisma_1.default.user.update({
        where: { id: userId },
        data: {
            ...(data.firstName && { firstName: data.firstName }),
            ...(data.lastName && { lastName: data.lastName }),
            ...(data.email && { email: data.email })
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            company: true
        }
    });
}
