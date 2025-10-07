import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../../styles/global'
import { pageTitleStyles } from '../../styles/components/commons/pageTitle'
import { useAuth } from '../../contexts/AuthContext'
import { useTranslation } from '../../hooks/useTranslation'
import { useSettings } from '../../contexts/AppSettingsContext'
import { sendAnalyticsEvent } from '../../helpers/scripts/analytics'
import { eventTypes } from '../../helpers/constants/analytics'

interface PageTitleProps {
  navigation: any
  title: string
  subtitle?: string
  backRoute?: string
}


export default function PageTitle({ navigation, title, subtitle, backRoute }: PageTitleProps) {

  const {currentUser} = useAuth()
  const {currentLocale} = useTranslation()
  const {currentUserLocation} = useSettings()

  const handleGoBack = () => {
    if(backRoute){
      navigation.push(backRoute)
    }else{
      const prevRoute = navigation.getState().routes[navigation.getState().index - 1].name
      sendAnalyticsEvent(currentUser, currentUserLocation, 'back_button_pressed', eventTypes.BUTTON_CLICK, { from: title, to: prevRoute }, currentLocale)
      navigation.goBack()
    }
  }

  return (
    <View style={pageTitleStyles.container}>
      <TouchableOpacity onPress={() => handleGoBack()}>
        <Image style={pageTitleStyles.container.icon} source={require('../../../assets/icons/FiChevronDown.png')}/>
      </TouchableOpacity>
      <View>
        <Text style={globalStyles.screens.title}>{title}</Text>
        {subtitle && <Text style={globalStyles.screens.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  )
}
