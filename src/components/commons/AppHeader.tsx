import React, { useEffect, useState } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { appHeaderStyles } from '../../styles/components/commons/appHeader'
import { routes } from '../../helpers/routes'
import { useIsFocused } from '@react-navigation/native'
import { getObject } from '../../helpers/storage'
import { app_colors, storageKeys } from '../../helpers/constants'

export default function AppHeader({ navigation }: any) {

  const isFocused = useIsFocused();
  const [hasFavs, setHasFavs] = useState(false)

  useEffect(() => {
    (async () => {
      const favs = await getObject(storageKeys.favouriteObjects)
      setHasFavs(favs && favs.length > 0)
    })()
  }, [isFocused])

  return (
    <View style={appHeaderStyles.container}>
      <Image style={appHeaderStyles.container.logo}
        source={require('../../../assets/logos/astroshare_logo_white.png')}
        resizeMode='contain'
      />
      <View style={appHeaderStyles.container.buttons}>
        <TouchableOpacity onPress={() => navigation.navigate(routes.favorites.path)}>
          {
            !hasFavs ?
              <Image source={require('../../../assets/icons/FiHeart.png')} style={{ width: 20, height: 20 }} />
              :
              <Image source={require('../../../assets/icons/FiHeartFill.png')} style={{ width: 20, height: 20, tintColor: app_colors.red_eighty }} />
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate(routes.settings.path)}>
          <Image source={require('../../../assets/icons/FiSettings.png')} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
      </View>
    </View>
  )
}
