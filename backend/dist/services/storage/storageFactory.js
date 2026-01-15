"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorageBackend = getStorageBackend;
const localStorage_1 = require("./localStorage");
/**
 * Factory pour créer l'instance de stockage appropriée
 * Facilite le switch entre local et S3 via variable d'environnement
 */
function getStorageBackend() {
    const storageType = process.env.STORAGE_TYPE || 'local';
    const uploadsDir = process.env.UPLOADS_DIR || './uploads';
    switch (storageType) {
        case 'local':
            return new localStorage_1.LocalStorage(uploadsDir);
        case 's3':
            // Future implémentation
            // return new S3Storage(process.env.AWS_S3_BUCKET!, process.env.AWS_REGION!);
            throw new Error('S3 storage pas encore implémenté. Utilisez STORAGE_TYPE=local');
        default:
            throw new Error(`Type de stockage inconnu: ${storageType}`);
    }
}
