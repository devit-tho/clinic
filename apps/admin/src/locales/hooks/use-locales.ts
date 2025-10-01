import { addToast } from "@heroui/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { defaultLanguage, Language, languages } from "../config-lang";

export function useLocales() {
  const { t, i18n } = useTranslation();

  const langStorage = localStorage.getItem("i18nextLng") as string;

  const currentLang = (languages.find((l) => l.key === langStorage) ||
    defaultLanguage) as Language;

  useEffect(() => {
    document.documentElement.lang = currentLang.key;
  }, [currentLang]);

  const onChangeLang = (lang: string) => {
    try {
      localStorage.setItem("i18nextLng", lang);
      i18n.changeLanguage(lang);
      addToast({
        description: "Successfully changed language",
        color: "success",
      });
    } catch (error) {
      console.error(error);
      addToast({
        description: "Failed to change language",
        color: "danger",
      });
    }
  };

  return { t, onChangeLang, currentLang, languages, defaultLanguage };
}
