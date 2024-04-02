import React from 'react'
import { Modal, Text, View } from 'react-native'
import { app_colors } from '../helpers/constants'
import { locationHeaderStyles } from '../styles/components/locationHeader'

interface LocationModalProps {
  visible: boolean
  onClose: () => void
}

export default function LocationModal({visible, onClose}: LocationModalProps) {
  return (
    <Modal animationType='slide' visible={visible} transparent>
      <View  style={locationHeaderStyles.modal}>
        <Text style={{color: app_colors.white}}>Modal</Text>
      </View>
    </Modal>
  )
}
