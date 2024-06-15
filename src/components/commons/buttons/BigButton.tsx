import React, { useEffect, useState } from 'react'
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native'
import { bigButtonStyles } from '../../../styles/components/commons/buttons/bigButton'
import { EFeatureRequirements } from '../../../helpers/types/FeatureRequirements'
import { useSettings } from '../../../contexts/AppSettingsContext'

interface BigButtonProps {
  text: string
  subtitle?: string
  icon?: ImageSourcePropType
  navigation?: any
  targetScreen?: string
  hasCheckbox?: boolean
  isChecked?: boolean
  disabled?: boolean
  onPress?: () => void
}

export default function BigButton({ text, icon, navigation, targetScreen, subtitle, hasCheckbox, isChecked, onPress, disabled }: BigButtonProps) {

  const handleNavigation = () => {
    if (!navigation || !targetScreen) return;
    navigation.navigate(targetScreen)
  }

  const handleButtonPress = () => {
    if (disabled) return;
    if (onPress) {
      onPress()
    } else {
      handleNavigation()
    }
  }

  return (
    <TouchableOpacity activeOpacity={.5} style={[bigButtonStyles.button, { opacity: disabled ? .5 : 1 }]} onPress={() => handleButtonPress()}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {icon && <Image source={icon} style={bigButtonStyles.button.icon} />}
        <View>
          <Text maxFontSizeMultiplier={0} style={bigButtonStyles.button.text}>{text}</Text>
          {subtitle && <Text style={bigButtonStyles.button.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {
        hasCheckbox && (
          <Image
            source={isChecked ? require('../../../../assets/icons/FiToggleFilled.png') : require('../../../../assets/icons/FiToggleEmpty.png')}
            style={bigButtonStyles.button.icon}
          />
        )
      }
    </TouchableOpacity>
  )
}
