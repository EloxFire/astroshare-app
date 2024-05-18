import React, { useEffect, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { addSpotModalStyles } from '../../styles/components/modals/addSpotModal'
import { app_colors } from '../../helpers/constants'
import SimpleButton from '../commons/buttons/SimpleButton'
import DisclaimerBar from '../banners/DisclaimerBar'
import { getObject } from '../../helpers/storage'
import { useSpot } from '../../contexts/ObservationSpotContext'

interface AddSpotModalProps {
  onClose: () => void
}

export default function DeleteSpotModal({ onClose }: AddSpotModalProps) {

  const { deleteSpot } = useSpot()
  const [spotTitles, setSpotTitles] = useState<string[]>([])

  useEffect(() => {
    getSpots()
  })

  const getSpots = async () => {
    const spots = await getObject('viewPoints')
    const titles = spots.map((spot: any) => spot.title)

    setSpotTitles(titles)
  }

  return (
    <View style={addSpotModalStyles.modal}>
      <View style={addSpotModalStyles.modal.content}>
        <View style={addSpotModalStyles.modal.content.header}>
          <Text style={addSpotModalStyles.modal.content.header.title}>Supprimer un lieu d'observation</Text>
          <TouchableOpacity onPress={onClose}>
            <Image style={addSpotModalStyles.modal.content.header.icon} source={require('../../../assets/icons/FiXCircle.png')} />
          </TouchableOpacity>
        </View>
        <DisclaimerBar message="Supprimer un lieu est une action irréversible." type='error' />

        <View style={{marginVertical: 20}}>
          {spotTitles.map((title: string, index: number) => (
            <View key={`spot-title-${index}`} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10}}>
              <Text style={{color: app_colors.white, fontSize: 18, fontFamily: 'GilroyMedium'}}>{title}</Text>
              <SimpleButton textColor={app_colors.red_eighty} text="Supprimer" onPress={() => deleteSpot(title)} />
            </View>
          ))}
        </View>

        <SimpleButton text="Retour" onPress={onClose} />
      </View>
    </View>
  )
}
