"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const readCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
  }

  const [language, setLanguageState] = useState<string>('en');

  useEffect(() => {
    const fromCookie = readCookie('lang')
    if (fromCookie === 'en' || fromCookie === 'fr') {
      setLanguageState(fromCookie)
    }
  }, [])

  const setLanguage = (lang: string) => {
    setLanguageState(lang)
    try {
      document.cookie = `lang=${lang}; path=/; max-age=${60 * 60 * 24 * 365}`
    } catch {}
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};