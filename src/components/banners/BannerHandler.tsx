import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useSettings } from '../../contexts/AppSettingsContext'
import { getData } from '../../helpers/storage'
import DisclaimerBar from './DisclaimerBar'

export default function BannerHandler() {

  const { hasInternetConnection } = useSettings()
  const [hasChangedSpotElevation, setHasChangedSpotElevation] = useState<boolean>(false)
  
  useEffect(() => {
    (async () => {
      const changed = await getData('hasChangedSpotElevation')
      if (changed === 'true') {
        setHasChangedSpotElevation(true)
      }
    })()
  }, [])

  return (
    <View>
      {
        !hasInternetConnection &&
        <DisclaimerBar message="Aucune connexion à internet. Fonctionnalités réduites." type='error' />
      }
      {/* <SkyInfosBar /> */}
      {
        !hasChangedSpotElevation &&
        <DisclaimerBar message="Précisez votre lieu d'observation en renseigant une altitude dans les paramètres !" type='info' />
      }
    </View>
  )
}
