import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { toggleButtonStyles } from '../../../styles/components/commons/buttons/toggleButton'

interface toggleButtonProps {
  title: string
  onToggle?: () => void
  toggled?: boolean
}

export default function ToggleButton({ title, onToggle, toggled }: toggleButtonProps) {
  return (
    <View style={toggleButtonStyles.toggleButton}>
      <Text style={toggleButtonStyles.toggleButton.title}>{title}</Text>
      <TouchableOpacity onPress={onToggle}>
        {
          !toggled ?
            <Image source={require('../../../../assets/icons/FiToggleEmpty.png')} style={toggleButtonStyles.toggleButton.image} />
            :
            <Image source={require('../../../../assets/icons/FiToggleFilled.png')} style={toggleButtonStyles.toggleButton.image} />
        }
      </TouchableOpacity>
    </View>
  )
}
