import React from 'react'
import { Image, Text, View } from 'react-native'
import AnimatedStar from '../../animations/AnimatedStar'
import { premiumButtonDecoratorStyles } from '../../../styles/components/commons/premium/premiumButtonDecorator'
import { i18n } from '../../../helpers/scripts/i18n'
import { app_colors } from '../../../helpers/constants'

export default function PremiumButtonDecorator() {
  return (
    <View style={premiumButtonDecoratorStyles.container}>
      {/* <View style={{ marginRight: 80 }}>
        <AnimatedStar size={15} />
      </View>
      <View style={{ marginLeft: 50 }}>
        <AnimatedStar size={8} />
      </View>
      <View style={{ marginLeft: 80 }}>
        <AnimatedStar size={13} />
      </View>
      <View style={{ marginLeft: 25 }}>
        <AnimatedStar size={11} />
      </View> */}
      <Image source={require('../../../../assets/icons/FiLock.png')} style={{ width: 18, height: 18 }} />
      <Text style={{ color: app_colors.white, fontFamily: "GilroyBlack", textTransform: "uppercase" }}>{ }</Text>
    </View>
  )
}
