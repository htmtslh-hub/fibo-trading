const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, 'public', 'pages', 'blog');

const template = (post, slug) => `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="../../favicon.png">
  <title>${post.title} — Fibo</title>
  <meta name="description" content="${post.title}. ${post.category} - ${post.readTime}.">
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${post.title}">
  <meta property="og:image" content="${post.image}">
  <meta property="og:type" content="article">
  <link rel="canonical" href="https://fibo.vn/pages/blog/${slug}">
  <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@600;700;800;900&family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../css/style.css?v=10">
  <style>
    .post-content { max-width: 680px; margin: 0 auto; }
    .post-content p { color: var(--text-2); font-size: 15px; line-height: 1.9; margin-bottom: 20px; }
    .post-content h2 { font-size: 22px; font-weight: 800; margin: 40px 0 16px; }
    .post-content h3 { font-size: 18px; font-weight: 700; margin: 32px 0 12px; }
    .post-content blockquote { border-left: 3px solid var(--accent); padding-left: 20px; margin: 28px 0; font-style: italic; color: var(--text-2); }
    .post-content strong { color: #fff; }
    .post-hero-img { width: 100%; max-height: 400px; object-fit: cover; border-radius: 20px; margin-bottom: 40px; }
    .post-meta { display: flex; gap: 16px; align-items: center; margin-bottom: 24px; }
    .post-meta span { font-size: 12px; color: var(--text-3); }
    .post-cta { background: rgba(255,255,255,.02); border: 1px solid var(--border); border-radius: 16px; padding: 32px; text-align: center; margin-top: 48px; }
  </style>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${post.title}",
    "image": "${post.image}",
    "author": { "@type": "Organization", "name": "Fibo" },
    "publisher": { "@type": "Organization", "name": "Fibo", "url": "https://fibo.vn" },
    "datePublished": "2026-05-01",
    "dateModified": "2026-05-26"
  }
  </script>
</head>
<body>
<nav class="nav">
  <a href="../../index.html" class="nav-logo"><img src="../../fibo_logo.png" alt="Fibo" class="nav-logo-img">Fi<span>bo</span></a>
  <ul class="nav-links">
    <li><a href="../../index.html">Trang chu</a></li>
    <li><a href="../blog.html" style="color:#fff;">Bai viet</a></li>
    <li><a href="../courses.html">Khoa hoc</a></li>
  </ul>
  <div class="nav-right">
    <a href="../cart.html" class="cart-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
      <span class="cart-badge hidden" id="cartBadge">0</span>
    </a>
    <a href="../course-detail.html?id=1" class="btn btn-primary btn-sm">Khoa hoc Pro</a>
  </div>
</nav>
<section class="section" style="padding-top:40px;">
  <div class="wrap">
    <div class="post-content">
      <div class="post-meta"><span class="dot"></span><span>${post.category}</span><span>•</span><span>${post.readTime}</span></div>
      <h1 style="font-family:'Exo 2',sans-serif;font-size:clamp(24px,4vw,36px);font-weight:900;margin-bottom:24px;line-height:1.2;">${post.title}</h1>
      <img src="${post.image}" alt="${post.title}" class="post-hero-img">
      ${post.content}
      <div class="post-cta"><h3 style="font-size:18px;font-weight:800;margin-bottom:8px;">Muon hoc trading co he thong?</h3><p style="color:var(--text-2);font-size:14px;margin-bottom:20px;">Khoa hoc Pro Trading 2.0 — Gan 50 bai tu A den Z</p><a href="../course-detail.html?id=1" class="btn btn-primary">Xem khoa hoc</a></div>
    </div>
  </div>
</section>
<footer class="footer">
  <div class="wrap">
    <div class="footer-bottom" style="margin-top:0;padding-top:0;border:none;">&copy; 2024 Fibo. All rights reserved.</div>
  </div>
</footer>
<script src="../../js/cart-badge.js?v=1"></script>
<script src="../../js/animations.js?v=1"></script>
<script type="module" src="../../js/analytics.js?v=1"></script>
</body>
</html>`;

// Read blog-post.html and extract posts data
const blogPostFile = fs.readFileSync(path.join(__dirname, 'pages', 'blog-post.html'), 'utf8');
const scriptMatch = blogPostFile.match(/var posts = \{([\s\S]*?)\n\};/);

if (!scriptMatch) {
  console.log('No posts data found, skipping blog generation');
  process.exit(0);
}

// Extract slug keys from the posts object
const slugRegex = /'([a-z0-9-]+)':\s*\{[^}]*title:\s*'([^']*)'[^}]*category:\s*'([^']*)'[^}]*readTime:\s*'([^']*)'[^}]*image:\s*'([^']*)'[^}]*content:\s*'([\s\S]*?)(?='\s*\n\s*\})/g;

let match;
const posts = [];
const fullScript = 'var posts = {' + scriptMatch[1] + '\n};';

// Simpler approach: extract each post block
const postBlocks = fullScript.split(/'\s*\},?\s*\n\s*'/);

// Use regex to find all slugs and their titles
const simpleRegex = /'([a-z0-9-]+)':\s*\{\s*\n?\s*title:\s*'([^']*)'/g;
let simpleMatch;
const slugs = [];
while ((simpleMatch = simpleRegex.exec(fullScript)) !== null) {
  slugs.push(simpleMatch[1]);
}

console.log('Found ' + slugs.length + ' blog posts');

// For each slug, extract post data using individual regex
slugs.forEach(slug => {
  const postRegex = new RegExp("'" + slug + "':\\s*\\{\\s*\\n?\\s*title:\\s*'([^']*)'[\\s\\S]*?category:\\s*'([^']*)'[\\s\\S]*?readTime:\\s*'([^']*)'[\\s\\S]*?image:\\s*'([^']*)'[\\s\\S]*?content:\\s*'([\\s\\S]*?)(?='\\s*\\n\\s*\\})", 'g');
  const m = postRegex.exec(fullScript);
  if (m) {
    posts.push({
      slug,
      title: m[1],
      category: m[2],
      readTime: m[3],
      image: m[4],
      content: m[5]
    });
  }
});

console.log('Parsed ' + posts.length + ' posts successfully');

// Generate static HTML
fs.mkdirSync(BLOG_DIR, { recursive: true });

posts.forEach(post => {
  const html = template(post, post.slug);
  fs.writeFileSync(path.join(BLOG_DIR, post.slug + '.html'), html, 'utf8');
});

console.log('Generated ' + posts.length + ' static blog pages in public/pages/blog/');
