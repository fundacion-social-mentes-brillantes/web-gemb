/**
 * Prerender (SSG) de las rutas públicas — Google Ad Grants / SEO.
 *
 * Renderiza cada página con los MISMOS componentes React que ve la persona en
 * el navegador (vía src/entry-server.jsx) y escribe el resultado en
 * dist/<ruta>/index.html. React hidrata encima de ese HTML, así que el
 * contenido servido y el contenido final coinciden: sin divergencia entre lo
 * que ve un rastreador y lo que ve un visitante.
 *
 * Requiere el bundle de servidor: `vite build --ssr src/entry-server.jsx`
 * (ver el script "build" de package.json).
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const serverDir = join(root, 'dist-ssr');
const serverEntry = join(serverDir, 'entry-server.js');

if (!existsSync(serverEntry)) {
  console.error('[prerender] Falta dist-ssr/entry-server.js — ejecuta primero el build de servidor.');
  process.exit(1);
}

const template = readFileSync(join(dist, 'index.html'), 'utf8');
const { render, ROUTES } = await import(pathToFileURL(serverEntry).href);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

const replaceMeta = (html, pattern, value) =>
  pattern.test(html) ? html.replace(pattern, value) : html;

// Contenido que debe aparecer sí o sí en el HTML de cada ruta. Si falta, el
// árbol no se resolvió y publicar sería peor que no prerenderizar.
const CONTENIDO_ESPERADO = {
  '/': 'Fundación Social Mentes Brillantes',
  '/fundacion': '901.002.849-3',
  '/contacto': 'Carlos E. Restrepo',
  '/politica-de-privacidad': 'Ley 1581',
  '/alexandra-ortega': 'Alexandra Ortega'
};

let written = 0;
for (const route of ROUTES) {
  const { html: appHtml, seo } = await render(route);

  // Salvaguardas: `<!--$!-->` marca un Suspense que cayó al fallback (se
  // publicaría el spinner dentro de #root) y la falta de `<!--$-->` significa
  // que no se emitieron los límites que el cliente espera al hidratar.
  if (appHtml.includes('<!--$!-->')) {
    throw new Error(`[prerender] ${route}: un Suspense cayó al fallback; no se publica HTML con spinner.`);
  }
  if (!appHtml.includes('<!--$-->')) {
    throw new Error(`[prerender] ${route}: faltan los límites de Suspense que el cliente espera al hidratar.`);
  }
  const esperado = CONTENIDO_ESPERADO[route];
  if (esperado && !appHtml.includes(esperado)) {
    throw new Error(`[prerender] ${route}: falta el contenido esperado ("${esperado}") en el HTML renderizado.`);
  }
  const url = `${seo.url || ''}`;
  let page = template;

  // Metadatos por ruta (los mismos que aplica useSeoMeta en el cliente).
  page = page.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`);
  page = replaceMeta(page, /(<meta name="description" content=")[^"]*(")/, `$1${esc(seo.description)}$2`);
  page = replaceMeta(page, /(<link rel="canonical" href=")[^"]*(")/, `$1${esc(url)}$2`);
  page = replaceMeta(page, /(<meta property="og:url" content=")[^"]*(")/, `$1${esc(url)}$2`);
  page = replaceMeta(page, /(<meta property="og:title" content=")[^"]*(")/, `$1${esc(seo.title)}$2`);
  page = replaceMeta(page, /(<meta property="og:description" content=")[^"]*(")/, `$1${esc(seo.description)}$2`);
  page = replaceMeta(page, /(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(seo.title)}$2`);
  page = replaceMeta(page, /(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(seo.description)}$2`);
  if (seo.image) {
    page = replaceMeta(page, /(<meta property="og:image" content=")[^"]*(")/, `$1${esc(seo.image)}$2`);
    page = replaceMeta(page, /(<meta name="twitter:image" content=")[^"]*(")/, `$1${esc(seo.image)}$2`);
  }
  if (seo.structuredData) {
    page = page.replace(
      '</head>',
      `<script id="gemb-jsonld" type="application/ld+json">${JSON.stringify(seo.structuredData)}</script>\n</head>`
    );
  }

  // Contenido real de la página dentro de #root (React hidrata encima).
  page = page.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  const outDir = route === '/' ? dist : join(dist, route.slice(1));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), page);
  written += 1;
  console.log(`[prerender] ${route} → ${Math.round(appHtml.length / 1024)} KB de HTML`);
}

// El bundle de servidor es solo una herramienta de build: no se publica.
rmSync(serverDir, { recursive: true, force: true });

console.log(`[prerender] ${written} rutas renderizadas con los componentes reales.`);
