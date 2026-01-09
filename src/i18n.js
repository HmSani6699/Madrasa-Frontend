import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import en from './locales/en/translation.json';
import bn from './locales/bn/translation.json';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      bn: { translation: bn }
    },
    lng: 'bn', // Set default language to Bengali
    fallbackLng: 'bn',
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
        order: ['queryString', 'cookie', 'localStorage', 'navigator'],
        caches: ['localStorage', 'cookie'],
    }
  });

export default i18n;
