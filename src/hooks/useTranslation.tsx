import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { frTranslations } from '../translation/fr';
import { getLocales } from 'expo-localization';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { I18n } from 'i18n-js';
import { getData } from '../helpers/storage';
import { languagesList } from '../helpers/scripts/i18n/languagesList';
import dayjs from 'dayjs';

const TranslationContext = createContext<any>({})

export const useTranslation = () => {
  return useContext(TranslationContext)
}

interface TranslationProviderProps {
  children: ReactNode
}

export function TranslationProvider({ children }: TranslationProviderProps) {

  useEffect(() => {
    (async () => {
      const locale = await getData('locale');
      if (locale) {
        setCurrentLocale(locale);
        dayjs.locale(locale === "gb" ? "en" : locale);
        const lcid = languagesList.find(lang => lang.twoLettersCode === locale)?.lcidString
        if (lcid) {
          setCurrentLCID(lcid)
        }
      }
    })()
  }, [])

  const [currentLocale, setCurrentLocale] = useState('fr');
  const [currentLCID, setCurrentLCID] = useState('fr-FR');

  const values = {
    currentLocale,
    currentLCID
  }

  return (
    <TranslationContext.Provider value={values}>
      {children}
    </TranslationContext.Provider>
  )
}
