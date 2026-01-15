"use strict";
/**
 * Logger utilitaire pour un affichage cohérent des logs
 * Écrit à la fois dans le terminal ET dans un fichier de log
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const LOG_FILE = path_1.default.join(__dirname, '../../logs/server.log');
// Créer le dossier logs s'il n'existe pas
const logsDir = path_1.default.dirname(LOG_FILE);
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
function writeLog(level, message, data) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}${data ? ' ' + JSON.stringify(data) : ''}`;
    // Écrire dans le terminal
    console.log(logMessage);
    // Écrire dans le fichier
    try {
        fs_1.default.appendFileSync(LOG_FILE, logMessage + '\n', 'utf8');
    }
    catch (error) {
        // Si on ne peut pas écrire dans le fichier, on continue quand même
    }
}
exports.logger = {
    info: (message, data) => writeLog('INFO', message, data),
    error: (message, data) => writeLog('ERROR', message, data),
    warn: (message, data) => writeLog('WARN', message, data),
    debug: (message, data) => writeLog('DEBUG', message, data),
};
