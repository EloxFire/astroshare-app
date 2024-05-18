import React from 'react'
import { Image, Text, View } from 'react-native'
import { disclaimerBarStyles } from '../../styles/components/banners/disclaimerBar'
import { app_colors } from '../../helpers/constants'

interface DisclaimerBarProps {
  message: string
  type: 'error' | 'info'
}

export default function DisclaimerBar({ message, type }: DisclaimerBarProps) {
  const bgColor = type === 'error' ? app_colors.red_eighty : app_colors.white_no_opacity

  return (
    <View style={[disclaimerBarStyles.bar, {backgroundColor: bgColor}]}>
      {type === 'error' && <Image source={require('../../../assets/icons/FiXCircle.png')} style={[disclaimerBarStyles.bar.icon, {opacity: 1}]} />}
      {type === 'info' && <Image source={require('../../../assets/icons/FiInfo.png')} style={disclaimerBarStyles.bar.icon} />}
      <Text style={[disclaimerBarStyles.bar.text, {opacity: type === 'error' ? 1 : .5 }]}>{message}</Text>
    </View>
  )
}
