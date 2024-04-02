import React from 'react'
import { Image, ImageSourcePropType, Text, TouchableOpacity } from 'react-native'
import { bigButtonStyles } from '../../styles/components/commons/bigButton'

interface BigButtonProps {
  text: string
  icon: ImageSourcePropType
  additionalStyles?: any
  navigation?: any
  targetScreen?: string
}

export default function BigButton({ text, icon, additionalStyles = {}, navigation, targetScreen }: BigButtonProps) {

  const handleNaviggation = () => {
    if (!navigation || !targetScreen) return;
    navigation.navigate(targetScreen)
  }

  return (
    <TouchableOpacity style={[bigButtonStyles.button, additionalStyles]} onPress={() => handleNaviggation()}>
      <Image source={icon} style={bigButtonStyles.button.icon} />
      <Text style={bigButtonStyles.button.text}>{text}</Text>
    </TouchableOpacity>
  )
}
