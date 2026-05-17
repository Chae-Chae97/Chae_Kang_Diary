'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '@/constants/globalMessages';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.ko;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>('ko');

  useEffect(() => {
    const savedLang = localStorage.getItem('diary_lang') as Language;
    if (savedLang && translations[savedLang]) {
      // Defer state update to avoid 'cascading renders' warning
      queueMicrotask(() => {
        setLangState(savedLang);
      });
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('diary_lang', newLang);
  };

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
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
