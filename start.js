// Bridges GoDaddy PaaS $PORT to n8n's N8N_PORT before process starts
const PORT = process.env.PORT || 5678;
process.env.N8N_PORT     = PORT;
process.env.N8N_HOST     = process.env.N8N_HOST     || '0.0.0.0';
process.env.N8N_PROTOCOL = process.env.N8N_PROTOCOL || 'https';

console.log(`[start.js] Starting n8n on port ${PORT}`);
console.log(`[start.js] Node version: ${process.version}`);
console.log(`[start.js] N8N_HOST: ${process.env.N8N_HOST}`);
console.log(`[start.js] N8N_PROTOCOL: ${process.env.N8N_PROTOCOL}`);

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Resolve n8n binary — works on both Windows and Linux
const binName = process.platform === 'win32' ? 'n8n.cmd' : 'n8n';
const binPath = path.join(__dirname, 'node_modules', '.bin', binName);

if (!fs.existsSync(binPath)) {
  console.error(`[start.js] ERROR: n8n binary not found at ${binPath}`);
  console.error('[start.js] Make sure npm install completed successfully.');
  process.exit(1);
}

console.log(`[start.js] Found n8n binary at: ${binPath}`);

const child = spawn(binPath, ['start'], {
  stdio: 'inherit',
  env: process.env,
  shell: false,
});

child.on('error', (err) => {
  console.error('[start.js] Failed to start n8n:', err.message);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`[start.js] n8n exited with code ${code}`);
  process.exit(code || 0);
});

process.on('SIGTERM', () => child.kill('SIGTERM'));
process.on('SIGINT',  () => child.kill('SIGINT'));
