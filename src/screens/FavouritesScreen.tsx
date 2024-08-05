import React, { useEffect } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import PageTitle from '../components/commons/PageTitle'
import { getData, getObject, storeObject } from '../helpers/storage'
import { app_colors, storageKeys } from '../helpers/constants'
import { DSO } from '../helpers/types/DSO'
import ObjectCardLite from '../components/cards/ObjectCardLite'

export default function FavouritesScreen({ navigation }: any) {

  const [objects, setObjects] = React.useState<DSO[]>([])

  useEffect(() => {
    (async () => {
      const favs = await getObject(storageKeys.favouriteObjects)
      setObjects(favs)
    })()
  }, [])

  const handleClearAll = async () => {
    await storeObject(storageKeys.favouriteObjects, [])
    setObjects([])
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title="Objets favoris" subtitle="// Accédez rapidement à vos objets favoris" />
      <View style={globalStyles.screens.separator} />

      <ScrollView>
        {
          objects.map((object: DSO, index: number) => {
            return <ObjectCardLite key={index} object={object} navigation={navigation} />
          })
        }
        {/* Clear all favs button */}
        <TouchableOpacity style={{ marginTop: 30, backgroundColor: app_colors.red, padding: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 10, display: 'flex', width: '100%', height: 30 }} onPress={() => handleClearAll()}>
          <Text>Vider les favoris</Text>
        </TouchableOpacity>
      </ScrollView>


    </View>
  )
}
