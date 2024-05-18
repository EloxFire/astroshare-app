import React from 'react'
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native'
import { simpleButtonStyles } from '../../../styles/components/commons/buttons/simpleButton'

interface BigButtonProps {
  text: string
  icon?: ImageSourcePropType
  disabled?: boolean
  onPress?: () => void
}

export default function SimpleButton({ text, icon, onPress, disabled }: BigButtonProps) {

  const handleButtonPress = () => {
    if(disabled) return;
    if(onPress) onPress()
  }

  return (
    <TouchableOpacity activeOpacity={.5} style={[simpleButtonStyles.button, {opacity: disabled ? .5 : 1}]} onPress={() => handleButtonPress()}>
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        {icon && <Image source={icon} style={simpleButtonStyles.button.icon} />}
        <Text style={simpleButtonStyles.button.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  )
}