import React, { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { viewPointsManagerStyles } from '../styles/screens/viewPointsManager'
import { globalStyles } from '../styles/global'
import { TViewPoint } from '../helpers/types/ViewPoint'
import { useSpot } from '../contexts/ObservationSpotContext'
import { i18n } from '../helpers/scripts/i18n'
import SimpleButton from '../components/commons/buttons/SimpleButton'
import PageTitle from '../components/commons/PageTitle'
import ViewPoint from '../components/ViewPoint'
import AddSpotModal from '../components/modals/AddSpotModal'
import DeleteSpotModal from '../components/modals/DeleteSpotModal'
import ScreenInfo from '../components/ScreenInfo'
import DisclaimerBar from "../components/banners/DisclaimerBar";

export default function ViewPointsManager({ navigation }: any) {

  const { viewPoints, selectedSpot } = useSpot()

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [isDeleteModalVisible, setDeleteModalVisible] = useState<boolean>(false)


  return (
    <View style={globalStyles.body}>
      {isModalVisible && <AddSpotModal onClose={() => setIsModalVisible(false)} />}
      {isDeleteModalVisible && <DeleteSpotModal onClose={() => setDeleteModalVisible(false)} />}
      <PageTitle navigation={navigation} title={i18n.t('viewpointsManager.title')} subtitle={i18n.t('viewpointsManager.subtitle')} />
      <View style={globalStyles.screens.separator} />
      <DisclaimerBar message={i18n.t('viewpointsManager.disclaimer')} type={'info'} />
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
                <ScreenInfo image={require('../../assets/icons/FiViewPoint.png')} text={i18n.t('viewpointsManager.description')} />
              )
            }
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
