// Bridges GoDaddy PaaS $PORT to n8n's N8N_PORT before process starts
process.env.N8N_PORT     = process.env.PORT || 5678;
process.env.N8N_HOST     = process.env.N8N_HOST     || '0.0.0.0';
process.env.N8N_PROTOCOL = process.env.N8N_PROTOCOL || 'https';

// Disable internal task runner spawning — causes ENOENT on PaaS environments
// where n8n's internal binary path is not available
process.env.N8N_RUNNERS_ENABLED = process.env.N8N_RUNNERS_ENABLED || 'false';

console.log(`[start.js] PORT=${process.env.N8N_PORT} | Node=${process.version} | Runners=${process.env.N8N_RUNNERS_ENABLED}`);

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const binName = process.platform === 'win32' ? 'n8n.cmd' : 'n8n';
const binPath = path.join(__dirname, 'node_modules', '.bin', binName);

if (!fs.existsSync(binPath)) {
  console.error(`[start.js] ERROR: n8n binary not found at ${binPath}`);
  process.exit(1);
}

// shell: true ensures bash resolves the symlink and PATH correctly on Linux
const child = spawn(binPath, ['start'], {
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

child.on('error', (err) => {
  console.error('[start.js] Failed to start n8n:', err.message);
  process.exit(1);
});

child.on('exit', (code) => process.exit(code || 0));

process.on('SIGTERM', () => child.kill('SIGTERM'));
process.on('SIGINT',  () => child.kill('SIGINT'));
