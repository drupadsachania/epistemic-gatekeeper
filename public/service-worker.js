/**
 * Service Worker for Kairos ECL
 * Provides offline support and intelligent caching
 *
 * Cache Strategy:
 * - HTML: Network-first (fallback to cache)
 * - JS/CSS: Cache-first (fallback to network)
 * - Images: Cache-first (with expiration)
 * - API: Network-first with cache fallback
 */

const CACHE_PREFIX = 'kairos-ecl-v';
const CACHE_VERSION = '1.0.0';
const RUNTIME_CACHE = `${CACHE_PREFIX}${CACHE_VERSION}`;
const STATIC_ASSETS = `${CACHE_PREFIX}static-${CACHE_VERSION}`;
const API_CACHE = `${CACHE_PREFIX}api-${CACHE_VERSION}`;

// List of files to cache on install
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/kairos-logo.png',
];

// Cache duration (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

/**
 * Install Event - Cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker v' + CACHE_VERSION);

  event.waitUntil(
    caches.open(STATIC_ASSETS).then((cache) => {
      console.log('[SW] Caching static assets');
      // addAll fails entirely if any file 404s — cache individually instead
      return Promise.allSettled(
        STATIC_FILES.map((url) =>
          cache.add(url).catch((err) =>
            console.warn('[SW] Failed to cache:', url, err)
          )
        )
      );
    })
  );

  self.skipWaiting();
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName.startsWith(CACHE_PREFIX) &&
            cacheName !== STATIC_ASSETS &&
            cacheName !== RUNTIME_CACHE &&
            cacheName !== API_CACHE
          ) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  self.clients.claim();
});

/**
 * Fetch Event - Intelligent caching based on request type
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests - Network first with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  // HTML documents - Network first
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstStrategy(request, RUNTIME_CACHE));
    return;
  }

  // Assets (JS, CSS, images) - Cache first
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image'
  ) {
    event.respondWith(cacheFirstStrategy(request, STATIC_ASSETS));
    return;
  }

  // Default - Network first
  event.respondWith(networkFirstStrategy(request, RUNTIME_CACHE));
});

/**
 * Network-first strategy
 * Try network first, fallback to cache
 */
function networkFirstStrategy(request, cacheName) {
  return fetch(request)
    .then((response) => {
      // Cache successful responses
      if (response.ok) {
        const cache = caches.open(cacheName);
        cache.then((c) => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => {
      // Fall back to cache on network error
      return caches.match(request).then((response) => {
        return (
          response ||
          new Response(
            JSON.stringify({ error: 'Offline - cached data not available' }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' },
            }
          )
        );
      });
    });
}

/**
 * Cache-first strategy
 * Use cache if available, fallback to network
 */
function cacheFirstStrategy(request, cacheName) {
  return caches.match(request).then((response) => {
    if (response) {
      return response;
    }

    return fetch(request)
      .then((response) => {
        if (response.ok) {
          const cache = caches.open(cacheName);
          cache.then((c) => c.put(request, response.clone()));
        }
        return response;
      })
      .catch(() => {
        // Return offline page or placeholder
        return new Response(
          JSON.stringify({ error: 'Offline - resource not cached' }),
          {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'application/json' },
          }
        );
      });
  });
}

/**
 * Message handler for cache control
 */
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }

  if (event.data.action === 'clearCache') {
    console.log('[SW] Clearing all caches');
    caches.keys().then((cacheNames) => {
      Promise.all(cacheNames.map((name) => caches.delete(name)));
    });
  }

  if (event.data.action === 'getCache') {
    caches.keys().then((cacheNames) => {
      event.ports[0].postMessage({ caches: cacheNames });
    });
  }
});
