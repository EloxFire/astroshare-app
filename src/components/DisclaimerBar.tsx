import React from 'react'
import { Image, Text, View } from 'react-native'
import { disclaimerBarStyles } from '../styles/components/disclaimerBar'
import { app_colors } from '../helpers/constants'

interface DisclaimerBarProps {
  message: string
  type: 'error' | 'info'
}

export default function DisclaimerBar({ message, type }: DisclaimerBarProps) {
  const bgColor = type === 'error' ? app_colors.red_eighty : app_colors.green_eighty

  return (
    <View style={[disclaimerBarStyles.bar, {backgroundColor: bgColor}]}>
      <Image source={require('../../assets/icons/FiXCircle.png')} style={disclaimerBarStyles.bar.icon} />
      <Text style={disclaimerBarStyles.bar.text}>{message}</Text>
    </View>
  )
}
