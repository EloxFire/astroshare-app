import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { frTranslations } from '../translation/fr';
import { getLocales } from 'expo-localization';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { I18n } from 'i18n-js';
import { getData } from '../helpers/storage';

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
      }
    })()
  }, [])

  const [currentLocale, setCurrentLocale] = useState('fr');

  const values = {
    currentLocale
  }

  return (
    <TranslationContext.Provider value={values}>
      {children}
    </TranslationContext.Provider>
  )
}
