import { StorageInterface } from './storageInterface';
import { LocalStorage } from './localStorage';

/**
 * Factory pour créer l'instance de stockage appropriée
 * Facilite le switch entre local et S3 via variable d'environnement
 */
export function getStorageBackend(): StorageInterface {
  const storageType = process.env.STORAGE_TYPE || 'local';
  const uploadsDir = process.env.UPLOADS_DIR || './uploads';
  
  switch (storageType) {
    case 'local':
      return new LocalStorage(uploadsDir);
    case 's3':
      // Future implémentation
      // return new S3Storage(process.env.AWS_S3_BUCKET!, process.env.AWS_REGION!);
      throw new Error('S3 storage pas encore implémenté. Utilisez STORAGE_TYPE=local');
    default:
      throw new Error(`Type de stockage inconnu: ${storageType}`);
  }
}
