import React from 'react'
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native'
import { squareButtonStyles } from '../../../styles/components/commons/buttons/squareButton'

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

export default function SquareButton({ text, image, navigation, targetScreen, subtitle, hasCheckbox, isChecked, onPress, disabled }: BigButtonProps) {

  const handleNavigation = () => {
    if (!navigation || !targetScreen) return;
    navigation.navigate(targetScreen)
  }

  const handleButtonPress = () => {
    if(disabled) return;
    if (onPress) {
      onPress()
    } else {
      handleNavigation()
    }
  }

  return (
    <TouchableOpacity activeOpacity={.5} style={[squareButtonStyles.button, {opacity: disabled ? .5 : 1}]} onPress={() => handleButtonPress()}>
      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <View>
          <Text style={squareButtonStyles.button.text}>{text}</Text>
          {subtitle &&<Text style={squareButtonStyles.button.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {
        image && (
          <Image source={image} style={squareButtonStyles.button.image}/>
        )
      }
    </TouchableOpacity>
  )
}
