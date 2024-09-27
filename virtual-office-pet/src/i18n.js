import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import the translation files
import translationEN from './locales/en/translation.json';
import translationFR from './locales/fr/translation.json';
import translationES from './locales/es/translation.json';

// Set up the i18n instance
i18n
  .use(initReactI18next) // Passes i18n to React components
  .init({
    resources: {
      en: { translation: translationEN },
      fr: { translation: translationFR },
      es: { translation: translationES },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
