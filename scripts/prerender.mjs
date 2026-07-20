/**
 * Prerender de rutas públicas — Google Ad Grants / SEO.
 *
 * Tras `vite build`, genera dist/<ruta>/index.html con título, metas,
 * canonical y un bloque de contenido HTML real dentro de #root, para que
 * rastreadores y revisores que no ejecutan JavaScript vean el contenido
 * institucional (hoy el HTML crudo llega vacío por ser una SPA).
 *
 * React reemplaza este contenido al hidratar (createRoot().render()), así
 * que el usuario final ve la app completa; el bloque estático solo existe
 * durante la carga y para clientes sin JS.
 *
 * IMPORTANTE: los textos de abajo son resúmenes fieles del contenido real
 * de cada página (src/App.jsx, FundacionPage.jsx, PrivacyPage.jsx). Si esa
 * copia cambia de fondo, actualiza también este archivo.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const template = readFileSync(join(dist, 'index.html'), 'utf8');

const SITE = 'https://www.gimnasioemocionalmb.com';

const BASE_STYLE = `
<style>
  .prerender{max-width:46rem;margin:0 auto;padding:4.5rem 1.5rem;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#1a1a1a;background:#f2f0e9;line-height:1.65}
  .prerender h1{font-size:2rem;line-height:1.15;color:#2e4036;margin:0 0 .5rem}
  .prerender h2{font-size:1.25rem;color:#2e4036;margin:2.2rem 0 .4rem}
  .prerender p,.prerender li{font-size:1rem;color:#333}
  .prerender a{color:#2e4036;font-weight:600}
  .prerender .badge{display:inline-block;border:1px solid #2e4036;border-radius:999px;padding:.35rem .9rem;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:#2e4036;margin-bottom:1.2rem}
  .prerender footer{margin-top:3rem;padding-top:1.2rem;border-top:1px solid #2e403633;font-size:.8rem;color:#555}
  .prerender nav{margin:1.6rem 0}
  .prerender nav a{margin-right:1rem;font-size:.9rem}
</style>`;

const FOOTER = `
<footer>
  <p><strong>Fundación Social Mentes Brillantes</strong> · NIT 901.002.849-3 · Entidad sin ánimo de lucro · Bogotá, Colombia</p>
  <p>fundacionsocial@gimnasioemocionalmb.com · WhatsApp +57 311 260 2355 · <a href="/politica-de-privacidad">Política de tratamiento de datos</a></p>
</footer>`;

const NAV = `
<nav aria-label="Secciones del sitio">
  <a href="/fundacion">La Fundación</a>
  <a href="/sesion-coach">Sesión Coach</a>
  <a href="/sala-reduccion-ego">Sala de Reducción del Ego</a>
  <a href="/entrega-de-pasos">Entrega de Pasos</a>
  <a href="/curso-de-milagros">Un Curso de Milagros</a>
  <a href="/alexandra-ortega">Alexandra Ortega</a>
</nav>`;

const NGO_JSONLD = `<script type="application/ld+json">{"@context":"https://schema.org","@type":"NGO","name":"Fundación Social Mentes Brillantes","alternateName":["Gimnasio Emocional Mentes Brillantes","GEMB"],"url":"${SITE}","logo":"${SITE}/logo-gemb.png","foundingDate":"2016","taxID":"901.002.849-3","email":"fundacionsocial@gimnasioemocionalmb.com","telephone":"+573112602355","address":{"@type":"PostalAddress","addressLocality":"Bogotá","addressCountry":"CO"},"sameAs":["https://www.instagram.com/gimnasioemocional_mb"]}</script>`;

const ROUTES = [
  {
    path: '/',
    title: 'Gimnasio Emocional Mentes Brillantes | Fundación Social Mentes Brillantes',
    description:
      'Programa de entrenamiento emocional de la Fundación Social Mentes Brillantes (entidad sin ánimo de lucro, NIT 901.002.849-3): encuentros comunitarios gratuitos en Bogotá, procesos de transformación y prevención en salud mental desde 2016.',
    jsonld: NGO_JSONLD,
    body: `
<div class="prerender">
  <span class="badge">Fundación Social Mentes Brillantes · Entidad sin ánimo de lucro</span>
  <h1>Esto no es terapia. Es entrenamiento emocional.</h1>
  <p><strong>Gimnasio Emocional Mentes Brillantes (GEMB)</strong> es el programa de entrenamiento emocional de la
  <strong>Fundación Social Mentes Brillantes</strong> (NIT 901.002.849-3, Bogotá, Colombia). Une conciencia, oración,
  meditación, 12 Pasos, Un Curso de Milagros, Eneagrama y acompañamiento para que dejes de reaccionar desde el ego
  y empieces a entrenar desde la paz.</p>
  <h2>Una fundación detrás del método</h2>
  <p>Somos una entidad sin ánimo de lucro con labor continua desde 2016: realizamos encuentros comunitarios
  gratuitos cada semana en la Biblioteca Pública Carlos E. Restrepo de Bogotá (con transmisión virtual), formamos
  lideresas sociales y funcionarias junto a la Secretaría Distrital de la Mujer, y hacemos parte de la estrategia de
  prescripción social Más Bienestar de la Secretaría Distrital de Salud. Impactamos a más de 5.000 personas al año
  y acompañamos directamente a 181 familias. <a href="/fundacion">Conoce la labor social de la Fundación</a>.</p>
  <h2>Cómo nos sostenemos</h2>
  <p>Los espacios comunitarios son 100% gratuitos. Los procesos personales y los talleres contratados por empresas
  aplican tarifas cuyos excedentes se reinvierten por completo en la labor social: becas, espacios gratuitos y
  materiales educativos de libre acceso.</p>
  <h2>Procesos de entrenamiento</h2>
  <ul>
    <li><a href="/sesion-coach">Sesión Coach</a> — guía personal para mirar tu historia y ordenar tu mundo interior.</li>
    <li><a href="/sala-reduccion-ego">Sala de Reducción del Ego</a> — espacio grupal de entrenamiento emocional y espiritual.</li>
    <li><a href="/entrega-de-pasos">Entrega de Pasos</a> — proceso de escritura, honestidad y reparación interior.</li>
    <li><a href="/curso-de-milagros">Un Curso de Milagros</a> — recorrido espiritual para sanar la percepción.</li>
  </ul>
  ${NAV}
  ${FOOTER}
</div>`
  },
  {
    path: '/fundacion',
    title: 'La Fundación | Labor social de Gimnasio Emocional Mentes Brillantes',
    description:
      'Fundación Social Gimnasio Emocional Mentes Brillantes (NIT 901.002.849-3): encuentros comunitarios gratuitos en Bogotá, formación a lideresas, prescripción social en salud y un modelo solidario que reinvierte el 100% de los excedentes en labor social desde 2016.',
    jsonld: NGO_JSONLD,
    body: `
<div class="prerender">
  <span class="badge">Entidad sin ánimo de lucro · Desde 2016</span>
  <h1>Una fundación que entrena bienestar emocional en comunidad</h1>
  <p>La <strong>Fundación Social Mentes Brillantes</strong> (NIT 901.002.849-3, Bogotá, Colombia) entrega herramientas
  de inteligencia emocional, prevención de violencias y empoderamiento social a comunidades de Bogotá y a una
  comunidad digital dentro y fuera del país, con enfoque de género y diferencial.</p>
  <h2>Labor social gratuita</h2>
  <ul>
    <li>Encuentros comunitarios híbridos y gratuitos cada semana en la Biblioteca Pública Carlos E. Restrepo: Sala de Reducción del Ego y Mentoría de Pasos.</li>
    <li>Talleres de oratoria, comunicación asertiva y liderazgo con sororidad para lideresas y funcionarias, con la Secretaría Distrital de la Mujer y el COLMYG.</li>
    <li>Ferias de servicios y fechas emblemáticas en el Congreso de la República, alcaldías locales de Antonio Nariño y Kennedy y la CIOM.</li>
    <li>Huertas urbanas con enfoque de género (2025, presupuestos participativos) en la Huerta Comunitaria La Siempre Viva.</li>
    <li>Prescripción social: inscritos y viabilizados en la estrategia Más Bienestar 2026 de la Secretaría Distrital de Salud.</li>
    <li>Certificación de multiplicadoras de bienestar que replican la metodología en organizaciones como Fundación Calma y Escuela Shama.</li>
  </ul>
  <h2>Impacto</h2>
  <p>Labor continua desde 2016 · Más de 5.000 personas al año de forma presencial · 181 familias acompañadas
  directamente · Encuentros gratuitos semanales.</p>
  <h2>Reconocimientos</h2>
  <p>Destacados por el Ministerio del Interior en su revista institucional "Defensoras de nuestra Colombia" (2025).
  Ponentes en la Cumbre Global de Salud Mental 2025 y 2026. Organización viabilizada por la Secretaría Distrital de
  Salud de Bogotá.</p>
  <h2>Cómo nos sostenemos</h2>
  <p>Modelo solidario de subsidios cruzados: los servicios comunitarios son 100% gratuitos y el 100% de los
  excedentes de los procesos y talleres corporativos se reinvierte en la labor social — becas, espacios gratuitos,
  tecnología y materiales educativos.</p>
  <h2>Transparencia</h2>
  <p>Verificados en Google para Organizaciones sin Fines de Lucro y TechSoup Colombia. Solicita certificados e
  informes a fundacionsocial@gimnasioemocionalmb.com.</p>
  ${NAV}
  ${FOOTER}
</div>`
  },
  {
    path: '/politica-de-privacidad',
    title: 'Política de tratamiento de datos | Fundación Social Gimnasio Emocional Mentes Brillantes',
    description:
      'Conoce cómo la Fundación Social Gimnasio Emocional Mentes Brillantes (NIT 901.002.849-3) protege y trata tus datos personales según la Ley 1581 de 2012.',
    body: `
<div class="prerender">
  <h1>Política de tratamiento de datos personales</h1>
  <p><strong>Responsable:</strong> Fundación Social Mentes Brillantes, NIT 901.002.849-3, Bogotá, Colombia.
  Contacto: fundacionsocial@gimnasioemocionalmb.com · WhatsApp +57 311 260 2355.</p>
  <h2>Qué datos tratamos</h2>
  <p>Datos de contacto entregados en formularios (nombre, teléfono, correo, ciudad), respuestas de tests de
  autoconocimiento y datos de acceso al portal privado de procesos. Los datos sensibles de bienestar emocional se
  tratan con confidencialidad reforzada y responderlos es siempre voluntario.</p>
  <h2>Tus derechos (Ley 1581 de 2012)</h2>
  <p>Conocer, actualizar, rectificar y suprimir tus datos, solicitar prueba de la autorización, revocarla y
  presentar quejas ante la Superintendencia de Industria y Comercio. Escríbenos para ejercerlos.</p>
  <p>No vendemos ni alquilamos datos personales. Los proveedores tecnológicos (Google Firebase, Vercel) actúan como
  encargados del tratamiento. La versión completa y vigente de esta política está publicada en esta página.</p>
  ${NAV}
  ${FOOTER}
</div>`
  },
  {
    path: '/sesion-coach',
    title: 'Sesión Coach Emocional | Gimnasio Emocional Mentes Brillantes',
    description:
      'Agenda una Sesión Coach con Gimnasio Emocional Mentes Brillantes para mirar tu historia, ordenar tu mundo interior y recibir guía en tu proceso emocional.',
    body: `
<div class="prerender">
  <h1>Sesión Coach emocional</h1>
  <p>Una Sesión Coach de Gimnasio Emocional Mentes Brillantes es un espacio personal para mirar tu historia,
  ordenar tu mundo interior y recibir guía concreta en tu proceso emocional. Sales con una lectura clara de tu
  patrón emocional, un primer protocolo de entrenamiento y la ruta recomendada según tu caso.</p>
  <p>Este servicio hace parte del modelo solidario de la <a href="/fundacion">Fundación Social Mentes
  Brillantes</a>: los excedentes financian los programas comunitarios gratuitos.</p>
  ${NAV}
  ${FOOTER}
</div>`
  },
  {
    path: '/sala-reduccion-ego',
    title: 'Sala de Reducción del Ego | Gimnasio Emocional Mentes Brillantes',
    description:
      'Participa en la Sala de Reducción del Ego de Gimnasio Emocional Mentes Brillantes, un espacio de entrenamiento emocional y espiritual para reconocer el ego, rendir el control y volver a la conciencia.',
    body: `
<div class="prerender">
  <h1>Sala de Reducción del Ego</h1>
  <p>La Sala de Reducción del Ego es un espacio grupal de entrenamiento emocional y espiritual para reconocer el
  ego, rendir el control y volver a la conciencia. Se realiza cada semana en modalidad híbrida: presencial en la
  Biblioteca Pública Carlos E. Restrepo (Bogotá) y virtual, con acceso libre y gratuito como parte de la labor
  social de la <a href="/fundacion">Fundación Social Mentes Brillantes</a>.</p>
  ${NAV}
  ${FOOTER}
</div>`
  },
  {
    path: '/entrega-de-pasos',
    title: 'Entrega de Pasos | Proceso emocional y espiritual GEMB',
    description:
      'La Entrega de Pasos en Gimnasio Emocional Mentes Brillantes es un proceso de escritura, honestidad y reparación interior para ordenar la historia personal y avanzar con más paz.',
    body: `
<div class="prerender">
  <h1>Entrega de Pasos</h1>
  <p>La Entrega de Pasos es un proceso de escritura, honestidad y reparación interior para ordenar la historia
  personal y avanzar con más paz. Se acompaña mediante la Mentoría de Pasos, uno de los espacios comunitarios de la
  <a href="/fundacion">Fundación Social Mentes Brillantes</a>.</p>
  ${NAV}
  ${FOOTER}
</div>`
  },
  {
    path: '/curso-de-milagros',
    title: 'Un Curso de Milagros en Colombia | Gimnasio Emocional Mentes Brillantes',
    description:
      'Estudia y practica Un Curso de Milagros con Gimnasio Emocional Mentes Brillantes. Un recorrido espiritual para sanar la percepción, elegir de nuevo y volver al amor.',
    body: `
<div class="prerender">
  <h1>Un Curso de Milagros</h1>
  <p>Un recorrido espiritual para estudiar y practicar Un Curso de Milagros: sanar la percepción, elegir de nuevo y
  volver al amor, con la guía de Gimnasio Emocional Mentes Brillantes, programa de la
  <a href="/fundacion">Fundación Social Mentes Brillantes</a>.</p>
  ${NAV}
  ${FOOTER}
</div>`
  },
  {
    path: '/alexandra-ortega',
    title: 'Alexandra Ortega | Fundadora de Gimnasio Emocional Mentes Brillantes',
    description:
      'Conoce a Alexandra Ortega: psicóloga, coach ontológica y fundadora de la técnica Gimnasio Emocional Mentes Brillantes (GEMB). Tallerista, conferencista y formadora en salud mental con trayectoria continua desde 2016.',
    body: `
<div class="prerender">
  <h1>Alexandra Ortega</h1>
  <p>Psicóloga, coach ontológica y fundadora de la técnica Gimnasio Emocional Mentes Brillantes (GEMB), con
  trayectoria continua desde 2016 en inteligencia emocional, prevención en salud mental, liderazgo consciente,
  enfoque de género y construcción de paz territorial. Ponente en la Cumbre Global de Salud Mental 2025 y lideresa
  de la <a href="/fundacion">Fundación Social Mentes Brillantes</a> (NIT 901.002.849-3).</p>
  ${NAV}
  ${FOOTER}
</div>`
  }
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

let written = 0;
for (const route of ROUTES) {
  const url = `${SITE}${route.path === '/' ? '/' : route.path}`;
  let html = template;

  // Título y metas (el template trae los del home; se sustituyen por ruta).
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${route.title}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(route.description)}$2`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(route.title)}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(route.description)}$2`);
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(route.title)}$2`);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(route.description)}$2`);

  // Estilos del bloque estático + JSON-LD en <head>.
  html = html.replace('</head>', `${BASE_STYLE}\n${route.jsonld || ''}\n</head>`);

  // Contenido estático dentro de #root (React lo reemplaza al hidratar).
  html = html.replace('<div id="root"></div>', `<div id="root">${route.body}</div>`);

  const outDir = route.path === '/' ? dist : join(dist, route.path.slice(1));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
  written += 1;
}

console.log(`[prerender] ${written} rutas prerenderizadas en dist/`);
