"use strict";
// project-handi/backend/src/routes/user.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Route GET /users
router.get('/', userController_1.getUsersHandler);
// Route POST /users
router.post('/', userController_1.createUserController);
// Route DELETE /users/:id (protégée, utilisateur doit être authentifié)
router.delete('/:id', authMiddleware_1.authenticateToken, userController_1.deleteUserController);
// Route PUT /users/:id/password (protégée, utilisateur doit être authentifié)
router.put('/:id/password', authMiddleware_1.authenticateToken, userController_1.updatePasswordController);
// Route PUT /users/:id/profile (protégée, utilisateur doit être authentifié)
router.put('/:id/profile', authMiddleware_1.authenticateToken, userController_1.updateProfileController);
exports.default = router;
