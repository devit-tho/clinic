import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { z } from "zod";

// Languages
import translationEn from "./languages/en.json";
import translationKh from "./languages/kh.json";

export function initLocales(lang = "en") {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      lng: lang,
      fallbackLng: "en",
      resources: {
        en: { translation: translationEn },
        km: { translation: translationKh },
      },
      interpolation: {
        escapeValue: false,
      },
    });

  z.config({
    customError: (issue) => {
      const key = `zod.${issue.code}`;
      const translated = i18n.t(key, {
        ...issue,
        path: issue.path?.join("."),
      });

      return translated !== key ? translated : undefined;
    },
  });
}
