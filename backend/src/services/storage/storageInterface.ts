/**
 * Interface abstraite pour le stockage de fichiers
 * Permet de switcher facilement entre local et S3
 */
export interface StorageInterface {
  /**
   * Sauvegarder un fichier
   * @param file - Fichier uploadé via multer
   * @param relativePath - Chemin relatif (ex: "applications/123/cv")
   * @returns Chemin complet du fichier stocké
   */
  saveFile(
    file: Express.Multer.File,
    relativePath: string
  ): Promise<string>;

  /**
   * Récupérer un fichier
   * @param path - Chemin du fichier
   * @returns Buffer du fichier
   */
  getFile(path: string): Promise<Buffer>;

  /**
   * Supprimer un fichier
   * @param path - Chemin du fichier
   */
  deleteFile(path: string): Promise<void>;

  /**
   * Vérifier si un fichier existe
   * @param path - Chemin du fichier
   */
  fileExists(path: string): Promise<boolean>;
}
