"use strict";
// backend/src/tunnel.ts
// Établir un tunnel SSH vers Paris 8 pour MySQL
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSSHTunnel = setupSSHTunnel;
const ssh2_1 = require("ssh2");
const net_1 = require("net");
const SSH_HOST = '10.10.2.220';
const SSH_PORT = 60022;
const SSH_USER = 'imed';
const SSH_PASSWORD = process.env.SSH_PASSWORD || '';
const LOCAL_PORT = 3306;
const REMOTE_MYSQL_HOST = '127.0.0.1';
const REMOTE_MYSQL_PORT = 3306;
async function setupSSHTunnel() {
    return new Promise((resolve) => {
        if (!SSH_PASSWORD) {
            console.warn('⚠️  SSH_PASSWORD not set, skipping tunnel');
            resolve(false);
            return;
        }
        const conn = new ssh2_1.Client();
        conn.on('ready', () => {
            console.log('✅ SSH connection established');
            const server = (0, net_1.createServer)((sock) => {
                console.log('📡 Forwarding connection...');
                conn.forwardOut('127.0.0.1', LOCAL_PORT, REMOTE_MYSQL_HOST, REMOTE_MYSQL_PORT, (err, stream) => {
                    if (err) {
                        console.error('❌ Forward error:', err);
                        sock.end();
                        return;
                    }
                    if (stream) {
                        sock.pipe(stream).pipe(sock);
                    }
                });
            });
            server.listen(LOCAL_PORT, '127.0.0.1', () => {
                console.log(`🔗 SSH tunnel established on localhost:${LOCAL_PORT}`);
                console.log(`   Forwarding to ${SSH_HOST}:${REMOTE_MYSQL_PORT}`);
                resolve(true);
            });
            server.on('error', (err) => {
                console.error('❌ Server error:', err);
            });
        });
        conn.on('error', (err) => {
            console.error('❌ SSH connection error:', err.message);
            console.error('   Details:', err);
            resolve(false);
        });
        conn.on('close', () => {
            console.log('⚠️  SSH connection closed');
        });
        console.log(`🔗 Connecting to SSH ${SSH_HOST}:${SSH_PORT}...`);
        console.log(`   Username: ${SSH_USER}`);
        console.log(`   Timeout: 30 seconds`);
        conn.connect({
            host: SSH_HOST,
            port: SSH_PORT,
            username: SSH_USER,
            password: SSH_PASSWORD,
            readyTimeout: 30000,
            tryKeyboard: false,
            algorithms: {
                cipher: ['aes128-ctr', 'aes256-ctr', 'aes128-gcm@openssh.com', 'aes256-gcm@openssh.com'],
            },
        });
    });
}
