import React from 'react'
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native'
import { bigButtonStyles } from '../../styles/components/commons/bigButton'

interface BigButtonProps {
  text: string
  subtitle?: string
  icon: ImageSourcePropType
  navigation?: any
  targetScreen?: string
}

export default function BigButton({ text, icon, navigation, targetScreen, subtitle }: BigButtonProps) {

  const handleNaviggation = () => {
    if (!navigation || !targetScreen) return;
    navigation.navigate(targetScreen)
  }

  return (
    <TouchableOpacity style={bigButtonStyles.button} onPress={() => handleNaviggation()}>
      <Image source={icon} style={bigButtonStyles.button.icon} />
      <View>
        <Text style={bigButtonStyles.button.text}>{text}</Text>
        {subtitle &&<Text style={bigButtonStyles.button.subtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  )
}
