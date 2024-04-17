import React from 'react'
import { Image, TouchableOpacity } from 'react-native'
import { refreshButtonStyles } from '../../../styles/components/commons/buttons/refreshButton'

interface RefreshButtonProps {
  action: () => void
  size?: 'small' | 'medium' | 'large'
}

export default function RefreshButton({ action, size }: RefreshButtonProps) {
  return (
    <TouchableOpacity style={refreshButtonStyles.button} onPress={() => action()}>
      <Image source={require('../../../../assets/icons/FiRepeat.png')} style={refreshButtonStyles.button.icon} />
    </TouchableOpacity>
  )
}
