import React from 'react'
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native'
import { toolButtonStyles } from '../../../styles/components/commons/buttons/toolButton'

interface BigButtonProps {
  text: string
  subtitle?: string
  image?: ImageSourcePropType
  navigation?: any
  targetScreen?: string
  hasCheckbox?: boolean
  isChecked?: boolean
  disabled?: boolean
  onPress?: () => void
}

export default function ToolButton({ text, image, navigation, targetScreen, subtitle, hasCheckbox, isChecked, onPress, disabled }: BigButtonProps) {

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
    <TouchableOpacity activeOpacity={.5} style={[toolButtonStyles.button, { opacity: disabled ? .5 : 1 }]} onPress={() => handleButtonPress()}>
      {
        image && (
          <Image source={image} style={toolButtonStyles.button.image} />
        )
      }
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <View>
          <Text style={toolButtonStyles.button.text}>{text}</Text>
          {subtitle && <Text style={toolButtonStyles.button.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  )
}
