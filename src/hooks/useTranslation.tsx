import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import * as Device from 'expo-device';

const TranslationContext = createContext<any>({})

export const useTranslation = () => {
  return useContext(TranslationContext)
}

interface TranslationProviderProps {
  children: ReactNode
}

export function TranslationProvider({ children }: TranslationProviderProps) {

  const [currentLocale, setCurrentLocale] = useState<string>('fr');

  const changeLocale = (newLocale: string) => {
    setCurrentLocale(newLocale);
  }

  useEffect(() => {
    // Device.getLan
  }, [])

  const translateText = (key: string, params?: any) => {
  }

  const values = {
    currentLocale,
  }

  return (
    <TranslationContext.Provider value={values}>
      {children}
    </TranslationContext.Provider>
  )
}
