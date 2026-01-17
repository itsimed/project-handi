"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorage = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
class LocalStorage {
    constructor(baseDir = './uploads') {
        this.baseDir = path_1.default.resolve(baseDir);
    }
    async saveFile(file, relativePath) {
        // Générer un nom de fichier sécurisé avec UUID
        const fileExtension = path_1.default.extname(file.originalname);
        const randomName = crypto_1.default.randomUUID();
        const fileName = `${randomName}${fileExtension}`;
        const fullPath = path_1.default.join(this.baseDir, relativePath, fileName);
        // Créer les dossiers si nécessaire
        await promises_1.default.mkdir(path_1.default.dirname(fullPath), { recursive: true });
        // Sauvegarder le fichier
        await promises_1.default.writeFile(fullPath, file.buffer);
        // Retourner le chemin relatif pour stockage en DB
        return path_1.default.join(relativePath, fileName);
    }
    async getFile(relativePath) {
        const fullPath = path_1.default.join(this.baseDir, relativePath);
        // Sécurité : Vérifier que le chemin ne sort pas du baseDir (path traversal attack)
        const resolvedPath = path_1.default.resolve(fullPath);
        if (!resolvedPath.startsWith(this.baseDir)) {
            throw new Error('Accès interdit : chemin invalide');
        }
        return await promises_1.default.readFile(fullPath);
    }
    async deleteFile(relativePath) {
        const fullPath = path_1.default.join(this.baseDir, relativePath);
        // Sécurité : Path traversal protection
        const resolvedPath = path_1.default.resolve(fullPath);
        if (!resolvedPath.startsWith(this.baseDir)) {
            throw new Error('Accès interdit : chemin invalide');
        }
        await promises_1.default.unlink(fullPath);
    }
    async fileExists(relativePath) {
        try {
            const fullPath = path_1.default.join(this.baseDir, relativePath);
            await promises_1.default.access(fullPath);
            return true;
        }
        catch {
            return false;
        }
    }
}
exports.LocalStorage = LocalStorage;
