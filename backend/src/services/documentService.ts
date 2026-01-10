import { DocumentType } from '@prisma/client';
import { getStorageBackend } from './storage/storageFactory';
import prisma from '../config/prisma';
const storage = getStorageBackend();

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880'); // 5MB par défaut

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

/**
 * Uploader un document pour une candidature
 */
export async function uploadDocument(
  applicationId: number,
  userId: number,
  file: Express.Multer.File,
  documentType: DocumentType
) {
  // Vérifier que la candidature existe et appartient à l'utilisateur
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    throw new Error('Candidature non trouvée');
  }

  if (application.userId !== userId) {
    throw new Error('Accès non autorisé à cette candidature');
  }

  // Validation du fichier
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Fichier trop volumineux (max ${MAX_FILE_SIZE / 1024 / 1024}MB)`);
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new Error('Type de fichier non autorisé (PDF, DOC, DOCX uniquement)');
  }

  // Vérifier si un document du même type existe déjà
  const existingDocument = await prisma.applicationDocument.findFirst({
    where: {
      applicationId,
      documentType,
    },
  });

  // Si existe, supprimer l'ancien fichier
  if (existingDocument) {
    await storage.deleteFile(existingDocument.storagePath);
    await prisma.applicationDocument.delete({
      where: { id: existingDocument.id },
    });
  }

  // Sauvegarder le fichier
  const relativePath = `applications/${applicationId}/${documentType.toLowerCase()}`;
  const storagePath = await storage.saveFile(file, relativePath);

  // Enregistrer les métadonnées en DB
  return await prisma.applicationDocument.create({
    data: {
      applicationId,
      fileName: file.originalname,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      storageType: process.env.STORAGE_TYPE || 'local',
      storagePath,
      documentType,
    },
  });
}

/**
 * Récupérer un document avec contrôle d'accès
 */
export async function getDocument(documentId: number, userId: number) {
  const document = await prisma.applicationDocument.findUnique({
    where: { id: documentId },
    include: {
      application: {
        include: {
          offer: true,
        },
      },
    },
  });

  if (!document) {
    throw new Error('Document non trouvé');
  }

  // Vérifier les droits d'accès
  const isOwner = document.application.userId === userId;
  const isRecruiter = document.application.offer.recruiterId === userId;

  if (!isOwner && !isRecruiter) {
    throw new Error('Accès non autorisé à ce document');
  }

  // Récupérer le fichier
  const fileBuffer = await storage.getFile(document.storagePath);

  return {
    buffer: fileBuffer,
    fileName: document.fileName,
    mimeType: document.mimeType,
  };
}

/**
 * Supprimer un document
 */
export async function deleteDocument(documentId: number, userId: number) {
  const document = await prisma.applicationDocument.findUnique({
    where: { id: documentId },
    include: { application: true },
  });

  if (!document) {
    throw new Error('Document non trouvé');
  }

  // Seul le propriétaire peut supprimer
  if (document.application.userId !== userId) {
    throw new Error('Accès non autorisé');
  }

  // Supprimer le fichier physique
  await storage.deleteFile(document.storagePath);

  // Supprimer l'entrée en DB
  await prisma.applicationDocument.delete({
    where: { id: documentId },
  });
}

/**
 * Lister les documents d'une candidature
 */
export async function getApplicationDocuments(applicationId: number, userId: number) {
  // Vérifier les droits d'accès
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { offer: true },
  });

  if (!application) {
    throw new Error('Candidature non trouvée');
  }

  const isOwner = application.userId === userId;
  const isRecruiter = application.offer.recruiterId === userId;

  if (!isOwner && !isRecruiter) {
    throw new Error('Accès non autorisé');
  }

  return await prisma.applicationDocument.findMany({
    where: { applicationId },
    orderBy: { uploadedAt: 'desc' },
  });
}
