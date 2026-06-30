const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BRANCH = 'claude/dashboard-canvas-preview-qapwbn';
const REPO = 'apexit764-beep/chat-admin';
const VPS_BASE = '/var/www/apexes.click/qhub-admin';
const SPA_ROUTES = ['dashboard', 'clients', 'plans', 'finance', 'payments', 'reports', 'preview', 'settings', 'login'];

console.log('=== Qhub Deploy Script ===\n');

// Step 1: Build
console.log('[1/4] Building...');
execSync('npx vite build', { stdio: 'inherit' });

// Step 2: Git commit & push
console.log('\n[2/4] Committing & pushing...');
try {
  execSync('git add -f dist/', { stdio: 'inherit' });
  execSync('git commit -m "Deploy build update"', { stdio: 'inherit' });
} catch (e) {
  console.log('  No changes to commit (dist unchanged)');
}
execSync(`git push -u origin ${BRANCH}`, { stdio: 'inherit' });

// Step 3: Generate deploy manifest
console.log('\n[3/4] Generating deploy manifest...');
const distDir = path.join(__dirname, 'dist');
const files = [];

function walk(dir, rel) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(rel, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, relPath);
    } else {
      const url = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/dist/${relPath}`;
      const target = `${VPS_BASE}/${relPath}`;
      files.push({ url, target, name: relPath, size: fs.statSync(fullPath).size });
    }
  }
}
walk(distDir, '');

// Step 4: Output manifest
const manifest = {
  branch: BRANCH,
  repo: REPO,
  vpsBase: VPS_BASE,
  spaRoutes: SPA_ROUTES,
  files,
  indexHtml: files.find(f => f.name === 'index.html'),
};

const manifestPath = path.join(__dirname, '.deploy-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`\n[4/4] Manifest written to .deploy-manifest.json`);
console.log(`  Total files: ${files.length}`);
console.log(`  Total size: ${(files.reduce((s, f) => s + f.size, 0) / 1024).toFixed(1)} KB`);
console.log('\nFiles to deploy:');
files.forEach(f => console.log(`  ${f.name} (${(f.size / 1024).toFixed(1)} KB)`));
console.log(`\nSPA routes: ${SPA_ROUTES.join(', ')}`);
console.log('\n=== Ready for VPS deployment ===');
