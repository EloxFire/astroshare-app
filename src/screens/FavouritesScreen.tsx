import React, { useEffect } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { getObject, storeObject } from '../helpers/storage'
import { app_colors, storageKeys } from '../helpers/constants'
import { DSO } from '../helpers/types/DSO'
import { useIsFocused } from "@react-navigation/native";
import { favouriteScreenStyles } from '../styles/screens/favouriteScreen'
import { viewPointsManagerStyles } from '../styles/screens/viewPointsManager'
import PageTitle from '../components/commons/PageTitle'
import ObjectCardLite from '../components/cards/ObjectCardLite'
import { i18n } from '../helpers/scripts/i18n'

export default function FavouritesScreen({ navigation }: any) {

  const isFocused = useIsFocused();
  const [objects, setObjects] = React.useState<DSO[]>([])

  useEffect(() => {
    (async () => {
      const favs = await getObject(storageKeys.favouriteObjects)
      if (!favs) return
      setObjects(favs)
    })()
  }, [isFocused])

  const handleClearAll = async () => {
    await storeObject(storageKeys.favouriteObjects, [])
    setObjects([])
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title={i18n.t('favouriteScreen.title')} subtitle={i18n.t('favouriteScreen.subtitle')} />
      <View style={globalStyles.screens.separator} />

      <ScrollView style={{ flex: 1 }}>
        {
          objects.length > 0 ?
            objects.map((object: DSO, index: number) => {
              return <ObjectCardLite key={index} object={object} navigation={navigation} />
            }) :
            <View>
              <Text style={favouriteScreenStyles.noFavsBadge}>{i18n.t('favouriteScreen.noFavs')}</Text>
              <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60 }}>
                <Image source={require('../../assets/icons/FiHeart.png')} style={{ width: 90, height: 90, opacity: .5, marginBottom: 20 }} />
                <Text style={[viewPointsManagerStyles.content.text, { opacity: .5, marginBottom: 0, fontSize: 15 }]}>{i18n.t('favouriteScreen.noFavsHint')}</Text>
              </View>
            </View>
        }
      </ScrollView>
      {/* Clear all favs button */}
      {
        objects.length > 0 &&
        <TouchableOpacity style={{ marginVertical: 30, backgroundColor: app_colors.red_eighty, padding: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 10, display: 'flex', width: '100%', height: 30 }} onPress={() => handleClearAll()}>
          <Text style={{ color: app_colors.white }}>{i18n.t('favouriteScreen.emptyButton')}</Text>
        </TouchableOpacity>
      }
    </View>
  )
}
