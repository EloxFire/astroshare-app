import React, { useEffect, useState } from 'react'
import { Image, Keyboard, ScrollView, Text, View } from 'react-native'
import { viewPointsManagerStyles } from '../styles/screens/viewPointsManager'
import { showToast } from '../helpers/scripts/showToast'
import { globalStyles } from '../styles/global'
import { getObject } from '../helpers/storage'
import SimpleButton from '../components/commons/buttons/SimpleButton'
import PageTitle from '../components/commons/PageTitle'

export default function ViewPointsManager({ navigation }: any) {

  const [viewPoints, setViewPoints] = useState<any>([])

  const getCurrentViewPoints = async () => {
    const points = await getObject('viewPoints')
    if (points) {
      console.log(points);
    } else {
      showToast({ message: 'Aucun lieu d\'observation enregistré', type: 'error' })
    }
  }

  useEffect(() => {
    getCurrentViewPoints()
  }, [])

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title="Lieux d'observation" subtitle="// Gérez vos lieux d'observation favoris" />
      <View style={globalStyles.screens.separator} />
      <View style={viewPointsManagerStyles.content}>
        <SimpleButton text="Ajouter un lieu" icon={require('../../assets/icons/FiPlus.png')} onPress={() => { }} />
        <Text style={viewPointsManagerStyles.content.title}>Vos lieux</Text>
        <ScrollView style={{backgroundColor: 'red'}}>
          <View style={viewPointsManagerStyles.content.viewPoints}>
            {
              viewPoints.length <= 0 ?
                <Text style={viewPointsManagerStyles.content.noViewPoints}>Aucun lieu d'observation enregistré</Text>
                :
                viewPoints.map((point: any, index: number) => {
                  return (
                    <View key={index} style={viewPointsManagerStyles.content.viewPoints.viewPoint}>
                      <Text style={viewPointsManagerStyles.content.viewPoints.viewPoint.name}>{point.name}</Text>
                      <SimpleButton text="Modifier" icon={require('../../assets/icons/FiEdit.png')} onPress={() => { }} />
                      <SimpleButton text="Supprimer" icon={require('../../assets/icons/FiTrash.png')} onPress={() => { }} />
                    </View>
                  )
                })
            }
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
