# Análisis del rechazo de Google Ad Grants — 20 de julio de 2026

Documento de diagnóstico para corregir el sitio **gimnasioemocionalmb.com** y reenviar la
solicitud de activación de Google Ad Grants. Sirve como brief para cualquier persona o IA
que trabaje en la corrección.

---

## 1. Qué dijo Google (textual)

Correo del 20/07/2026, 8:16 a.m. (Colombia), remitente `googlefornonprofits-noreply@google.com`:

> "No se pudo aprobar su solicitud porque el sitio web de su organización **no cumple con los
> estándares de la política de sitios web de Ad Grants**. Acceda a su cuenta de Google para
> organizaciones sin fines de lucro y revise los requisitos para actualizar el sitio web de la
> organización. **Cuando termine, vuelva a enviar la solicitud de activación para su revisión.**"

Puntos importantes:

- **Google nunca especifica la razón exacta** — este texto es genérico para todo rechazo por
  política de sitio web. Hay que deducir las causas y corregirlas todas.
- **Se puede reenviar sin límite ni penalidad.** El propio correo lo invita.
- La validación de la organización como fundación **no está en duda** (eso ya está aprobado);
  el problema es exclusivamente el sitio web.

## 2. Qué revisaron exactamente

Línea de tiempo verificada:

| Evento | Fecha/hora (Colombia) |
|---|---|
| Página `/fundacion` y política de privacidad publicadas | 19/07 ~8:42 a.m. |
| Solicitud enviada (correo "recibirá actualización en 3 días") | 19/07 2:56 p.m. |
| Rechazo | 20/07 8:16 a.m. |

Conclusión: el revisor **sí tuvo disponible** la página de la Fundación, la política de datos y
el footer legal. El rechazo NO se explica por la ausencia de esos elementos → las causas están
en otra parte.

## 3. Causas probables, en orden

### 🔴 Causa 1 (probabilidad alta): el sitio se percibe como negocio de coaching, no como el sitio de una fundación

La política exige que la actividad comercial sea **secundaria** y que la misión domine. El
"primer minuto" del revisor ocurre en el **home**, y el home actual comunica venta:

- **Navbar:** `Método · Procesos · Sesión Coach · Planes` — no existe "La Fundación" ni
  "Quiénes somos" en el menú principal (solo en el footer).
- **Hero:** lenguaje de marca/entrenamiento; la palabra "fundación" no aparece en la parte
  superior de la página.
- **Lenguaje de marketing de urgencia:** "Cupos limitados por semana", "Garantía 100%
  (Proceso Completo)", sección "Planes" con tres ofertas tipo pricing.
- La sección nueva "Detrás de este método hay una fundación" existe pero está **muy abajo**
  (después de Método, Manifiesto, Procesos, Sesión Coach y Alexandra).

Un revisor que dedica 1-2 minutos ve: landing de venta de coaching con una sección social al
final → "actividad comercial predominante" → rechazo.

### 🔴 Causa 2 (probabilidad alta): el contenido es invisible en el HTML (SPA 100% JavaScript)

Evidencia dura medida el 20/07/2026:

- El HTML servido por `https://www.gimnasioemocionalmb.com/` pesa **2.784 caracteres** y su
  `<body>` contiene **0 caracteres de texto visible** (solo `<div id="root"></div>` + script).
- Todo el contenido (misión, labor social, política de privacidad) se pinta con un bundle de
  JavaScript de **1,54 MB (455 KB gzip)**.

Los sistemas automáticos de evaluación de contenido de Ad Grants y las herramientas del
revisor pueden clasificar el sitio como "sin contenido sustancial" aunque en el navegador se
vea completo. Es un motivo de rechazo documentado para SPAs.

### 🟠 Causa 3 (probabilidad media): velocidad de carga móvil

- Requisito explícito: "las páginas deben cargar rápido en distintos dispositivos y
  conexiones".
- El render depende de descargar+ejecutar 455 KB gzip de JS (todo el sitio en un chunk),
  más GSAP desde CDN externo en el home. En un móvil de gama media/baja el First Contentful
  Paint queda tarde.
- No se pudo obtener el score oficial de PageSpeed (el API respondió 429 repetidamente),
  pero la arquitectura predice un puntaje móvil bajo. Medirlo manualmente en
  https://pagespeed.web.dev con la URL del home.

### 🟡 Causa 4 (probabilidad baja, fricción adicional): nombre registrado vs. marca del sitio

- Nombre registrado ante Google: **"Fundación Social Mentes Brillantes"** (ID 901002849-3).
- Marca dominante del sitio: **"Gimnasio Emocional Mentes Brillantes"**; el footer dice
  "Fundación Social Gimnasio Emocional Mentes Brillantes".
- El NIT coincide, pero el revisor debe "conectar" ambos nombres. Conviene que el nombre
  registrado aparezca idéntico y visible (p. ej. en el hero/badge del home y en el `<title>`).

## 4. Plan de corrección priorizado

### P0 — Antes de reenviar (obligatorio)

**A. Reequilibrar el home hacia identidad de fundación** (`src/App.jsx`)
1. Navbar (desktop + móvil): añadir enlace **"La Fundación" → /fundacion**.
2. Hero: badge o subtítulo visible: *"Un programa de la Fundación Social Mentes Brillantes ·
   Entidad sin ánimo de lucro"*.
3. Subir la sección `FundacionSection` (idealmente justo después del Método o del Manifiesto,
   antes de las secciones de venta).
4. Reencuadrar la sección "Planes": título tipo "Procesos con aporte solidario" + línea
   visible "el 100% de los excedentes financia la labor social gratuita de la Fundación"
   (enlazando a /fundacion).
5. Eliminar o suavizar "Garantía 100%" y "Cupos limitados por semana" (lenguaje de scarcity
   marketing que refuerza la percepción comercial).
6. `<title>`/meta description del home: incluir "Fundación Social Mentes Brillantes".

**B. Hacer el contenido visible sin JavaScript (prerender/SSG)**
- Generar en build HTML estático con el contenido real para las rutas públicas:
  `/`, `/fundacion`, `/politica-de-privacidad`, `/curso-de-milagros`, `/sala-reduccion-ego`,
  `/entrega-de-pasos`, `/sesion-coach`, `/alexandra-ortega`.
- Opciones: `vite-prerender-plugin`, script post-build con puppeteer que guarde el HTML
  renderizado por ruta, o migración ligera a SSG. En Vercel basta con servir los .html
  estáticos por ruta (ajustar `vercel.json`).
- Criterio de éxito: `curl https://www.gimnasioemocionalmb.com/` debe devolver el texto de
  misión/fundación en el HTML (hoy devuelve 0 caracteres visibles).

### P1 — Muy recomendado en el mismo reenvío

**C. Rendimiento**
- Code-splitting con `import()` dinámico: portal `/mi-proceso`, modales de tests, jsPDF.
- `build.rollupOptions.output.manualChunks` para separar vendor (react, firebase, lucide).
- Cargar GSAP solo cuando se use (o eliminarlo del critical path del home).
- Meta: PageSpeed móvil ≥ 70 y LCP < 2,5 s.

**D. Señales de confianza arriba del fold**
- Chip "Entidad sin ánimo de lucro · NIT 901.002.849-3" cerca del hero.

### P2 — Opcional, suma pero no bloquea

- Página "Transparencia" con certificado ESAL/RUES descargable.
- Sección "Cómo participar / voluntariado / donaciones".
- Testimonios de la labor comunitaria con fotos reales.

## 5. Reenvío de la solicitud

1. Publicar P0 completo (A + B) — no reenviar a medias.
2. Verificar: HTML crudo con contenido, home con identidad de fundación arriba, PageSpeed.
3. Entrar a google.com/nonprofits → Ad Grants → **volver a enviar la solicitud de activación**.
4. Respuesta en ~3 días hábiles. Si vuelve a fallar, contactar soporte vía el Centro de ayuda
   de Ad Grants pidiendo detalle específico (existe formulario de contacto para grantees).

## 6. Contexto técnico para quien implemente

- Stack: React 19 + Vite 7 + Tailwind 3, SPA sin librería de router (rutas por
  `window.location.pathname` en `src/App.jsx` + rewrites en `vercel.json`). Deploy automático
  a Vercel al hacer push a `main` (GitHub `fundacion-social-mentes-brillantes/web-gemb`).
- Archivos clave: `src/App.jsx` (home, Navbar ~línea 555, Hero ~800, secciones, Footer ~1870,
  rutas ~2430), `src/components/FundacionPage.jsx`, `src/components/PrivacyPage.jsx`,
  `public/sitemap.xml`, `vercel.json`.
- **No tocar:** `/mi-proceso` (portal privado de clientes con Firebase), el visor de
  diapositivas de la diseñadora (`DesignedSlides.jsx`, imágenes en `public/kits/`), los tests
  de eneagrama (`testConfig.js` — ver `docs/mapa-test-eneagrama.md`), reglas de Firestore.
- Verificación mínima antes de publicar: `npm run lint` y `npm run build` en verde; probar
  home, /fundacion y /politica-de-privacidad en el navegador.
