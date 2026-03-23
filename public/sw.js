const CACHE_NAME = 'tagweed-quran-v1';
const API_BASE = 'https://api.alquran.cloud/v1';

// عند التثبيت
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// اعتراض كل طلب
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // كاش فقط طلبات alquran.cloud
  if (!url.includes('alquran.cloud')) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // جرب الكاش أولاً
      const cached = await cache.match(event.request);
      if (cached) return cached;

      // مو في الكاش — اجلبه من الشبكة واحفظه
      try {
        const response = await fetch(event.request);
        if (response.ok) {
          cache.put(event.request, response.clone());
        }
        return response;
      } catch {
        return new Response(JSON.stringify({ error: 'offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    })
  );
});

// استقبال أمر التحميل المسبق من الصفحة
self.addEventListener('message', async (event) => {
  if (event.data?.type !== 'DOWNLOAD_QURAN') return;

  const port = event.ports[0];
  const cache = await caches.open(CACHE_NAME);
  const TOTAL = 604;
  const BATCH = 5;
  let loaded = 0;

  try {
    // 1. السور
    await fetch(`${API_BASE}/surah`).then(async (r) => {
      if (r.ok) await cache.put(`${API_BASE}/surah`, r);
    }).catch(() => {});

    // 2. كل الصفحات
    for (let start = 1; start <= TOTAL; start += BATCH) {
      const batch = [];
      for (let i = 0; i < BATCH && start + i <= TOTAL; i++) {
        batch.push(start + i);
      }

      await Promise.all(batch.map(async (page) => {
        const url = `${API_BASE}/page/${page}/quran-uthmani`;
        const cached = await cache.match(url);
        if (cached) { loaded++; return; }

        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            const res = await fetch(url);
            if (res.ok) {
              await cache.put(url, res);
              break;
            }
          } catch {
            await new Promise(r => setTimeout(r, 500));
          }
        }
        loaded++;
      }));

      port.postMessage({
        type: 'PROGRESS',
        loaded,
        total: TOTAL,
        percent: Math.round((loaded / TOTAL) * 100),
      });

      // استراحة قصيرة
      await new Promise(r => setTimeout(r, 80));
    }

    port.postMessage({ type: 'DONE' });
  } catch (err) {
    port.postMessage({ type: 'ERROR', message: String(err) });
  }
});
