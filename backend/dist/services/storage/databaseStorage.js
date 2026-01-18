"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseStorage = void 0;
/**
 * DatabaseStorage - Stocke les fichiers directement dans PostgreSQL
 * Idéal pour Railway et autres plateformes avec filesystem éphémère
 */
class DatabaseStorage {
    async saveFile(file, relativePath) {
        // Pour le stockage en base, on retourne juste un identifiant
        // Le fichier sera stocké dans fileData par le service
        return `database:${relativePath}`;
    }
    async getFile(relativePath) {
        // Cette méthode ne sera pas utilisée car on récupère directement depuis la DB
        throw new Error('DatabaseStorage: Utilisez documentService.getDocument() pour récupérer les fichiers');
    }
    async deleteFile(relativePath) {
        // La suppression se fait via Prisma CASCADE, pas besoin de supprimer le fichier
        return;
    }
    async fileExists(relativePath) {
        // Vérification via la base de données
        return true;
    }
}
exports.DatabaseStorage = DatabaseStorage;
