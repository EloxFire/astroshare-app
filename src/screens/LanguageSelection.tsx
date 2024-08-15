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
import { showToast } from '../helpers/scripts/showToast'

export default function LanguageSelection({ navigation }: any) {

  const changeLocale = async (code: string) => {
    i18n.locale = code
    await storeData('locale', code)
    navigation.navigate(routes.home.path)
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('title')}
        subtitle="// Changez la langue de l'application"
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={languageSelectionStyles.content}>
          {
            languagesList.map((language: any, index: number) => {
              return (
                <TouchableOpacity key={index} style={languageSelectionStyles.content.button} onPress={() => changeLocale(language.twoLettersCode)}>
                  <Text style={languageSelectionStyles.content.button.text}>{getUnicodeFlagIcon(language.twoLettersCode.toUpperCase())}</Text>
                </TouchableOpacity>
              )
            })
          }
        </View>
      </ScrollView>
    </View>
  )
}
