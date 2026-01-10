import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './locales/en.json';
import hi from './locales/hi.json';

// Get stored language or default to English
const getStoredLanguage = (): string => {
    try {
        const stored = localStorage.getItem('ekitsa_language');
        return stored ? JSON.parse(stored) : 'en';
    } catch {
        return 'en';
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            hi: { translation: hi },
            bn: { translation: en }, // Fallback to English for now
            te: { translation: en }, // Fallback to English for now
            mr: { translation: en }, // Fallback to English for now
            ta: { translation: en }, // Fallback to English for now
        },
        lng: getStoredLanguage(),
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already handles XSS
        },
    });

export default i18n;
