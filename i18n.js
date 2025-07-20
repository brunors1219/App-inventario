import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// Importa arquivos JSON de tradução
import en from './locales/en.json';
import pt from './locales/pt.json';
import es from './locales/es.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: Localization.locale.split('-')[0], // pega idioma do dispositivo, ex: "pt"
    fallbackLng: 'en', // idioma padrão caso o atual não exista
    resources: {
      en: { translation: en },
      pt: { translation: pt },
      es: { translation: es },
    },
    interpolation: {
      escapeValue: false // React já escapa por padrão
    }
  });

export default i18n;
