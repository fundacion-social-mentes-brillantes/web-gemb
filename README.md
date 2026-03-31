# web-gemb

Sitio web oficial de **Gimnasio Emocional Mentes Brillantes (GEMB)**.  
🌐 [gimnasioemocionalmb.com](https://gimnasioemocionalmb.com/)

---

## Descripción

Este repositorio contiene el sitio web oficial de GEMB, construido con **React + Vite** y publicado automáticamente en **Vercel** desde la rama `main`.

GEMB es un Gimnasio Emocional: un espacio para entrenar el carácter, desintoxicar el Ego y recablear patrones emocionales con práctica guiada, liderado por Alexandra Ortega.

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| React | Interfaz de usuario |
| Vite | Bundler y servidor de desarrollo |
| Tailwind CSS | Estilos y diseño responsive |
| Vercel | Hosting y despliegue automático |

---

## Cómo correr el proyecto en local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173` en tu navegador.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo local |
| `npm run build` | Empaqueta el sitio para producción (genera `/dist`) |
| `npm run preview` | Vista previa del build de producción |
| `npm run lint` | Linter de código |

---

## Flujo de trabajo

1. Se trabaja en local con `npm run dev`
2. Se revisa visualmente en `http://localhost:5173`
3. Se hace commit y push a `main` en GitHub
4. Vercel detecta el push y publica automáticamente en producción

---

## Archivos importantes

| Archivo | Descripción |
|---|---|
| `src/App.jsx` | Componente principal — toda la lógica y UI del sitio |
| `public/logo-gemb.png` | Logo oficial de la marca |
| `public/robots.txt` | Instrucciones para motores de búsqueda |
| `public/sitemap.xml` | Mapa del sitio para indexación SEO |
| `public/googlebd4867860e3b5091.html` | Archivo de verificación de Google Search Console |

---

## SEO

El sitio ya tiene SEO técnico básico implementado en `index.html`:

- ✅ `<title>` con nombre de marca y keyword principal
- ✅ Meta description con descripción de servicio
- ✅ Etiqueta `canonical` apuntando a `https://gimnasioemocionalmb.com/`
- ✅ Open Graph completo (título, descripción, imagen) para compartir en redes
- ✅ Twitter Card configurada
- ✅ `robots.txt` permitiendo indexación completa
- ✅ `sitemap.xml` enviado a Google Search Console
- ✅ Favicon con el logo de la marca

---

## Notas

- No volver a reemplazar este README por el template genérico de Vite.
- Mantener este archivo actualizado si se agregan páginas, rutas o cambios estructurales importantes.
- El sitio es una SPA (Single Page Application) — todo vive en `App.jsx`.
