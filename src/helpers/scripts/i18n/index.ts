import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

// Set the key-value pairs for the different languages you want to support.
export const i18n = new I18n({
  en: { welcome: 'Hello' },
  ja: { welcome: 'こんにちは' },
});

// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0].languageCode || 'fr';