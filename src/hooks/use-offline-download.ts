import { useState, useCallback } from 'react';

export function useOfflineDownload() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [done, setDone] = useState(() =>
    localStorage.getItem('tagweed-offline-ready') === 'true'
  );
  const [error, setError] = useState<string | null>(null);
  const supported = 'serviceWorker' in navigator;

  const download = useCallback(async () => {
    if (downloading || done || !supported) return;

    setDownloading(true);
    setError(null);
    setProgress(0);
    setCurrentPage(0);

    try {
      // انتظر تسجيل SW
      let registration = await navigator.serviceWorker.getRegistration('/');

      // لو ما مسجل — سجّله
      if (!registration) {
        registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      }

      // انتظر حتى يكون active
      await new Promise<void>((resolve) => {
        const sw = registration!.active || registration!.installing || registration!.waiting;
        if (registration!.active) { resolve(); return; }
        const target = registration!.installing || registration!.waiting;
        if (!target) { resolve(); return; }
        target.addEventListener('statechange', function handler() {
          if ((this as ServiceWorker).state === 'activated') {
            target.removeEventListener('statechange', handler);
            resolve();
          }
        });
      });

      const sw = registration.active;
      if (!sw) throw new Error('Service Worker غير نشط');

      await new Promise<void>((resolve, reject) => {
        const channel = new MessageChannel();

        channel.port1.onmessage = (event) => {
          const { type, percent, loaded } = event.data;
          if (type === 'PROGRESS') {
            setProgress(percent ?? 0);
            setCurrentPage(loaded ?? 0);
          } else if (type === 'DONE') {
            localStorage.setItem('tagweed-offline-ready', 'true');
            setDone(true);
            setProgress(100);
            resolve();
          } else if (type === 'ERROR') {
            reject(new Error(event.data.message || 'خطأ غير معروف'));
          }
        };

        sw.postMessage({ type: 'DOWNLOAD_QURAN' }, [channel.port2]);
      });

    } catch (err: any) {
      console.error('Download error:', err);
      setError(err?.message || 'حدث خطأ في التحميل');
    } finally {
      setDownloading(false);
    }
  }, [downloading, done, supported]);

  const reset = () => {
    localStorage.removeItem('tagweed-offline-ready');
    setDone(false);
    setProgress(0);
    setCurrentPage(0);
    setError(null);
  };

  return { downloading, progress, currentPage, done, error, download, reset, supported };
}
