// project-handi/backend/src/routes/user.routes.ts

import { Router } from 'express';
import { getUsersHandler, createUserController, deleteUserController } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Route GET /users
router.get('/', getUsersHandler);

// Route POST /users
router.post('/', createUserController);

// Route DELETE /users/:id (protégée, utilisateur doit être authentifié)
router.delete('/:id', authenticateToken, deleteUserController);

export default router;