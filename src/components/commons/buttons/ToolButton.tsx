import React from 'react'
import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native'
import { toolButtonStyles } from '../../../styles/components/commons/buttons/toolButton'
import { app_colors } from '../../../helpers/constants'
import AnimatedStar from '../../animations/AnimatedStar'
import PremiumButtonDecorator from '../premium/PremiumButtonDecorator'
import ProBadge from "../../badges/ProBadge";

interface BigButtonProps {
  text: string
  subtitle?: string
  image?: ImageSourcePropType
  navigation?: any
  targetScreen?: string
  routeParams?: any
  hasCheckbox?: boolean
  isPremium?: boolean
  isChecked?: boolean
  disabled?: boolean
  onPress?: () => void
}

export default function ToolButton({ text, image, navigation, targetScreen, subtitle, routeParams,hasCheckbox, isChecked, onPress, disabled, isPremium }: BigButtonProps) {

  const handleNavigation = () => {
    if (!navigation || !targetScreen) return;
    if(routeParams) {
      navigation.push(targetScreen, routeParams)
    }else{
      navigation.push(targetScreen)
    }
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
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={toolButtonStyles.button.text}>{text}</Text>
          {subtitle && <Text style={toolButtonStyles.button.subtitle}>{subtitle}</Text>}
        </View>
        {
          isPremium &&
          <ProBadge additionalStyles={{marginRight: 10, transform: [{scale: 1.2}]}}/>
        }
      </View>
    </TouchableOpacity>
  )
}
