import React from 'react'
import { Image, ImageBackground, ImageSourcePropType, Text, TouchableOpacity, View } from 'react-native'
import { toolButtonStyles } from '../../../styles/components/commons/buttons/toolButton'
import { app_colors } from '../../../helpers/constants'
import AnimatedStar from '../../animations/AnimatedStar'
import PremiumButtonDecorator from '../premium/PremiumButtonDecorator'
import ProBadge from "../../badges/ProBadge";

interface BigButtonProps {
  text: string
  subtitle?: string
  image?: ImageSourcePropType
  icon?: ImageSourcePropType
  navigation?: any
  targetScreen?: string
  routeParams?: any
  hasCheckbox?: boolean
  isPremium?: boolean
  isChecked?: boolean
  disabled?: boolean
  onPress?: () => void
}

export default function ToolButton({ text, image, icon, navigation, targetScreen, subtitle, routeParams,hasCheckbox, isChecked, onPress, disabled, isPremium }: BigButtonProps) {

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
    <ImageBackground source={image} style={[toolButtonStyles.button, { opacity: disabled ? 0.3 : 1 }]} imageStyle={toolButtonStyles.button.image}>
      <TouchableOpacity activeOpacity={.7} style={{flex: 1, justifyContent: 'center', padding: 10}} onPress={() => handleButtonPress()}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
            {icon && <Image source={icon} style={toolButtonStyles.button.icon} />}
            <View>
              <Text style={toolButtonStyles.button.text}>{text}</Text>
              {subtitle && <Text style={toolButtonStyles.button.subtitle}>{subtitle}</Text>}
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {
              isPremium &&
              <ProBadge additionalStyles={{marginRight: 10, transform: [{scale: 1.2}]}}/>
            }
            {
              hasCheckbox && (
                <Image
                  source={isChecked ? require('../../../../assets/icons/FiToggleFilled.png') : require('../../../../assets/icons/FiToggleEmpty.png')}
                  style={toolButtonStyles.button.icon}
                />
              )
            }
          </View>
        </View>
      </TouchableOpacity>
    </ImageBackground>
  )
}
