// `code` = code langue ISO 639-1 (utilisé par i18next/setLocale).
// `flagCode` = code pays ISO 3166-1 (attendu par country-flag-icons) — distinct de `code`,
// car une langue n'est pas un pays ("en" n'a pas de drapeau, "GB" en a un).
export const supportedLanguages = [
  { code: "fr", name: "Français", flagCode: "FR" },
  { code: "en", name: "English", flagCode: "GB" },
  { code: "it", name: "Italiano", flagCode: "IT" },
  // { code: "es", name: "Español", flagCode: "ES" },
  // { code: "de", name: "Deutsch", flagCode: "DE" },
  // { code: "it", name: "Italiano", flagCode: "IT" },
  // { code: "pt", name: "Português", flagCode: "PT" },
  // { code: "ru", name: "Русский", flagCode: "RU" },
  // { code: "zh", name: "中文", flagCode: "CN" },
  // { code: "ja", name: "日本語", flagCode: "JP" },
  // { code: "ko", name: "한국어", flagCode: "KR" },
];