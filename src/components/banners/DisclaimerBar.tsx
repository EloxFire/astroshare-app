import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { disclaimerBarStyles } from '../../styles/components/banners/disclaimerBar'
import { app_colors } from '../../helpers/constants'

interface DisclaimerBarProps {
  message: string
  type: 'error' | 'info' | 'warning'
  onPress?: () => void
  soft?: boolean
}

export default function DisclaimerBar({ message, type, onPress, soft }: DisclaimerBarProps) {
  let bgColor;
  switch (type) {
    case 'error':
      bgColor = app_colors.red_eighty
      break
    case 'info':
      bgColor = app_colors.white_no_opacity
      break
    case 'warning':
      bgColor = soft ? app_colors.warning_forty : app_colors.warning
      break
    default:
      bgColor = app_colors.white_no_opacity
      break
  }

  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress}>
      <View style={[disclaimerBarStyles.bar, {backgroundColor: bgColor}]}>
        {type === 'error' && <Image source={require('../../../assets/icons/FiAlertTriangle.png')} style={[disclaimerBarStyles.bar.icon, {opacity: 1}]} />}
        {type === 'info' && <Image source={require('../../../assets/icons/FiInfo.png')} style={disclaimerBarStyles.bar.icon} />}
        {type === 'warning' && <Image source={require('../../../assets/icons/FiAlertTriangle.png')} style={[disclaimerBarStyles.bar.icon, {opacity: 1}]} />}
        <Text style={[disclaimerBarStyles.bar.text, {opacity: type === 'error' || type === 'warning' ? 1 : .5 }]}>{message}</Text>
      </View>
    </TouchableOpacity>
  )
}
