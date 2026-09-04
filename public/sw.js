// Subir la versión invalida la caché anterior en el evento activate.
const CACHE_NAME = 'gemb-pwa-v3';

// Solo assets estáticos: el HTML nunca se precachea, para que el contenido
// institucional que ve una persona (o un revisor) sea siempre el publicado.
const APP_SHELL = [
  '/manifest.webmanifest',
  '/logo-gemb.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-192.png',
  '/icons/maskable-512.png',
  '/icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Documentos HTML: siempre desde la red (la caché solo cubre estar sin
  // conexión). Así nadie ve una versión anterior del contenido publicado.
  const isDocument =
    request.mode === 'navigate' ||
    request.destination === 'document' ||
    (request.headers.get('accept') || '').includes('text/html');

  if (isDocument) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok && networkResponse.type === 'basic') {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(request).then((hit) => hit || caches.match('/')))
    );
    return;
  }

  // Assets con hash en el nombre (/assets/app-a1b2c3.js): una misma URL sirve
  // siempre el mismo contenido, así que responder desde la caché sin preguntar
  // a la red es correcto y no puede quedar obsoleto.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.ok && networkResponse.type === 'basic') {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
      )
    );
    return;
  }

  // Resto de estáticos (imágenes de la raíz, /kits, /impacto, iconos...): la URL
  // es estable pero el archivo SÍ puede cambiar al publicar. Antes se respondía
  // desde la caché sin revalidar nunca, así que al reemplazar una foto los
  // visitantes recurrentes seguían viendo la anterior de forma indefinida.
  // Ahora se responde con la copia guardada al instante y se refresca en
  // segundo plano: el archivo nuevo aparece en la siguiente carga.
  const revalidacion = fetch(request).then((networkResponse) => {
    if (networkResponse && networkResponse.ok && networkResponse.type === 'basic') {
      const clone = networkResponse.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
    }
    return networkResponse;
  });

  // Mantiene vivo el service worker hasta terminar de refrescar la copia.
  event.waitUntil(revalidacion.catch(() => {}));

  event.respondWith(
    caches.match(request).then((cached) => cached || revalidacion)
  );
});
