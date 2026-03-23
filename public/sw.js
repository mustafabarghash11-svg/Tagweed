const QURAN_CACHE = 'tagweed-quran-v2';
const APP_CACHE = 'tagweed-app-v2';
const API_BASE = 'https://api.alquran.cloud/v1';

self.addEventListener('install', (event) => {
  // تثبيت فوري بدون انتظار
  event.waitUntil(
    caches.open(APP_CACHE)
      .then((cache) => cache.addAll(['/', '/index.html']))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // احذف كل الكاش القديم
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== QURAN_CACHE && k !== APP_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  const { hostname } = new URL(url);

  // طلبات alquran.cloud — CacheFirst
  if (hostname.includes('alquran.cloud')) {
    event.respondWith(
      caches.open(QURAN_CACHE).then(async (cache) => {
        const cached = await cache.match(url);
        if (cached) return cached;
        try {
          const res = await fetch(event.request.clone());
          if (res && res.status === 200) cache.put(url, res.clone());
          return res;
        } catch {
          return new Response('{"error":"offline"}', {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      })
    );
    return;
  }

  // ملفات الموقع — NetworkFirst عشان يجيب التحديثات دائماً
  if (url.startsWith(self.location.origin)) {
    event.respondWith(
      fetch(event.request.clone())
        .then(async (res) => {
          // حفظ النسخة الجديدة في الكاش
          if (res && res.status === 200 && event.request.method === 'GET') {
            const cache = await caches.open(APP_CACHE);
            cache.put(url, res.clone());
          }
          return res;
        })
        .catch(async () => {
          // لو ما في نت — جيب من الكاش
          const cached = await caches.match(url);
          if (cached) return cached;
          if (event.request.mode === 'navigate') {
            const index = await caches.match('/index.html');
            if (index) return index;
          }
          return new Response('Offline', { status: 503 });
        })
    );
    return;
  }
});

// تحميل القرآن كاملاً
self.addEventListener('message', async (event) => {
  if (event.data?.type !== 'DOWNLOAD_QURAN') return;

  const port = event.ports[0];
  let cache;

  try {
    cache = await caches.open(QURAN_CACHE);
  } catch (err) {
    port.postMessage({ type: 'ERROR', message: 'فشل فتح الكاش: ' + err });
    return;
  }

  const TOTAL = 604;
  const BATCH = 3;
  let loaded = 0;

  try {
    try {
      const surahRes = await fetch(`${API_BASE}/surah`);
      if (surahRes.ok) await cache.put(`${API_BASE}/surah`, surahRes);
    } catch {}

    for (let start = 1; start <= TOTAL; start += BATCH) {
      const pages = [];
      for (let i = 0; i < BATCH && (start + i) <= TOTAL; i++) {
        pages.push(start + i);
      }

      for (const page of pages) {
        const url = `${API_BASE}/page/${page}/quran-uthmani`;
        try {
          const existing = await cache.match(url);
          if (existing) { loaded++; continue; }
        } catch {}

        let success = false;
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const res = await fetch(url);
            if (res.ok) {
              await cache.put(url, res);
              success = true;
              break;
            }
          } catch {
            await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
          }
        }
        loaded++;
      }

      port.postMessage({
        type: 'PROGRESS',
        loaded,
        total: TOTAL,
        percent: Math.round((loaded / TOTAL) * 100),
      });

      await new Promise(r => setTimeout(r, 150));
    }

    port.postMessage({ type: 'DONE' });
  } catch (err) {
    port.postMessage({ type: 'ERROR', message: String(err) });
  }
});
