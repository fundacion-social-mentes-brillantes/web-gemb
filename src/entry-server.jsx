/**
 * Entry de renderizado en servidor (SSG).
 *
 * Renderiza las rutas públicas a HTML durante el build a partir del MISMO
 * componente raíz que monta el navegador (`App`), de modo que el HTML servido y
 * el DOM final coinciden: sin resúmenes paralelos y sin divergencia entre lo que
 * ve un rastreador y lo que ve un visitante.
 *
 * Se usa `prerenderToNodeStream` de react-dom/static (no renderToString) porque
 * es la única API de React que resuelve los componentes cargados con React.lazy
 * y emite los marcadores de Suspense en las mismas posiciones que espera el
 * cliente. Con renderToString habría que renderizar cada página por separado, y
 * entonces el árbol del servidor no coincidiría con el del cliente: la
 * hidratación fallaría y React reemplazaría el contenido servido.
 *
 * Las rutas se declaran de forma explícita para que el portal privado
 * (/mi-proceso) y el panel de administración queden fuera del build: así
 * Firebase nunca entra en el bundle de servidor.
 */

import React from 'react';
import { prerenderToNodeStream } from 'react-dom/static.node';
import App from './App.jsx';
import { PROCESS_PAGES, getSeoForPath } from './siteConfig';

export const ROUTES = [
  '/',
  '/fundacion',
  '/contacto',
  '/politica-de-privacidad',
  '/alexandra-ortega',
  ...PROCESS_PAGES.map((page) => page.path)
];

/** Renderiza una ruta pública: devuelve el HTML del #root y su SEO. */
export async function render(path) {
  if (!ROUTES.includes(path)) throw new Error(`Ruta no declarada para prerender: ${path}`);
  const { prelude } = await prerenderToNodeStream(<App initialPath={path} />);
  let html = '';
  for await (const chunk of prelude) html += chunk;
  return { html, seo: getSeoForPath(path) };
}
