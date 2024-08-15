import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import { frTranslations } from '../../../translation/fr';
import { enTranslations } from '../../../translation/en';
import { getData } from '../../storage';

// Set the key-value pairs for the different languages you want to support.
export const i18n = new I18n({
  fr: frTranslations,
  gb: enTranslations,
});

i18n.enableFallback = true;

const getUserLocale = async () => {
  const userLocale = await getData('locale');
  userLocale ? i18n.locale = userLocale : i18n.locale = getLocales()[0].languageCode || 'fr';
};

getUserLocale()


