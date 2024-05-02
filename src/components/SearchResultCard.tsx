import React, { useEffect, useState } from 'react'
import { Image, Text, View } from 'react-native'
import { searchResultCardStyles } from '../styles/components/searchResultCard'
import { DSO } from '../helpers/types/DSO'
import { getObjectName } from '../helpers/scripts/astro/getObjectName'
import { astroImages } from '../helpers/scripts/loadImages'
import { getConstellationName } from '../helpers/scripts/getConstellationName'
import { isBodyVisible } from '@observerly/astrometry'
import { useSettings } from '../contexts/AppSettingsContext'
import { HmsToDegree } from '../helpers/scripts/astro/HmsToDegree'
import { app_colors } from '../helpers/constants'

interface SearchResultCardProps {
  object: DSO
}

export default function SearchResultCard({ object }: SearchResultCardProps) {
  const {currentUserLocation} = useSettings()
  const [isVisible, setIsVisible] = useState(false) 

  useEffect(() => {
    const degRa = HmsToDegree(object.ra, 'ra')
    const degDec = HmsToDegree(object.dec, 'dec')   
    let visible = isBodyVisible({ latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, { ra: degRa, dec: degDec }, (90 - currentUserLocation.lat))
    setIsVisible(visible)
  })
  

  return (
    <View style={searchResultCardStyles.card}>
      <View style={searchResultCardStyles.card.header}>
        <View>
          <Text style={searchResultCardStyles.card.header.title}>{getObjectName(object, 'all', true).toUpperCase()}</Text>
          <Text style={searchResultCardStyles.card.header.subtitle}>{object.common_names.split(',')[0]}</Text>
        </View>
        <Image style={searchResultCardStyles.card.image} source={astroImages[object.type.toUpperCase()]} />
      </View>
      <View style={searchResultCardStyles.card.body}>
        <View style={searchResultCardStyles.card.body.info}>
          <Text style={searchResultCardStyles.card.body.info.title}>Magnitude :</Text>
          <Text style={searchResultCardStyles.card.body.info.value}>{object.b_mag || object.v_mag}</Text>
        </View>
        <View style={searchResultCardStyles.card.body.info}>
          <Text style={searchResultCardStyles.card.body.info.title}>Constellation :</Text>
          <Text style={searchResultCardStyles.card.body.info.value}>{getConstellationName(object.const)}</Text>
        </View>
        <View style={searchResultCardStyles.card.body.info}>
          <Text style={searchResultCardStyles.card.body.info.title}>Ascension droite :</Text>
          <Text style={searchResultCardStyles.card.body.info.value}>{object.ra}</Text>
        </View>
        <View style={searchResultCardStyles.card.body.info}>
          <Text style={searchResultCardStyles.card.body.info.title}>Déclinaison :</Text>
          <Text style={searchResultCardStyles.card.body.info.value}>{object.dec}</Text>
        </View>
      </View>
      <Text style={[searchResultCardStyles.card.chip, {backgroundColor: isVisible ? app_colors.green_eighty : app_colors.red_eighty}]}>{isVisible ? "Visible" : "Non visible"}</Text>
    </View>
  )
}
