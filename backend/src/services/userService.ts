// project-handi/backend/src/services/userService.ts

import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import type { CreateUserData, UpdateUserData } from '../types';
import prisma from '../config/prisma';

// --- Fonctions CRUD pour l'utilisateur ---

// Récupérer tous les utilisateurs
export async function getAllUsers()
{
  // Sélectionner uniquement les champs non sensibles
  return prisma.user.findMany
  (
    {
      select :
      {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        companyId: true // Utile pour identifier à quelle entreprise appartient un recruteur
      }
    }
  );
}

// Trouver un utilisateur par son email (indispensable pour le Login)
export async function findUserByEmail(email: string)
{
  return prisma.user.findUnique
  (
    {
      where : { email },
      include : { company: true /* Permet de récupérer les infos de l'entreprise si c'est un recruteur */ }
    }
  );
}

// Créer un nouvel utilisateur
export async function createUser(userData: CreateUserData)
{
  let finalCompanyId = userData.companyId;

  // Si c'est un recruteur avec un nom d'entreprise, créer ou trouver l'entreprise
  if (userData.role === 'RECRUITER' && userData.companyName && !userData.companyId)
  {
    // Vérifier si l'entreprise existe déjà
    let company = await prisma.company.findUnique
    (
      {
        where: { name: userData.companyName }
      }
    );

    // Si elle n'existe pas, la créer
    if (!company)
    {
      company = await prisma.company.create
      (
        {
          data: { name: userData.companyName }
        }
      );
    }

    finalCompanyId = company.id;
  }

  return prisma.user.create
  (
    {
      data :
      {
        email : userData.email,
        password : userData.password,
        firstName : userData.firstName,
        lastName : userData.lastName,
        role : userData.role,
        ...(finalCompanyId && {company : { connect : { id : finalCompanyId } } } )
      }
    }
  );
}

// Trouver par ID
export async function findUserById(id: number)
{
  return prisma.user.findUnique
  (
    {
      where: { id },
      select :
      {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      }
    }
  );
}

// Supprimer un utilisateur et toutes ses données associées
export async function deleteUser(userId: number)
{
  // Prisma gère la suppression en cascade si configuré dans le schéma
  // Sinon, nous devons supprimer manuellement les relations
  
  // 1. Supprimer toutes les candidatures de l'utilisateur
  await prisma.application.deleteMany({
    where: { userId }
  });

  // 2. Si c'est un recruteur, supprimer ses offres (et leurs candidatures associées)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  if (user?.role === 'RECRUITER') {
    // Supprimer les candidatures liées aux offres du recruteur
    await prisma.application.deleteMany({
      where: {
        offer: {
          recruiterId: userId
        }
      }
    });

    // Supprimer les offres du recruteur
    await prisma.offer.deleteMany({
      where: { recruiterId: userId }
    });
  }

  // 3. Supprimer l'utilisateur
  return prisma.user.delete({
    where: { id: userId }
  });
}

// Changer le mot de passe d'un utilisateur
export async function updatePassword(
  userId: number, 
  currentPassword: string, 
  newPassword: string
)
{
  // 1. Récupérer l'utilisateur avec son mot de passe
  const user = await prisma.user.findUnique({
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
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
    select: { id: true, email: true }
  });
}

// Mettre à jour le profil d'un utilisateur
export async function updateProfile(
  userId: number,
  data: { firstName?: string; lastName?: string; email?: string }
)
{
  // Vérifier si l'email est déjà utilisé par un autre utilisateur
  if (data.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser && existingUser.id !== userId) {
      throw new Error('Cet email est déjà utilisé');
    }
  }

  // Mettre à jour l'utilisateur
  return prisma.user.update({
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