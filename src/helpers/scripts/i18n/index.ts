import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import { frTranslations } from '../../../translation/fr';
import { enTranslations } from '../../../translation/en';

// Set the key-value pairs for the different languages you want to support.
export const i18n = new I18n({
  fr: frTranslations,
  gb: enTranslations,
});

i18n.enableFallback = true;

// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0].languageCode || 'fr';