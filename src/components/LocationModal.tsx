import React from 'react'
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native'
import { app_colors } from '../helpers/constants'
import { locationHeaderStyles } from '../styles/components/locationHeader'
import { LocationObject } from '../helpers/types/LocationObject'
import BigValue from './commons/BigValue'
import { useSpot } from '../contexts/ObservationSpotContext'

interface LocationModalProps {
  visible: boolean
  onClose: () => void
  coords: LocationObject
}

export default function LocationModal({ visible, onClose, coords }: LocationModalProps) {

  const { defaultAltitude, selectedSpot } = useSpot()


  return (
    <Modal animationType='slide' visible={visible} transparent>
      <View style={locationHeaderStyles.modal}>
        <View style={locationHeaderStyles.modal.header}>
          <Text style={locationHeaderStyles.modal.header.title}>Votre position</Text>
          <TouchableOpacity onPress={() => onClose()}>
            <Image source={require('../../assets/icons/FiXCircle.png')} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        </View>
        <View style={locationHeaderStyles.modal.body}>
          <View style={locationHeaderStyles.modal.body.column}>
            <BigValue value={`${coords?.lat}${coords?.dms ? " - " + coords?.dms.dms_lat : ''}`} label='Latitude' />
            <BigValue value={`${coords?.lon}${coords?.dms ? " - " + coords?.dms.dms_lon : ''}`} label='Longitude' />
            <BigValue value={selectedSpot ? selectedSpot.equipments.altitude : `${defaultAltitude} (altitude par défaut)`} label={`Altitude`} />
          </View>
          <View style={locationHeaderStyles.modal.body.column}>
            <BigValue value={coords?.common_name ? coords?.common_name : "N/A"} label='Lieu' />
            <BigValue value={coords?.country ? coords?.country : 'N/A'} label='Pays' />
          </View>
        </View>
      </View>
    </Modal>
  )
}
