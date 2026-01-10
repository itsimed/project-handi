// project-handi/backend/src/controllers/userController.ts

import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import * as userService from '../services/userService'; 

// GET /api/v1/users
export async function getUsersHandler(req: Request, res: Response) {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Erreur dans getUsersHandler:', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs.' });
  }
}

// POST /api/v1/users
export async function createUserController(req: Request, res: Response) {
  try {
    const newUser = await userService.createUser(req.body);
    // Le service a déjà retiré le mot de passe
    return res.status(201).json(newUser); 
  } catch (error) {
    console.error('Erreur dans createUserController:', error);
    return res.status(500).json({ message: 'Erreur lors de la création de l’utilisateur.' });
  }
}
// DELETE /api/v1/users/:id
export async function deleteUserController(req: AuthRequest, res: Response) {
  try {
    const userId = parseInt(req.params.id);
    const currentUserId = req.user?.userId;

    // Vérifier que l'utilisateur supprime bien son propre compte
    if (userId !== currentUserId) {
      return res.status(403).json({ 
        message: 'Vous ne pouvez supprimer que votre propre compte.' 
      });
    }

    await userService.deleteUser(userId);
    
    return res.status(200).json({ 
      message: 'Compte supprimé avec succès.' 
    });
  } catch (error: any) {
    console.error('Erreur dans deleteUserController:', error);
    return res.status(500).json({ 
      message: error.message || 'Erreur lors de la suppression du compte.' 
    });
  }
}

// PUT /api/v1/users/:id/password
export async function updatePasswordController(req: AuthRequest, res: Response) {
  try {
    const userId = parseInt(req.params.id);
    const currentUserId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    // Vérifier que l'utilisateur modifie son propre mot de passe
    if (userId !== currentUserId) {
      return res.status(403).json({ 
        error: 'Vous ne pouvez modifier que votre propre mot de passe.' 
      });
    }

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Mot de passe actuel et nouveau mot de passe requis.' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        error: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' 
      });
    }

    await userService.updatePassword(userId, currentPassword, newPassword);

    return res.status(200).json({ 
      message: 'Mot de passe modifié avec succès.' 
    });
  } catch (error: any) {
    console.error('Erreur updatePasswordController:', error);
    
    if (error.message === 'Mot de passe actuel incorrect') {
      return res.status(401).json({ error: error.message });
    }
    
    return res.status(500).json({ 
      error: 'Erreur lors de la modification du mot de passe.' 
    });
  }
}

// PUT /api/v1/users/:id/profile
export async function updateProfileController(req: AuthRequest, res: Response) {
  try {
    const userId = parseInt(req.params.id);
    const currentUserId = req.user?.userId;
    const { firstName, lastName, email } = req.body;

    // Vérifier que l'utilisateur modifie son propre profil
    if (userId !== currentUserId) {
      return res.status(403).json({ 
        error: 'Vous ne pouvez modifier que votre propre profil.' 
      });
    }

    const updatedUser = await userService.updateProfile(userId, {
      firstName,
      lastName,
      email
    });

    return res.status(200).json({ 
      message: 'Profil mis à jour avec succès.',
      user: updatedUser
    });
  } catch (error: any) {
    console.error('Erreur updateProfileController:', error);
    
    if (error.message === 'Cet email est déjà utilisé') {
      return res.status(409).json({ error: error.message });
    }
    
    return res.status(500).json({ 
      error: 'Erreur lors de la mise à jour du profil.' 
    });
  }
}