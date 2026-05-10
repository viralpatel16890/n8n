// Bridges GoDaddy PaaS $PORT to n8n's N8N_PORT before process starts
process.env.N8N_PORT = process.env.PORT || 5678;
process.env.N8N_HOST = process.env.N8N_HOST || '0.0.0.0';
process.env.N8N_PROTOCOL = process.env.N8N_PROTOCOL || 'https';

const { spawn } = require('child_process');
const path = require('path');

const n8nBin = path.join(__dirname, 'node_modules', '.bin', 'n8n');
const child = spawn(n8nBin, ['start'], {
  stdio: 'inherit',
  env: process.env,
  shell: false,
});

child.on('exit', (code) => process.exit(code || 0));
process.on('SIGTERM', () => child.kill('SIGTERM'));
process.on('SIGINT', () => child.kill('SIGINT'));
