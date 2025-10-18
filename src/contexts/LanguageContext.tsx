import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, { changeLanguage as changeI18nLanguage } from '@/i18n';

type Language = 'pt' | 'es';

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>('pt');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('@nexus_tech:language');
      if (savedLang && (savedLang === 'pt' || savedLang === 'es')) {
        setLanguage(savedLang as Language);
      }
    } catch (error) {
      console.error('Erro ao carregar idioma:', error);
    }
  };

  const changeLanguage = async (lang: Language) => {
    try {
      await changeI18nLanguage(lang);
      setLanguage(lang);
    } catch (error) {
      console.error('Erro ao alterar idioma:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
