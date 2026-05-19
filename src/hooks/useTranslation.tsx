import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { getData, storeData } from '../helpers/storage';
import { languagesList } from '../helpers/scripts/i18n/languagesList';
import dayjs from 'dayjs';
import { i18n } from '../helpers/scripts/i18n';

const TranslationContext = createContext<any>({})

export const useTranslation = () => {
  return useContext(TranslationContext)
}

interface TranslationProviderProps {
  children: ReactNode
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const normalizeLocale = (locale: string) => {
    const normalizedLocale = locale === "gb" ? "en" : locale;
    return languagesList.some(lang => lang.twoLettersCode === normalizedLocale) ? normalizedLocale : "fr";
  };

  useEffect(() => {
    (async () => {
      const locale = await getData('locale');
      if (locale) {
        const normalizedLocale = normalizeLocale(locale);
        setCurrentLocale(normalizedLocale);
        i18n.locale = normalizedLocale;
        dayjs.locale(normalizedLocale);
        const lcid = languagesList.find(lang => lang.twoLettersCode === normalizedLocale)?.lcidString
        if (lcid) {
          setCurrentLCID(lcid)
        }
      } else {
        i18n.locale = 'fr';
      }
    })()
  }, [])

  const updateLocale = async (code: string) => {
    const normalizedLocale = normalizeLocale(code);
    setCurrentLocale(normalizedLocale);
    i18n.locale = normalizedLocale;
    await storeData('locale', normalizedLocale);
    dayjs.locale(normalizedLocale);
    const lcid = languagesList.find(lang => lang.twoLettersCode === normalizedLocale)?.lcidString
    if (lcid) {
      setCurrentLCID(lcid)
    }
  }

  const [currentLocale, setCurrentLocale] = useState('fr');
  const [currentLCID, setCurrentLCID] = useState('fr-FR');

  const values = {
    currentLocale,
    currentLCID,
    updateLocale
  }

  return (
    <TranslationContext.Provider value={values}>
      {children}
    </TranslationContext.Provider>
  )
}
