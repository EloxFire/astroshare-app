import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useSettings } from '../../contexts/AppSettingsContext'
import { getData } from '../../helpers/storage'
import DisclaimerBar from './DisclaimerBar'

export default function BannerHandler() {

  const { hasInternetConnection } = useSettings()
  const [hasChangedSpotElevation, setHasChangedSpotElevation] = useState<boolean>(false)
  const [hasAddedSpot, setHasAddedSpot] = useState<boolean>(false)
  
  useEffect(() => {
    (async () => {
      const changedCurrentElevation = await getData('hasChangedCurrentSpotElevation')
      const addedSpot = await getData('hasAddedSpot')
      if (changedCurrentElevation === 'true') setHasChangedSpotElevation(true);
      if (addedSpot === 'true') setHasAddedSpot(true);
    })()
  }, [])

  return (
    <View style={{display: 'flex', flexDirection: 'column', gap: 5}}>
      {
        !hasInternetConnection &&
        <DisclaimerBar message="Aucune connexion à internet. Fonctionnalités réduites." type='error' />
      }
      {/* <SkyInfosBar /> */}
      {/* {
        !hasChangedSpotElevation &&
        <DisclaimerBar message="Précisez votre lieu d'observation en renseigant une altitude dans les paramètres !" type='info' />
      } */}
      {
        !hasAddedSpot &&
        <DisclaimerBar message="Ajoutez vos lieux d'observation favoris depuis les paramètres ! Paramètres > Lieux d'observation > Ajouter un lieu." type='info' />
      }
    </View>
  )
}
