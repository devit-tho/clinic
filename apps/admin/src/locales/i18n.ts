import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import translationEn from "./langs/en.json";
import translationKm from "./langs/km.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: translationEn },
      km: { translation: translationKm },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
