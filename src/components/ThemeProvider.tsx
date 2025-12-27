"use client";
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { themeAtom, Theme } from '../atoms/themeAtom';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useAtom(themeAtom);

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme === 'dark') {
      setTheme('dark');
    }
  }, [setTheme]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  return <>{children}</>;
}
