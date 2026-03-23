import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/context/SettingsContext.tsx";
import { BookmarksProvider } from "@/context/BookmarksContext.tsx";
import { AudioProvider } from "@/context/AudioContext.tsx";
import { BottomNav } from "@/components/BottomNav.tsx";

import Index from "./pages/Index.tsx";
import QuranReader from "./pages/QuranReader.tsx";
import SurahBrowser from "./pages/SurahBrowser.tsx";
import JuzBrowser from "./pages/JuzBrowser.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import BookmarksPage from "./pages/BookmarksPage.tsx";
import MemorizePage from "./pages/MemorizePage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <BookmarksProvider>
        <AudioProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <BottomNav />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/page/:pageNumber" element={<QuranReader />} />
                <Route path="/surah" element={<SurahBrowser />} />
                <Route path="/juz" element={<JuzBrowser />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/bookmarks" element={<BookmarksPage />} />
                <Route path="/memorize" element={<MemorizePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AudioProvider>
      </BookmarksProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
