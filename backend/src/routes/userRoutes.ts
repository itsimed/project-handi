// project-handi/backend/src/routes/user.routes.ts

import { Router } from 'express';
import { getUsersHandler, createUserController, deleteUserController, updatePasswordController, updateProfileController } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Route GET /users
router.get('/', getUsersHandler);

// Route POST /users
router.post('/', createUserController);

// Route DELETE /users/:id (protégée, utilisateur doit être authentifié)
router.delete('/:id', authenticateToken, deleteUserController);

// Route PUT /users/:id/password (protégée, utilisateur doit être authentifié)
router.put('/:id/password', authenticateToken, updatePasswordController);

// Route PUT /users/:id/profile (protégée, utilisateur doit être authentifié)
router.put('/:id/profile', authenticateToken, updateProfileController);

export default router;