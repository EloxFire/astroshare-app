import React from 'react'
import { ScrollView, View } from 'react-native'
import { i18n } from '../../helpers/scripts/i18n'
import { globalStyles } from '../../styles/global'
import PageTitle from '../../components/commons/PageTitle'
import { sellScreenStyles } from '../../styles/screens/pro/sellScreen'
import { useTranslation } from '../../hooks/useTranslation'

export default function SellScreen({ navigation }: any) {

  const { currentLocale } = useTranslation();

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('pro.sellScreen.title')}
        subtitle={i18n.t('pro.sellScreen.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={sellScreenStyles.imageContainer}>
          {/* <Image source={require(`../../../assets/images/pro/presentation_${currentLocale}.png`)} style={{ width: '100%', height: 300 }} /> */}
        </View>
      </ScrollView>
    </View>
  )
}
