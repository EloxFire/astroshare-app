import { I18n } from 'i18n-js';
import { frTranslations } from '../../../translation/fr';
import { enTranslations } from '../../../translation/en';
import { getData } from '../../storage';

const DEFAULT_LOCALE = 'fr';
const SUPPORTED_LOCALES = ['fr', 'en'];

// Set the key-value pairs for the different languages you want to support.
export const i18n = new I18n({
  fr: frTranslations,
  en: enTranslations,
});

i18n.enableFallback = true;
i18n.defaultLocale = DEFAULT_LOCALE;
i18n.locale = DEFAULT_LOCALE;

const normalizeLocale = (locale: string | null | undefined) => {
  if (!locale) return DEFAULT_LOCALE;
  if (locale === 'gb') return 'en';
  return SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
};

export const getUserLocale = async () => {
  const userLocale = await getData('locale');
  i18n.locale = normalizeLocale(userLocale);
  console.log('Locale', i18n.locale);

  return i18n.locale;
};

void getUserLocale();

