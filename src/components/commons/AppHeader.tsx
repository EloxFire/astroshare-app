import React from 'react'
import { Image, View } from 'react-native'
import { appHeaderStyles } from '../../styles/components/commons/appHeader'

export default function AppHeader() {
  return (
    <View style={appHeaderStyles.container}>
      <Image style={appHeaderStyles.container.logo}
        source={require('../../../assets/logos/astroshare_logo_white.png')}
        resizeMode='contain'
      />
    </View>
  )
}
