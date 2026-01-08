// project-handi/backend/src/services/userService.ts

import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import type { CreateUserData, UpdateUserData } from '../types';

const prisma = new PrismaClient();

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