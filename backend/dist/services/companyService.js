"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompany = createCompany;
exports.getAllCompanies = getAllCompanies;
exports.getCompanyById = getCompanyById;
const prisma_1 = __importDefault(require("../config/prisma"));
/**
 * Crée une nouvelle entreprise en base de données
 */
async function createCompany(data) {
    return prisma_1.default.company.create({
        data
    });
}
/**
 * Récupère toutes les entreprises avec le compte de leurs offres
 */
async function getAllCompanies() {
    return prisma_1.default.company.findMany({
        include: {
            _count: {
                select: { offers: true }
            }
        }
    });
}
/**
 * Récupère une entreprise spécifique par son identifiant
 */
async function getCompanyById(id) {
    return prisma_1.default.company.findUnique({
        where: { id },
        include: {
            offers: true
        }
    });
}
