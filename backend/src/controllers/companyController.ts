import { Request, Response } from 'express';
import * as companyService from '../services/companyService';

export const createCompany = async (req: Request, res: Response) =>
{
  try
  {
    const company = await companyService.createCompany(req.body);
    res.status(201).json(company);
  }
  catch (error: any)
  {
    res.status(500).json(
    {
      error: "Erreur lors de la création de l'entreprise", 
      details: error.message 
    });
  }
};

export const getCompanies = async (req: Request, res: Response) =>
{
  try
  {
    const companies = await companyService.getAllCompanies();
    res.json(companies);
  }
  catch (error: any)
  {
    console.error('Erreur getCompanies:', error);
    res.status(500).json({ 
      error: "Erreur lors de la récupération des entreprises",
      details: error.message 
    });
  }
};