import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { appHeaderStyles } from '../../styles/components/commons/appHeader'
import { routes } from '../../helpers/routes'

export default function AppHeader({ navigation }: any) {
  return (
    <View style={appHeaderStyles.container}>
      <Image style={appHeaderStyles.container.logo}
        source={require('../../../assets/logos/astroshare_logo_white.png')}
        resizeMode='contain'
      />
      <View style={appHeaderStyles.container.buttons}>
        <TouchableOpacity onPress={() => navigation.navigate(routes.favorites.path)}>
          <Image source={require('../../../assets/icons/FiHeart.png')} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate(routes.settings.path)}>
          <Image source={require('../../../assets/icons/FiSettings.png')} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
      </View>
    </View>
  )
}
