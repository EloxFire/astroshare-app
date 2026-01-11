import React, { useEffect, useState } from 'react'
import { Image, ImageBackground, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native'
import { bigButtonStyles } from '../../../styles/components/commons/buttons/bigButton'
import ProBadge from "../../badges/ProBadge";

interface BigButtonProps {
  text: string
  subtitle?: string
  icon?: ImageSourcePropType
  navigation?: any
  targetScreen?: string
  hasCheckbox?: boolean
  isPremium?: boolean
  isChecked?: boolean
  disabled?: boolean
  onPress?: () => void
  backgroundImage?: ImageSourcePropType
}

export default function BigButton({ text, icon, navigation, targetScreen, subtitle, hasCheckbox, isChecked, onPress, disabled, isPremium, backgroundImage }: BigButtonProps) {

  const handleNavigation = () => {
    if (!navigation || !targetScreen) return;
    navigation.push(targetScreen)
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
    <ImageBackground source={backgroundImage} imageStyle={{ borderRadius: 10 }} style={bigButtonStyles.button.image}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: disabled ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)', borderRadius: 10 }} />
      <TouchableOpacity activeOpacity={.5} style={[bigButtonStyles.button, { opacity: disabled ? .3 : 1 }]} onPress={() => handleButtonPress()}>
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
        {
          isPremium &&
          <ProBadge additionalStyles={{marginRight: 10, transform: [{scale: 1.2}]}}/>
        }
      </TouchableOpacity>
    </ImageBackground>
  )
}
