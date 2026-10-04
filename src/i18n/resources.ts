import common_fr from "./locales/fr/common.json";
import tools_fr from "./locales/fr/tools.json";
import moon_fr from "./locales/fr/moon.json";
import settings_fr from "./locales/fr/settings.json";
import settingsAddObservatory_fr from "./locales/fr/settings/addObservatory.json";
import settingsObservatoryDetails_fr from "./locales/fr/settings/observatoryDetails.json";
import suggestionsCards_fr from "./locales/fr/suggestionsCards.json";
import authLogin_fr from "./locales/fr/auth/login.json";
import authRegister_fr from "./locales/fr/auth/register.json";
import authForgotPassword_fr from "./locales/fr/auth/forgotPassword.json";
import authProfile_fr from "./locales/fr/auth/profile.json";
import common_en from "./locales/en/common.json";
import tools_en from "./locales/en/tools.json";
import moon_en from "./locales/en/moon.json";
import settings_en from "./locales/en/settings.json";
import settingsAddObservatory_en from "./locales/en/settings/addObservatory.json";
import settingsObservatoryDetails_en from "./locales/en/settings/observatoryDetails.json";
import authLogin_en from "./locales/en/auth/login.json";
import authRegister_en from "./locales/en/auth/register.json";
import authForgotPassword_en from "./locales/en/auth/forgotPassword.json";
import authProfile_en from "./locales/en/auth/profile.json";
import common_it from "./locales/it/common.json";
import tools_it from "./locales/it/tools.json";
import moon_it from "./locales/it/moon.json";
import settings_it from "./locales/it/settings.json";
import settingsAddObservatory_it from "./locales/it/settings/addObservatory.json";
import settingsObservatoryDetails_it from "./locales/it/settings/observatoryDetails.json";
import authLogin_it from "./locales/it/auth/login.json";
import authRegister_it from "./locales/it/auth/register.json";
import authForgotPassword_it from "./locales/it/auth/forgotPassword.json";
import authProfile_it from "./locales/it/auth/profile.json";

// Source unique des traductions, partagée par l'init i18next (index.ts) et le calcul de
// complétude (translationCompleteness.ts) : un namespace ajouté ici est pris en compte partout.
//
// Convention : le nom d'un namespace est le chemin de son fichier depuis locales/<langue>/, sans
// l'extension. Un fichier rangé dans un sous-dossier est donc un namespace à part entière, qu'on
// appelle directement : useTranslation("settings/addObservatory") ↔ locales/<langue>/settings/addObservatory.json.
export const resources = {
  fr: {
    common: common_fr,
    tools: tools_fr,
    moon: moon_fr,
    settings: settings_fr,
    "settings/addObservatory": settingsAddObservatory_fr,
    "settings/observatoryDetails": settingsObservatoryDetails_fr,
    suggestionsCards: suggestionsCards_fr,
    "auth/login": authLogin_fr,
    "auth/register": authRegister_fr,
    "auth/forgotPassword": authForgotPassword_fr,
    "auth/profile": authProfile_fr,
  },
  en: {
    common: common_en,
    tools: tools_en,
    moon: moon_en,
    settings: settings_en,
    "settings/addObservatory": settingsAddObservatory_en,
    "settings/observatoryDetails": settingsObservatoryDetails_en,
    "auth/login": authLogin_en,
    "auth/register": authRegister_en,
    "auth/forgotPassword": authForgotPassword_en,
    "auth/profile": authProfile_en,
  },
  it: {
    common: common_it,
    tools: tools_it,
    moon: moon_it,
    settings: settings_it,
    "settings/addObservatory": settingsAddObservatory_it,
    "settings/observatoryDetails": settingsObservatoryDetails_it,
    "auth/login": authLogin_it,
    "auth/register": authRegister_it,
    "auth/forgotPassword": authForgotPassword_it,
    "auth/profile": authProfile_it,
  },
};

// Le français est la langue de référence : c'est lui qui déclare l'ensemble des namespaces.
export const namespaces = Object.keys(resources.fr);
