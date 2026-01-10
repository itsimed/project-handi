import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { StorageInterface } from './storageInterface';

export class LocalStorage implements StorageInterface {
  private baseDir: string;

  constructor(baseDir: string = './uploads') {
    this.baseDir = path.resolve(baseDir);
  }

  async saveFile(
    file: Express.Multer.File,
    relativePath: string
  ): Promise<string> {
    // Générer un nom de fichier sécurisé avec UUID
    const fileExtension = path.extname(file.originalname);
    const randomName = crypto.randomUUID();
    const fileName = `${randomName}${fileExtension}`;
    
    const fullPath = path.join(this.baseDir, relativePath, fileName);
    
    // Créer les dossiers si nécessaire
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    
    // Sauvegarder le fichier
    await fs.writeFile(fullPath, file.buffer);
    
    // Retourner le chemin relatif pour stockage en DB
    return path.join(relativePath, fileName);
  }

  async getFile(relativePath: string): Promise<Buffer> {
    const fullPath = path.join(this.baseDir, relativePath);
    
    // Sécurité : Vérifier que le chemin ne sort pas du baseDir (path traversal attack)
    const resolvedPath = path.resolve(fullPath);
    if (!resolvedPath.startsWith(this.baseDir)) {
      throw new Error('Accès interdit : chemin invalide');
    }
    
    return await fs.readFile(fullPath);
  }

  async deleteFile(relativePath: string): Promise<void> {
    const fullPath = path.join(this.baseDir, relativePath);
    
    // Sécurité : Path traversal protection
    const resolvedPath = path.resolve(fullPath);
    if (!resolvedPath.startsWith(this.baseDir)) {
      throw new Error('Accès interdit : chemin invalide');
    }
    
    await fs.unlink(fullPath);
  }

  async fileExists(relativePath: string): Promise<boolean> {
    try {
      const fullPath = path.join(this.baseDir, relativePath);
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }
}
