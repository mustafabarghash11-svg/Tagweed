// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///home/project/node_modules/lovable-tagger/dist/index.js";
import { VitePWA } from "file:///home/project/node_modules/vite-plugin-pwa/dist/index.js";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false }
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
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            // كاش السور
            urlPattern: /^https:\/\/api\.alquran\.cloud\/v1\/surah.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "quran-surahs",
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            // كاش التفسير
            urlPattern: /^https:\/\/api\.alquran\.cloud\/v1\/ayah\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "quran-tafsir",
              expiration: { maxEntries: 7e3, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            // كاش الصوت
            urlPattern: /^https:\/\/cdn\.islamic\.network\/quran\/audio\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "quran-audio",
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      },
      manifest: {
        name: "\u062A\u062C\u0648\u064A\u062F \u2014 \u0627\u0644\u0642\u0631\u0622\u0646 \u0627\u0644\u0643\u0631\u064A\u0645",
        short_name: "\u062A\u062C\u0648\u064A\u062F",
        description: "\u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0642\u0631\u0622\u0646 \u0627\u0644\u0643\u0631\u064A\u0645",
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
          { src: "/favicon.ico", sizes: "512x512", type: "image/x-icon" }
        ]
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__vite_injected_original_dirname, "./src") },
    dedupe: ["react", "react-dom"]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiOjpcIixcbiAgICBwb3J0OiA4MDgwLFxuICAgIGhtcjogeyBvdmVybGF5OiBmYWxzZSB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBtb2RlID09PSBcImRldmVsb3BtZW50XCIgJiYgY29tcG9uZW50VGFnZ2VyKCksXG4gICAgVml0ZVBXQSh7XG4gICAgICByZWdpc3RlclR5cGU6IFwiYXV0b1VwZGF0ZVwiLFxuICAgICAgd29ya2JveDoge1xuICAgICAgICAvLyBcdTA2NDNcdTA2MjdcdTA2MzQgXHUwNjQzXHUwNjQ0IFx1MDY0NVx1MDY0NFx1MDY0MVx1MDYyN1x1MDYyQSBcdTA2MjdcdTA2NDRcdTA2MkFcdTA2MzdcdTA2MjhcdTA2NEFcdTA2NDJcbiAgICAgICAgZ2xvYlBhdHRlcm5zOiBbXCIqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Zyx3b2ZmMn1cIl0sXG4gICAgICAgIC8vIFx1MDY0M1x1MDYyN1x1MDYzNCBcdTA2MjdcdTA2NDRcdTA2NDAgQVBJXG4gICAgICAgIHJ1bnRpbWVDYWNoaW5nOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgLy8gXHUwNjQzXHUwNjI3XHUwNjM0IFx1MDYzNVx1MDY0MVx1MDYyRFx1MDYyN1x1MDYyQSBcdTA2MjdcdTA2NDRcdTA2NDJcdTA2MzFcdTA2MjJcdTA2NDZcbiAgICAgICAgICAgIHVybFBhdHRlcm46IC9eaHR0cHM6XFwvXFwvYXBpXFwuYWxxdXJhblxcLmNsb3VkXFwvdjFcXC9wYWdlXFwvLiovaSxcbiAgICAgICAgICAgIGhhbmRsZXI6IFwiQ2FjaGVGaXJzdFwiLFxuICAgICAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgICAgICBjYWNoZU5hbWU6IFwicXVyYW4tcGFnZXNcIixcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjogeyBtYXhFbnRyaWVzOiA2MjAsIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDM2NSB9LFxuICAgICAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZTogeyBzdGF0dXNlczogWzAsIDIwMF0gfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAvLyBcdTA2NDNcdTA2MjdcdTA2MzQgXHUwNjI3XHUwNjQ0XHUwNjMzXHUwNjQ4XHUwNjMxXG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcL2FwaVxcLmFscXVyYW5cXC5jbG91ZFxcL3YxXFwvc3VyYWguKi9pLFxuICAgICAgICAgICAgaGFuZGxlcjogXCJDYWNoZUZpcnN0XCIsXG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgIGNhY2hlTmFtZTogXCJxdXJhbi1zdXJhaHNcIixcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjogeyBtYXhFbnRyaWVzOiAxMjAsIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDM2NSB9LFxuICAgICAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZTogeyBzdGF0dXNlczogWzAsIDIwMF0gfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAvLyBcdTA2NDNcdTA2MjdcdTA2MzQgXHUwNjI3XHUwNjQ0XHUwNjJBXHUwNjQxXHUwNjMzXHUwNjRBXHUwNjMxXG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcL2FwaVxcLmFscXVyYW5cXC5jbG91ZFxcL3YxXFwvYXlhaFxcLy4qL2ksXG4gICAgICAgICAgICBoYW5kbGVyOiBcIkNhY2hlRmlyc3RcIixcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiBcInF1cmFuLXRhZnNpclwiLFxuICAgICAgICAgICAgICBleHBpcmF0aW9uOiB7IG1heEVudHJpZXM6IDcwMDAsIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDM2NSB9LFxuICAgICAgICAgICAgICBjYWNoZWFibGVSZXNwb25zZTogeyBzdGF0dXNlczogWzAsIDIwMF0gfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAvLyBcdTA2NDNcdTA2MjdcdTA2MzQgXHUwNjI3XHUwNjQ0XHUwNjM1XHUwNjQ4XHUwNjJBXG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcL2NkblxcLmlzbGFtaWNcXC5uZXR3b3JrXFwvcXVyYW5cXC9hdWRpb1xcLy4qL2ksXG4gICAgICAgICAgICBoYW5kbGVyOiBcIkNhY2hlRmlyc3RcIixcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiBcInF1cmFuLWF1ZGlvXCIsXG4gICAgICAgICAgICAgIGV4cGlyYXRpb246IHsgbWF4RW50cmllczogNTAwLCBtYXhBZ2VTZWNvbmRzOiA2MCAqIDYwICogMjQgKiAzNjUgfSxcbiAgICAgICAgICAgICAgY2FjaGVhYmxlUmVzcG9uc2U6IHsgc3RhdHVzZXM6IFswLCAyMDBdIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgbmFtZTogXCJcdTA2MkFcdTA2MkNcdTA2NDhcdTA2NEFcdTA2MkYgXHUyMDE0IFx1MDYyN1x1MDY0NFx1MDY0Mlx1MDYzMVx1MDYyMlx1MDY0NiBcdTA2MjdcdTA2NDRcdTA2NDNcdTA2MzFcdTA2NEFcdTA2NDVcIixcbiAgICAgICAgc2hvcnRfbmFtZTogXCJcdTA2MkFcdTA2MkNcdTA2NDhcdTA2NEFcdTA2MkZcIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwiXHUwNjJBXHUwNjM3XHUwNjI4XHUwNjRBXHUwNjQyIFx1MDYyN1x1MDY0NFx1MDY0Mlx1MDYzMVx1MDYyMlx1MDY0NiBcdTA2MjdcdTA2NDRcdTA2NDNcdTA2MzFcdTA2NEFcdTA2NDVcIixcbiAgICAgICAgdGhlbWVfY29sb3I6IFwiI2I4ODYwYlwiLFxuICAgICAgICBiYWNrZ3JvdW5kX2NvbG9yOiBcIiNmYWY2ZjBcIixcbiAgICAgICAgZGlzcGxheTogXCJzdGFuZGFsb25lXCIsXG4gICAgICAgIG9yaWVudGF0aW9uOiBcInBvcnRyYWl0XCIsXG4gICAgICAgIGxhbmc6IFwiYXJcIixcbiAgICAgICAgZGlyOiBcInJ0bFwiLFxuICAgICAgICBzdGFydF91cmw6IFwiL1wiLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHsgc3JjOiBcIi9mYXZpY29uLmljb1wiLCBzaXplczogXCI2NHg2NFwiLCB0eXBlOiBcImltYWdlL3gtaWNvblwiIH0sXG4gICAgICAgICAgeyBzcmM6IFwiL2Zhdmljb24uaWNvXCIsIHNpemVzOiBcIjE5MngxOTJcIiwgdHlwZTogXCJpbWFnZS94LWljb25cIiB9LFxuICAgICAgICAgIHsgc3JjOiBcIi9mYXZpY29uLmljb1wiLCBzaXplczogXCI1MTJ4NTEyXCIsIHR5cGU6IFwiaW1hZ2UveC1pY29uXCIgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSksXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHsgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIikgfSxcbiAgICBkZWR1cGU6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCJdLFxuICB9LFxufSkpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBQ2hDLFNBQVMsZUFBZTtBQUp4QixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLEtBQUssRUFBRSxTQUFTLE1BQU07QUFBQSxFQUN4QjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sU0FBUyxpQkFBaUIsZ0JBQWdCO0FBQUEsSUFDMUMsUUFBUTtBQUFBLE1BQ04sY0FBYztBQUFBLE1BQ2QsU0FBUztBQUFBO0FBQUEsUUFFUCxjQUFjLENBQUMsc0NBQXNDO0FBQUE7QUFBQSxRQUVyRCxnQkFBZ0I7QUFBQSxVQUNkO0FBQUE7QUFBQSxZQUVFLFlBQVk7QUFBQSxZQUNaLFNBQVM7QUFBQSxZQUNULFNBQVM7QUFBQSxjQUNQLFdBQVc7QUFBQSxjQUNYLFlBQVksRUFBRSxZQUFZLEtBQUssZUFBZSxLQUFLLEtBQUssS0FBSyxJQUFJO0FBQUEsY0FDakUsbUJBQW1CLEVBQUUsVUFBVSxDQUFDLEdBQUcsR0FBRyxFQUFFO0FBQUEsWUFDMUM7QUFBQSxVQUNGO0FBQUEsVUFDQTtBQUFBO0FBQUEsWUFFRSxZQUFZO0FBQUEsWUFDWixTQUFTO0FBQUEsWUFDVCxTQUFTO0FBQUEsY0FDUCxXQUFXO0FBQUEsY0FDWCxZQUFZLEVBQUUsWUFBWSxLQUFLLGVBQWUsS0FBSyxLQUFLLEtBQUssSUFBSTtBQUFBLGNBQ2pFLG1CQUFtQixFQUFFLFVBQVUsQ0FBQyxHQUFHLEdBQUcsRUFBRTtBQUFBLFlBQzFDO0FBQUEsVUFDRjtBQUFBLFVBQ0E7QUFBQTtBQUFBLFlBRUUsWUFBWTtBQUFBLFlBQ1osU0FBUztBQUFBLFlBQ1QsU0FBUztBQUFBLGNBQ1AsV0FBVztBQUFBLGNBQ1gsWUFBWSxFQUFFLFlBQVksS0FBTSxlQUFlLEtBQUssS0FBSyxLQUFLLElBQUk7QUFBQSxjQUNsRSxtQkFBbUIsRUFBRSxVQUFVLENBQUMsR0FBRyxHQUFHLEVBQUU7QUFBQSxZQUMxQztBQUFBLFVBQ0Y7QUFBQSxVQUNBO0FBQUE7QUFBQSxZQUVFLFlBQVk7QUFBQSxZQUNaLFNBQVM7QUFBQSxZQUNULFNBQVM7QUFBQSxjQUNQLFdBQVc7QUFBQSxjQUNYLFlBQVksRUFBRSxZQUFZLEtBQUssZUFBZSxLQUFLLEtBQUssS0FBSyxJQUFJO0FBQUEsY0FDakUsbUJBQW1CLEVBQUUsVUFBVSxDQUFDLEdBQUcsR0FBRyxFQUFFO0FBQUEsWUFDMUM7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxNQUNBLFVBQVU7QUFBQSxRQUNSLE1BQU07QUFBQSxRQUNOLFlBQVk7QUFBQSxRQUNaLGFBQWE7QUFBQSxRQUNiLGFBQWE7QUFBQSxRQUNiLGtCQUFrQjtBQUFBLFFBQ2xCLFNBQVM7QUFBQSxRQUNULGFBQWE7QUFBQSxRQUNiLE1BQU07QUFBQSxRQUNOLEtBQUs7QUFBQSxRQUNMLFdBQVc7QUFBQSxRQUNYLE9BQU87QUFBQSxVQUNMLEVBQUUsS0FBSyxnQkFBZ0IsT0FBTyxTQUFTLE1BQU0sZUFBZTtBQUFBLFVBQzVELEVBQUUsS0FBSyxnQkFBZ0IsT0FBTyxXQUFXLE1BQU0sZUFBZTtBQUFBLFVBQzlELEVBQUUsS0FBSyxnQkFBZ0IsT0FBTyxXQUFXLE1BQU0sZUFBZTtBQUFBLFFBQ2hFO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0gsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDUCxPQUFPLEVBQUUsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTyxFQUFFO0FBQUEsSUFDL0MsUUFBUSxDQUFDLFNBQVMsV0FBVztBQUFBLEVBQy9CO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
