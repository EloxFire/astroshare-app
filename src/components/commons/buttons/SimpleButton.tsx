import React from 'react'
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native'
import { simpleButtonStyles } from '../../../styles/components/commons/buttons/simpleButton'
import { app_colors } from '../../../helpers/constants'

interface BigButtonProps {
  text?: string
  icon?: ImageSourcePropType
  disabled?: boolean
  small?: boolean
  iconColor?: string
  textColor?: string
  active?: boolean
  onPress?: () => void
  fullWidth?: boolean
  backgroundColor?: string
}

export default function SimpleButton({ text, icon, onPress, disabled, small, iconColor, textColor, active, fullWidth, backgroundColor }: BigButtonProps) {

  const handleButtonPress = () => {
    if (disabled) return;
    if (onPress) onPress()
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
    <TouchableOpacity activeOpacity={.5} style={[simpleButtonStyles.button, { width: fullWidth ? '100%' : 'auto', opacity: disabled ? .5 : 1, padding: small ? 8 : 10, borderWidth: 1, borderColor: active ? app_colors.white_eighty : 'transparent', backgroundColor: backgroundColor ? backgroundColor : app_colors.white_no_opacity, justifyContent: icon ? 'space-between' : 'center' }]} onPress={() => handleButtonPress()}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {icon && <Image source={icon} style={{ width: small ? 12 : 18, height: small ? 12 : 18, marginRight: text ? 10 : 0, tintColor: iconColor ? iconColor : app_colors.white }} />}
        {text && <Text style={[simpleButtonStyles.button.text, { color: textColor ? textColor : app_colors.white }]}>{text}</Text>}
      </View>
    </TouchableOpacity>
  )
}