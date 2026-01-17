import { StorageInterface } from './storageInterface';
import prisma from '../../config/prisma';

/**
 * DatabaseStorage - Stocke les fichiers directement dans PostgreSQL
 * Idéal pour Railway et autres plateformes avec filesystem éphémère
 */
export class DatabaseStorage implements StorageInterface {
  async saveFile(
    file: Express.Multer.File,
    relativePath: string
  ): Promise<string> {
    // Pour le stockage en base, on retourne juste un identifiant
    // Le fichier sera stocké dans fileData par le service
    return `database:${relativePath}`;
  }

  async getFile(relativePath: string): Promise<Buffer> {
    // Cette méthode ne sera pas utilisée car on récupère directement depuis la DB
    throw new Error('DatabaseStorage: Utilisez documentService.getDocument() pour récupérer les fichiers');
  }

  async deleteFile(relativePath: string): Promise<void> {
    // La suppression se fait via Prisma CASCADE, pas besoin de supprimer le fichier
    return;
  }

  async fileExists(relativePath: string): Promise<boolean> {
    // Vérification via la base de données
    return true;
  }
}
