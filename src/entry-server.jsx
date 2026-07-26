/**
 * Entry de renderizado en servidor (SSG).
 *
 * Renderiza las páginas públicas REALES a HTML durante el build, usando los
 * mismos componentes que ve la persona en el navegador. Así el HTML servido y
 * el DOM final son el mismo contenido: no hay resúmenes paralelos ni
 * divergencia entre lo que ve un rastreador y lo que ve un visitante.
 *
 * Los componentes de página se importan de forma estática AQUÍ (no con lazy)
 * porque renderToString no resuelve React.lazy; este módulo solo entra en el
 * bundle de servidor, así que el cliente conserva su code-splitting.
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { HomePage, GlobalStyles, Navbar, Footer, ProcessPage } from './App.jsx';
import { PROCESS_PAGES, WA_NUMBER, getSeoForPath } from './siteConfig';
import FundacionPage from './components/FundacionPage';
import ContactoPage from './components/ContactoPage';
import PrivacyPage from './components/PrivacyPage';
import AlexandraPage from './components/AlexandraPage';

const shared = { GlobalStyles, Navbar, Footer, waNumber: WA_NUMBER, onOpenTest: () => {} };

const PAGE_BY_PATH = {
  '/': () => <HomePage onOpenTest={() => {}} onOpenGuarantee={() => {}} />,
  '/fundacion': () => <FundacionPage {...shared} />,
  '/contacto': () => <ContactoPage {...shared} />,
  '/politica-de-privacidad': () => <PrivacyPage {...shared} />,
  '/alexandra-ortega': () => <AlexandraPage {...shared} />
};

for (const page of PROCESS_PAGES) {
  PAGE_BY_PATH[page.path] = () => <ProcessPage page={page} onOpenTest={() => {}} />;
}

export const ROUTES = Object.keys(PAGE_BY_PATH);

/** Renderiza una ruta pública: devuelve el HTML del #root y su SEO. */
export function render(path) {
  const factory = PAGE_BY_PATH[path];
  if (!factory) throw new Error(`Ruta sin componente para prerender: ${path}`);
  return { html: renderToString(factory()), seo: getSeoForPath(path) };
}
