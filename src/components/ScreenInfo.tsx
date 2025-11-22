import React from 'react'
import { Image, ImageSourcePropType, Text, View } from 'react-native'
import { app_colors } from '../helpers/constants'
import { viewPointsManagerStyles } from '../styles/screens/viewPointsManager'

interface ScreenInfoProps {
  image: ImageSourcePropType
  text: string
}

export default function ScreenInfo({ image, text }: ScreenInfoProps) {
  return (
    <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginVertical: 40 }}>
      <Image source={image} style={{ width: 85, height: 85, opacity: .5, marginBottom: 20 }} />
      <Text style={{
        opacity: .5,
        marginBottom: 0,
        fontSize: 15, marginHorizontal: 50,
        color: app_colors.white,
        fontFamily: 'GilroyMedium',
        textAlign: 'center'
      }}>
        {text}
      </Text>
    </View>
  )
}
