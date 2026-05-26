const fs = require('fs');
const path = require('path');

const PUBLIC = path.join(__dirname, 'public');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(child => {
      copyRecursive(path.join(src, child), path.join(dest, child));
    });
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// Clean
if (fs.existsSync(PUBLIC)) fs.rmSync(PUBLIC, { recursive: true });
fs.mkdirSync(PUBLIC, { recursive: true });

// Root files
const rootFiles = ['index.html', 'firebase.js', 'sitemap.xml', 'robots.txt', 'favicon.png', 'fibo_logo.png', 'google18633e1777f97db5.html'];
rootFiles.forEach(f => {
  if (fs.existsSync(f)) fs.copyFileSync(f, path.join(PUBLIC, f));
});

// Directories
const dirs = ['css', 'js', 'pages', 'product', 'api'];
dirs.forEach(d => copyRecursive(d, path.join(PUBLIC, d)));

// Generate static blog pages
require('./generate-blog');

console.log('Build complete → public/');
