const { spawn } = require('child_process');
const path = require('path');

console.log('✨ [Perseus Production] Démarrage du serveur Next.js sur port 3001...');

const NEXT_PORT = process.env.PORT || 3001;
const nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');

const nextStart = spawn('node', ['--max-old-space-size=512', nextBin, 'start', '-p', String(NEXT_PORT)], {
  stdio: 'inherit',
  shell: true,
  env: { 
    ...process.env,
    PORT: String(NEXT_PORT),
    NODE_ENV: 'production'
  }
});

nextStart.on('close', (code) => {
  console.log(`Next.js server closed with code ${code}`);
  process.exit(code || 0);
});

nextStart.on('error', (err) => {
  console.error('Next.js launch error:', err);
});
