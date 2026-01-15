"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// project-handi/backend/src/routes/statsRoutes.ts
const express_1 = require("express");
const statsController_1 = require("../controllers/statsController");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/v1/stats
 * @desc    Récupère toutes les statistiques (candidatures, candidats, offres, entreprises)
 * @access  Public
 */
router.get('/', statsController_1.getAllStats);
/**
 * @route   GET /api/v1/stats/applications
 * @desc    Récupère le nombre total de candidatures
 * @access  Public
 */
router.get('/applications', statsController_1.getTotalApplications);
/**
 * @route   GET /api/v1/stats/applicants
 * @desc    Récupère le nombre total de candidats inscrits
 * @access  Public
 */
router.get('/applicants', statsController_1.getTotalApplicants);
exports.default = router;
