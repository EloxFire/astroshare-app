import React from 'react'
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native'
import { bigButtonStyles } from '../../styles/components/commons/bigButton'

interface BigButtonProps {
  text: string
  subtitle?: string
  icon?: ImageSourcePropType
  navigation?: any
  targetScreen?: string
  hasCheckbox?: boolean
  isChecked?: boolean
  onPress?: () => void
}

export default function BigButton({ text, icon, navigation, targetScreen, subtitle, hasCheckbox, isChecked, onPress }: BigButtonProps) {

  const handleNavigation = () => {
    if (!navigation || !targetScreen) return;
    navigation.navigate(targetScreen)
  }

  const handleButtonPress = () => {
    if (onPress) {
      onPress()
    } else {
      handleNavigation()
    }
  }

  return (
    <TouchableOpacity style={bigButtonStyles.button} onPress={() => handleButtonPress()}>
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        {icon && <Image source={icon} style={bigButtonStyles.button.icon} />}
        <View>
          <Text style={bigButtonStyles.button.text}>{text}</Text>
          {subtitle &&<Text style={bigButtonStyles.button.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {
        hasCheckbox && (
          <Image
            source={isChecked ? require('../../../assets/icons/FiToggleFilled.png') : require('../../../assets/icons/FiToggleEmpty.png')}
            style={bigButtonStyles.button.icon}
          />
        )
      }
    </TouchableOpacity>
  )
}
