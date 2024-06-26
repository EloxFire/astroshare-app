import React, { useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { viewPointsManagerStyles } from '../styles/screens/viewPointsManager'
import { showToast } from '../helpers/scripts/showToast'
import { globalStyles } from '../styles/global'
import { TViewPoint } from '../helpers/types/ViewPoint'
import { useSpot } from '../contexts/ObservationSpotContext'
import SimpleButton from '../components/commons/buttons/SimpleButton'
import PageTitle from '../components/commons/PageTitle'
import ViewPoint from '../components/ViewPoint'
import AddSpotModal from '../components/modals/AddSpotModal'
import DeleteSpotModal from '../components/modals/DeleteSpotModal'
import InputWithIcon from '../components/forms/InputWithIcon'

export default function ViewPointsManager({ navigation }: any) {

  const { deleteSpot, viewPoints, selectedSpot } = useSpot()

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState<boolean>(false)



  const handleSpotDeletion = (spotTitle: string) => {
    try {
      deleteSpot(spotTitle)
      showToast({ message: 'Lieu d\'observation supprimé', type: 'success' })
      setDeleteModalVisible(false)
    } catch (error) {
      showToast({ message: 'Erreur lors de la suppression du lieu d\'observation', type: 'error' })
    }
  }

  return (
    <View style={globalStyles.body}>
      {isModalVisible && <AddSpotModal onClose={() => setIsModalVisible(false)} />}
      {isDeleteModalVisible && <DeleteSpotModal onClose={() => setDeleteModalVisible(false)} />}
      <PageTitle navigation={navigation} title="Lieux d'observation" subtitle="// Gérez vos lieux d'observation favoris" />
      <View style={globalStyles.screens.separator} />
      <View style={viewPointsManagerStyles.content}>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
          <SimpleButton text="Ajouter un lieu" icon={require('../../assets/icons/FiPlus.png')} onPress={() => setIsModalVisible(true)} />
          <SimpleButton text="Supprimer un lieu" icon={require('../../assets/icons/FiTrash.png')} onPress={() => setDeleteModalVisible(true)} />
        </View>
        <Text style={viewPointsManagerStyles.content.title}>Vos lieux</Text>
        <Text style={viewPointsManagerStyles.content.text}>Lieu actuel : {viewPoints.length === 0 ? "Aucun lieu enregistré" : selectedSpot ? selectedSpot.title : 'Aucun'}</Text>
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
            {
              viewPoints.length === 0 && (
                <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60 }}>
                  <Image source={require('../../assets/icons/FiViewPoint.png')} style={{ width: 90, height: 90, opacity: .5, marginBottom: 20 }} />
                  <Text style={[viewPointsManagerStyles.content.text, { opacity: .5, marginBottom: 0, fontSize: 15 }]}>Ajouter un lieu d'observation</Text>
                  <Text style={[viewPointsManagerStyles.content.text, { opacity: .5, marginBottom: 0, fontSize: 15 }]}>pour des informations encore</Text>
                  <Text style={[viewPointsManagerStyles.content.text, { opacity: .5, marginBottom: 0, fontSize: 15 }]}>plus précises et personnalisées</Text>
                </View>
              )
            }
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
