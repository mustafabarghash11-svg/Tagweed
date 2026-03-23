import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

export interface ColorTheme {
  id: string;
  name: string;
  primary: string;       // HSL للوضع الفاتح
  primaryDark: string;   // HSL للوضع الداكن
  bg: string;
  bgDark: string;
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'gold',
    name: 'ذهبي',
    primary: '38 65% 50%',
    primaryDark: '38 65% 55%',
    bg: '40 33% 96%',
    bgDark: '220 25% 10%',
  },
  {
    id: 'emerald',
    name: 'زمردي',
    primary: '152 60% 35%',
    primaryDark: '152 55% 45%',
    bg: '150 20% 96%',
    bgDark: '160 25% 9%',
  },
  {
    id: 'ocean',
    name: 'أزرق',
    primary: '210 75% 45%',
    primaryDark: '210 70% 55%',
    bg: '210 30% 97%',
    bgDark: '215 30% 10%',
  },
  {
    id: 'rose',
    name: 'وردي',
    primary: '345 65% 48%',
    primaryDark: '345 60% 58%',
    bg: '345 25% 97%',
    bgDark: '340 25% 10%',
  },
  {
    id: 'purple',
    name: 'بنفسجي',
    primary: '265 60% 52%',
    primaryDark: '265 55% 62%',
    bg: '265 20% 97%',
    bgDark: '265 25% 10%',
  },
  {
    id: 'slate',
    name: 'رمادي',
    primary: '215 25% 40%',
    primaryDark: '215 20% 60%',
    bg: '215 20% 97%',
    bgDark: '215 20% 10%',
  },
];

export interface ReciterInfo {
  id: string;
  name: string;
  apiId: string; // identifier في alquran.cloud
}

export const RECITERS: ReciterInfo[] = [
  { id: 'alafasy',    name: 'مشاري العفاسي',       apiId: 'ar.alafasy' },
  { id: 'minshawi',   name: 'المنشاوي',             apiId: 'ar.minshawi' },
  { id: 'abdulsamad', name: 'عبد الباسط عبد الصمد', apiId: 'ar.abdulbasitmurattal' },
  { id: 'ghamdi',     name: 'سعد الغامدي',          apiId: 'ar.saadalghamdi' },
  { id: 'maher',      name: 'ماهر المعيقلي',        apiId: 'ar.mahermuaiqly' },
];

interface SettingsContextType {
  theme: Theme;
  toggleTheme: () => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  reciter: ReciterInfo;
  setReciter: (r: ReciterInfo) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

function applyColorTheme(ct: ColorTheme, isDark: boolean) {
  const root = document.documentElement;
  root.style.setProperty('--primary', isDark ? ct.primaryDark : ct.primary);
  root.style.setProperty('--ring', isDark ? ct.primaryDark : ct.primary);
  root.style.setProperty('--background', isDark ? ct.bgDark : ct.bg);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('tagweed-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [fontSize, setFontSizeState] = useState<number>(() => {
    const saved = localStorage.getItem('tagweed-font-size');
    return saved ? parseInt(saved) : 26;
  });

  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    const saved = localStorage.getItem('tagweed-color-theme');
    return COLOR_THEMES.find((c) => c.id === saved) ?? COLOR_THEMES[0];
  });

  const [reciter, setReciterState] = useState<ReciterInfo>(() => {
    const saved = localStorage.getItem('tagweed-reciter');
    return RECITERS.find((r) => r.id === saved) ?? RECITERS[0];
  });

  // تطبيق الثيم عند البداية وعند التغيير
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('tagweed-theme', theme);
    applyColorTheme(colorTheme, theme === 'dark');
  }, [theme, colorTheme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const setFontSize = (size: number) => {
    const clamped = Math.min(40, Math.max(18, size));
    setFontSizeState(clamped);
    localStorage.setItem('tagweed-font-size', String(clamped));
  };

  const setColorTheme = (ct: ColorTheme) => {
    setColorThemeState(ct);
    localStorage.setItem('tagweed-color-theme', ct.id);
    applyColorTheme(ct, theme === 'dark');
  };

  const setReciter = (r: ReciterInfo) => {
    setReciterState(r);
    localStorage.setItem('tagweed-reciter', r.id);
  };

  return (
    <SettingsContext.Provider value={{
      theme, toggleTheme,
      fontSize, setFontSize,
      colorTheme, setColorTheme,
      reciter, setReciter,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
