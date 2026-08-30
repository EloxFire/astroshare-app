import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/fr";
import "dayjs/locale/en";
import "dayjs/locale/it";

// Active dayjs.utc(...) (switch UTC/heure locale) et dayjs.tz(...) (fuseau horaire choisi
// explicitement par l'utilisateur) dans toute l'app — voir useAppUnits. `timezone` a besoin
// que `utc` soit étendu avant lui (contrainte de dayjs). Fait ici une seule fois, au même
// endroit que le reste de la config globale de dayjs.
dayjs.extend(utc);
dayjs.extend(timezone);
import { useUserDataStore } from "../store/userData.store";
import { supportedLanguages } from "../helpers/langs";
import common_fr from "./locales/fr/common.json";
import tools_fr from "./locales/fr/tools.json";
import moon_fr from "./locales/fr/moon.json";
import settings_fr from "./locales/fr/settings.json";
import common_en from "./locales/en/common.json";
import tools_en from "./locales/en/tools.json";
import moon_en from "./locales/en/moon.json";
import settings_en from "./locales/en/settings.json";
import common_it from "./locales/it/common.json";
import tools_it from "./locales/it/tools.json";
import moon_it from "./locales/it/moon.json";
import settings_it from "./locales/it/settings.json";

export const SUPPORTED_LANGUAGES = supportedLanguages.map((lang) => lang.code);
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const isSupportedLanguage = (language: string | null | undefined): language is SupportedLanguage =>
  (SUPPORTED_LANGUAGES as readonly string[]).includes(language ?? "");

const detectDeviceLanguage = (): SupportedLanguage => {
  const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? null;
  return isSupportedLanguage(deviceLanguage) ? deviceLanguage : "fr";
};

// `persistedLocale` vient de UserSettingsData.locale : `null` = pas de choix explicite,
// on suit la langue de l'appareil ; sinon c'est un choix explicite (fait via le sélecteur
// de langue) qui prime toujours sur la détection.
export const resolveLanguage = (persistedLocale: string | null): SupportedLanguage =>
  isSupportedLanguage(persistedLocale) ? persistedLocale : detectDeviceLanguage();

i18next.use(initReactI18next).init({
  // Au chargement du module, le store n'a presque jamais fini de se réhydrater depuis
  // AsyncStorage (opération async) : cette valeur n'est donc qu'un premier choix, resynchronisé
  // juste après par `syncLanguageWithStore` une fois la réhydratation terminée (cf. plus bas).
  lng: resolveLanguage(useUserDataStore.getState().locale),
  fallbackLng: supportedLanguages[0].code, //fr par défaut si la langue détectée n'est pas supportée
  supportedLngs: SUPPORTED_LANGUAGES,
  ns: ["common", "tools", "moon", "settings"],
  defaultNS: "common",
  resources: {
    fr: { common: common_fr, tools: tools_fr, moon: moon_fr, settings: settings_fr },
    en: { common: common_en, tools: tools_en, moon: moon_en, settings: settings_en },
    it: { common: common_it, tools: tools_it, moon: moon_it, settings: settings_it },
  },
  interpolation: { escapeValue: false },
});

// dayjs a sa propre notion de locale, indépendante d'i18next — on la branche une bonne
// fois pour toutes sur l'event `languageChanged`, pour ne jamais avoir à s'en souvenir à
// chaque site d'appel (sélecteur de langue futur, resync post-hydratation, etc.).
dayjs.locale(i18next.language);
i18next.on("languageChanged", (language) => {
  dayjs.locale(language);
});

// Relit `locale` depuis le store et resynchronise i18next si besoin — à appeler une fois
// la réhydratation Zustand/AsyncStorage terminée (voir useI18nReady).
export const syncLanguageWithStore = async (): Promise<void> => {
  const language = resolveLanguage(useUserDataStore.getState().locale);
  if (i18next.language !== language) {
    await i18next.changeLanguage(language);
  }
};

// `syncLanguageWithStore` ne couvre que le démarrage (post-hydratation). Sans cet abonnement,
// un setLocale() fait plus tard (ex: depuis le sélecteur de langue) mettrait à jour le store
// sans jamais notifier i18next — la langue affichée ne changerait pas. Un seul point de
// synchronisation ici, pour ne pas avoir à appeler i18next.changeLanguage() à chaque site
// qui appelle setLocale.
useUserDataStore.subscribe((state, previousState) => {
  if (state.locale === previousState.locale) return;
  const language = resolveLanguage(state.locale);
  if (i18next.language !== language) {
    i18next.changeLanguage(language);
  }
});

export default i18next;
