import React from 'react'
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native'
import { simpleButtonStyles } from '../../../styles/components/commons/buttons/simpleButton'

interface BigButtonProps {
  text?: string
  icon?: ImageSourcePropType
  disabled?: boolean
  small?: boolean
  onPress?: () => void
}

export default function SimpleButton({ text, icon, onPress, disabled, small }: BigButtonProps) {

  const handleButtonPress = () => {
    if(disabled) return;
    if(onPress) onPress()
  }

  let iconStyles = {};
  if (small) {
    iconStyles = {
      width: 20,
      height: 20,
    }
  } else {
    iconStyles = {
      width: 30,
      height: 30,
    }
  }

  return (
    <TouchableOpacity activeOpacity={.5} style={[simpleButtonStyles.button, {opacity: disabled ? .5 : 1}]} onPress={() => handleButtonPress()}>
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        {icon && <Image source={icon} style={{width: small ? 18 : 22, height: small ? 18 : 22, marginRight: text ? 10 : 0}} />}
        {text && <Text style={simpleButtonStyles.button.text}>{text}</Text>}
      </View>
    </TouchableOpacity>
  )
}