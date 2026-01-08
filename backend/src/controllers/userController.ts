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