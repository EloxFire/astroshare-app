import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../../styles/global'
import { pageTitleStyles } from '../../styles/components/commons/pageTitle'

interface PageTitleProps {
  navigation: any
  title: string
}


export default function PageTitle({ navigation, title }: PageTitleProps) {
  return (
    <View style={pageTitleStyles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image style={pageTitleStyles.container.icon} source={require('../../../assets/icons/FiArrowLeftCircle.png')}/>
      </TouchableOpacity>
      <Text style={globalStyles.screens.title}>{title}</Text>
    </View>
  )
}
