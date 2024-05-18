import React, { useEffect, useState } from 'react'
import { Image, Keyboard, ScrollView, Text, View } from 'react-native'
import { viewPointsManagerStyles } from '../styles/screens/viewPointsManager'
import { showToast } from '../helpers/scripts/showToast'
import { globalStyles } from '../styles/global'
import { getObject } from '../helpers/storage'
import SimpleButton from '../components/commons/buttons/SimpleButton'
import PageTitle from '../components/commons/PageTitle'
import ViewPoint from '../components/ViewPoint'
import { TViewPoint } from '../helpers/types/ViewPoint'
import AddSpotModal from '../components/modals/AddSpotModal'

export default function ViewPointsManager({ navigation }: any) {

  const [viewPoints, setViewPoints] = useState<TViewPoint[]>([])
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  const getCurrentViewPoints = async () => {
    const points = await getObject('viewPoints')
    if (points) {
      console.log(points);
      setViewPoints(points)
    } else {
      showToast({ message: 'Aucun lieu d\'observation enregistré', type: 'error' })
    }
  }

  useEffect(() => {
    getCurrentViewPoints()
  }, [])

  return (
    <View style={globalStyles.body}>
      {isModalVisible && <AddSpotModal onClose={() => setIsModalVisible(false)} />}
      <PageTitle navigation={navigation} title="Lieux d'observation" subtitle="// Gérez vos lieux d'observation favoris" />
      <View style={globalStyles.screens.separator} />
      <View style={viewPointsManagerStyles.content}>
        <SimpleButton text="Ajouter un lieu" icon={require('../../assets/icons/FiPlus.png')} onPress={() => setIsModalVisible(true)} />
        <Text style={viewPointsManagerStyles.content.title}>Vos lieux</Text>
        <ScrollView>
          <View style={viewPointsManagerStyles.content.viewPoints}>
            {
              viewPoints.length <= 0 ?
                <Text style={viewPointsManagerStyles.content.noViewPoints}>Aucun lieu d'observation enregistré</Text>
                :
                viewPoints.map((viewPoint: TViewPoint) => {
                  return (
                    <ViewPoint key={`viewpoint-${viewPoint.title}`} spot={viewPoint} />
                  )
                })
            }
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
