import React from 'react'
import { ActivityIndicator, Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native'
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
  activeBorderColor?: string
  align?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly'
  textAdditionalStyles?: any
  width?: string
  loading?: boolean
}

export default function SimpleButton({ text, icon, onPress, disabled, small, iconColor, textColor, active, fullWidth, backgroundColor, activeBorderColor, align, textAdditionalStyles, width, loading }: BigButtonProps) {

  const handleButtonPress = () => {
    if (disabled) return;
    if (onPress) onPress()
  }

  const buttonAdditionalStyles = {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    width: fullWidth ? '100%' as '100%' : width ? width : 'auto' as 'auto',
    opacity: disabled ? .5 : 1,
    padding: small ? 8 : 10,
    borderWidth: 1,
    borderColor: active ? activeBorderColor ? activeBorderColor : app_colors.white_eighty : 'transparent' as 'transparent',
    backgroundColor: backgroundColor ? backgroundColor : app_colors.white_no_opacity,
    justifyContent: align ? align : 'space-between' as 'space-between',
  }

  const textCustomStyles = {
    color: textColor ? textColor : app_colors.white_no_opacity,
    textAlign: 'center' as 'center',
    ...textAdditionalStyles
  }

  return (
    <TouchableOpacity activeOpacity={.5} style={[simpleButtonStyles.button, buttonAdditionalStyles]} onPress={() => handleButtonPress()}>
      {icon && !loading && <Image source={icon} style={{ width: small ? 12 : 18, height: small ? 12 : 18, marginRight: text ? 10 : 0, tintColor: iconColor ? iconColor : app_colors.white }} />}
      {text && !loading && <Text style={[simpleButtonStyles.button.text, textCustomStyles]}>{text}</Text>}
      {loading && <ActivityIndicator size="small" color={iconColor ? iconColor : app_colors.white} />}
    </TouchableOpacity>
  )
}