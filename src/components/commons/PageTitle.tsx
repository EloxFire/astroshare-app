import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../../styles/global'
import { pageTitleStyles } from '../../styles/components/commons/pageTitle'

interface PageTitleProps {
  navigation: any
  title: string
  subtitle?: string
  backRoute?: string
}


export default function PageTitle({ navigation, title, subtitle, backRoute }: PageTitleProps) {

  const handleGoBack = () => {
    if(backRoute){
      navigation.push(backRoute)
    }else{
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
