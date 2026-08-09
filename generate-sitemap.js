// generate-sitemap.js
// يمشي على كل ملفات HTML في المجلد ويولّد sitemap.xml تلقائيًا
const fs = require('fs');

const baseUrl = 'https://riorioriorio000000-debug.github.io/neo-syntax-portfolio';
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
files.forEach(file => {
  const loc = file === 'index.html' ? `${baseUrl}/` : `${baseUrl}/${file}`;
  const priority = file === 'index.html' ? '1.0' : '0.8';
  xml += `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority}</priority>\n  </url>\n`;
});
xml += '</urlset>\n';

fs.writeFileSync('sitemap.xml', xml);
console.log('تم توليد sitemap.xml — عدد الصفحات:', files.length);