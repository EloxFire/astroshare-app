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
      <PageTitle navigation={navigation} title="Objets favoris" subtitle="// Accédez rapidement à vos objets favoris" />
      <View style={globalStyles.screens.separator} />

      <ScrollView style={{ flex: 1 }}>
        {
          objects.length > 0 ?
            objects.map((object: DSO, index: number) => {
              return <ObjectCardLite key={index} object={object} navigation={navigation} />
            }) :
            <View>
              <Text style={favouriteScreenStyles.noFavsBadge}>Vous n'avez pas encore ajouté de favoris !</Text>
              <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60 }}>
                <Image source={require('../../assets/icons/FiHeart.png')} style={{ width: 90, height: 90, opacity: .5, marginBottom: 20 }} />
                <Text style={[viewPointsManagerStyles.content.text, { opacity: .5, marginBottom: 0, fontSize: 15 }]}>Ajouter des objets favoris afin</Text>
                <Text style={[viewPointsManagerStyles.content.text, { opacity: .5, marginBottom: 0, fontSize: 15 }]}>de les retrouver facilement !</Text>
              </View>
            </View>
        }
      </ScrollView>
      {/* Clear all favs button */}
      {
        objects.length > 0 &&
        <TouchableOpacity style={{ marginVertical: 30, backgroundColor: app_colors.red_eighty, padding: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 10, display: 'flex', width: '100%', height: 30 }} onPress={() => handleClearAll()}>
          <Text style={{ color: app_colors.white }}>Vider les favoris</Text>
        </TouchableOpacity>
      }
    </View>
  )
}
