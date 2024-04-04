import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../../styles/global'
import { pageTitleStyles } from '../../styles/components/commons/pageTitle'

interface PageTitleProps {
  navigation: any
  title: string
  subtitle?: string
}


export default function PageTitle({ navigation, title, subtitle }: PageTitleProps) {
  return (
    <View style={pageTitleStyles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image style={pageTitleStyles.container.icon} source={require('../../../assets/icons/FiChevronDown.png')}/>
      </TouchableOpacity>
      <View>
        <Text style={globalStyles.screens.title}>{title}</Text>
        {subtitle && <Text style={globalStyles.screens.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  )
}
