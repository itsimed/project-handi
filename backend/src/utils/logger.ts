/**
 * Logger utilitaire pour un affichage cohérent des logs
 * Écrit à la fois dans le terminal ET dans un fichier de log
 */

import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(__dirname, '../../logs/server.log');

// Créer le dossier logs s'il n'existe pas
const logsDir = path.dirname(LOG_FILE);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

function writeLog(level: string, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}${data ? ' ' + JSON.stringify(data) : ''}`;
  
  // Écrire dans le terminal
  console.log(logMessage);
  
  // Écrire dans le fichier
  try {
    fs.appendFileSync(LOG_FILE, logMessage + '\n', 'utf8');
  } catch (error) {
    // Si on ne peut pas écrire dans le fichier, on continue quand même
  }
}

export const logger = {
  info: (message: string, data?: any) => writeLog('INFO', message, data),
  error: (message: string, data?: any) => writeLog('ERROR', message, data),
  warn: (message: string, data?: any) => writeLog('WARN', message, data),
  debug: (message: string, data?: any) => writeLog('DEBUG', message, data),
};
