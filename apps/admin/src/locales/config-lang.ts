export interface Language {
  key: string;
  label: string;
  icon: string;
}

export const languages: Language[] = [
  {
    key: "en",
    label: "English",
    icon: "twemoji:flag-united-kingdom",
  },
  {
    key: "km",
    label: "Khmer",
    icon: "twemoji:flag-cambodia",
  },
];

export const defaultLanguage = languages[0];
