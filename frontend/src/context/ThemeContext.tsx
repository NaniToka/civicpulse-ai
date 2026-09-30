import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'midnight' | 'forest' | 'sunset';

export interface ThemeOption {
  id: Theme;
  label: string;
  emoji: string;
  description: string;
  preview: { bg: string; accent: string; surface: string };
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'light',
    label: 'Light',
    emoji: '☀️',
    description: 'Clean & crisp white',
    preview: { bg: '#F8FAFC', accent: '#6366f1', surface: '#ffffff' },
  },
  {
    id: 'dark',
    label: 'Dark',
    emoji: '🌙',
    description: 'Easy on the eyes',
    preview: { bg: '#0f1117', accent: '#818cf8', surface: '#1e2130' },
  },
  {
    id: 'midnight',
    label: 'Midnight',
    emoji: '🌌',
    description: 'Deep space blue',
    preview: { bg: '#030712', accent: '#38bdf8', surface: '#0d1b2a' },
  },
  {
    id: 'forest',
    label: 'Forest',
    emoji: '🌿',
    description: 'Natural green calm',
    preview: { bg: '#0d1f14', accent: '#4ade80', surface: '#132a1c' },
  },
  {
    id: 'sunset',
    label: 'Sunset',
    emoji: '🌅',
    description: 'Warm amber glow',
    preview: { bg: '#1a0e05', accent: '#fb923c', surface: '#271407' },
  },
];

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  themeOption: ThemeOption;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => {},
  themeOption: THEME_OPTIONS[0],
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('civicpulse_theme') as Theme;
      if (saved && THEME_OPTIONS.find((t) => t.id === saved)) return saved;
    } catch {
      // ignore
    }
    return 'light';
  });

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    try {
      localStorage.setItem('civicpulse_theme', t);
    } catch {
      // ignore
    }
  }, []);

  // Apply theme class to <html> so CSS variables take effect globally
  useEffect(() => {
    const root = document.documentElement;
    THEME_OPTIONS.forEach((opt) => root.classList.remove(`theme-${opt.id}`));
    root.classList.add(`theme-${theme}`);
    root.setAttribute('data-theme', theme);
  }, [theme]);

  const themeOption = THEME_OPTIONS.find((o) => o.id === theme) ?? THEME_OPTIONS[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeOption }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
