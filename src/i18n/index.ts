import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Importar traduções
import pt from './locales/pt.json';
import es from './locales/es.json';

// Recursos de tradução
const resources = {
  pt: { translation: pt },
  es: { translation: es },
};

// Configurar i18n
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.locale.split('-')[0], // Detecta idioma do dispositivo (pt, es, etc)
    fallbackLng: 'pt', // Idioma padrão
    interpolation: {
      escapeValue: false, // React já faz escape
    },
    compatibilityJSON: 'v3', // Para compatibilidade
  });

export default i18n;
