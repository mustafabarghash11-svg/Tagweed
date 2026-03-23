import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        // كاش كل ملفات التطبيق
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        // كاش الـ API
        runtimeCaching: [
          {
            // كاش صفحات القرآن
            urlPattern: /^https:\/\/api\.alquran\.cloud\/v1\/page\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "quran-pages",
              expiration: { maxEntries: 620, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // كاش السور
            urlPattern: /^https:\/\/api\.alquran\.cloud\/v1\/surah.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "quran-surahs",
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // كاش التفسير
            urlPattern: /^https:\/\/api\.alquran\.cloud\/v1\/ayah\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "quran-tafsir",
              expiration: { maxEntries: 7000, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // كاش الصوت
            urlPattern: /^https:\/\/cdn\.islamic\.network\/quran\/audio\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "quran-audio",
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        name: "تجويد — القرآن الكريم",
        short_name: "تجويد",
        description: "تطبيق القرآن الكريم",
        theme_color: "#b8860b",
        background_color: "#faf6f0",
        display: "standalone",
        orientation: "portrait",
        lang: "ar",
        dir: "rtl",
        start_url: "/",
        icons: [
          { src: "/favicon.ico", sizes: "64x64", type: "image/x-icon" },
          { src: "/favicon.ico", sizes: "192x192", type: "image/x-icon" },
          { src: "/favicon.ico", sizes: "512x512", type: "image/x-icon" },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: ["react", "react-dom"],
  },
}));
