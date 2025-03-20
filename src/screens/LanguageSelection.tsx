import React from 'react'
import { View, ScrollView, Linking, TouchableOpacity, Text } from 'react-native'
import { globalStyles } from '../styles/global'
import { languageSelectionStyles } from '../styles/screens/languageSelection'
import PageTitle from '../components/commons/PageTitle'
import { i18n } from '../helpers/scripts/i18n'
import { languagesList } from '../helpers/scripts/i18n/languagesList'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import { routes } from '../helpers/routes'
import { storeData } from '../helpers/storage'
import { app_colors } from '../helpers/constants'
import {useTranslation} from "../hooks/useTranslation";

export default function LanguageSelection({ navigation }: any) {

  const {updateLocale} = useTranslation()

  const changeLocale = async (code: string) => {
    // showToast({ message: i18n.t('languageSelection.warning'), type: 'error', duration: 3000 })
    i18n.locale = code
    updateLocale(code)
    await storeData('locale', code)
    navigation.push(routes.home.path)
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('languageSelection.title')}
        subtitle={i18n.t('languageSelection.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={languageSelectionStyles.content}>
          {
            languagesList.map((language: any, index: number) => {
              console.log(language)

              return (
                <TouchableOpacity key={index} style={[languageSelectionStyles.content.button, { borderColor: i18n.locale === language.twoLettersCode ? app_colors.white : app_colors.white_no_opacity }]} onPress={() => changeLocale(language.twoLettersCode)}>
                  <Text style={languageSelectionStyles.content.button.text}>{language.name}</Text>
                  <Text style={languageSelectionStyles.content.button.icon}>{getUnicodeFlagIcon(language.twoLettersCode === 'en' ? 'GB' : language.twoLettersCode.toUpperCase())}</Text>
                </TouchableOpacity>
              )
            })
          }
        </View>
      </ScrollView>
    </View>
  )
}
