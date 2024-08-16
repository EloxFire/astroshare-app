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
import { i18n } from '../helpers/scripts/i18n'
import { viewpointsManagerTranslations } from '../translation/en/screens/viewpointsManager'

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
      <PageTitle navigation={navigation} title={i18n.t('viewpointsManager.title')} subtitle={i18n.t('viewpointsManager.subtitle')} />
      <View style={globalStyles.screens.separator} />
      <View style={viewPointsManagerStyles.content}>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
          <SimpleButton text={i18n.t('viewpointsManager.addViewPoint')} icon={require('../../assets/icons/FiPlus.png')} onPress={() => setIsModalVisible(true)} />
          <SimpleButton text={i18n.t('viewpointsManager.deleteViewPoint')} icon={require('../../assets/icons/FiTrash.png')} onPress={() => setDeleteModalVisible(true)} />
        </View>
        <Text style={viewPointsManagerStyles.content.title}>{i18n.t('viewpointsManager.sectionTitle')}</Text>
        <Text style={viewPointsManagerStyles.content.text}>{i18n.t('viewpointsManager.currentViewPoint')} : {viewPoints.length === 0 ? i18n.t('viewpointsManager.noViewPoint') : selectedSpot ? selectedSpot.title : i18n.t('viewpointsManager.noViewPoint')}</Text>
        <ScrollView>
          <View style={viewPointsManagerStyles.content.viewPoints}>
            {
              viewPoints.length <= 0 ?
                <Text style={viewPointsManagerStyles.content.noViewPoints}>{i18n.t('viewpointsManager.noViewPoints')}</Text>
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
                  <Text style={[viewPointsManagerStyles.content.text, { opacity: .5, marginBottom: 0, fontSize: 15, marginHorizontal: 50, textAlign: 'center' }]}>{i18n.t('viewpointsManager.description')}</Text>
                </View>
              )
            }
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
