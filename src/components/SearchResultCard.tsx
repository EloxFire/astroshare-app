import React, { useEffect, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { searchResultCardStyles } from '../styles/components/searchResultCard'
import { DSO } from '../helpers/types/DSO'
import { getObjectName } from '../helpers/scripts/astro/getObjectName'
import { astroImages } from '../helpers/scripts/loadImages'
import { getConstellationName } from '../helpers/scripts/getConstellationName'
import { EquatorialCoordinate, GeographicCoordinate, TransitInstance, getBodyNextRise, getBodyNextSet, isBodyAboveHorizon, isBodyCircumpolar, isBodyVisibleForNight, isTransitInstance } from '@observerly/astrometry'
import { useSettings } from '../contexts/AppSettingsContext'
import { app_colors } from '../helpers/constants'
import { routes } from '../helpers/routes'
import { convertDMSToDegreeFromString } from '../helpers/scripts/astro/DmsToDegree'
import { convertHMSToDegreeFromString } from '../helpers/scripts/astro/HmsToDegree'
import { calculateHorizonAngle } from '../helpers/scripts/astro/calculateHorizonAngle'
import { useSpot } from '../contexts/ObservationSpotContext'
import { extractNumbers } from '../helpers/scripts/extractNumbers'
import dayjs, { Dayjs } from 'dayjs'
import { prettyDec, prettyRa } from '../helpers/scripts/astro/prettyCoords'

interface SearchResultCardProps {
  object: DSO
  navigation: any
}

export default function SearchResultCard({ object, navigation }: SearchResultCardProps) {

  const { selectedSpot, defaultAltitude } = useSpot()
  const { currentUserLocation } = useSettings()
  const [isVisible, setIsVisible] = useState(false)
  const [riseTime, setRiseTime] = useState<Dayjs | boolean>(false)
  const [setTime, setSetTime] = useState<Dayjs | boolean>(false)
  const [willRise, setWillRise] = useState<boolean>(false)
  const [isCircumpolar, setIsCircumpolar] = useState<boolean>(false)

  useEffect(() => {
    const altitude = selectedSpot ? selectedSpot.equipments.altitude : defaultAltitude; // 342m est l'altitude moyenne en France métropolitaine
    const degRa = convertHMSToDegreeFromString(object.ra)
    const degDec = convertDMSToDegreeFromString(object.dec)
    const horizonAngle = calculateHorizonAngle(extractNumbers(altitude))

    if (degRa && degDec) {
      const observer: GeographicCoordinate = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }
      const target: EquatorialCoordinate = { ra: degRa, dec: degDec }
      let visible = isBodyAboveHorizon(new Date(), observer, target, horizonAngle)
      setIsVisible(visible)


      setWillRise(isBodyVisibleForNight(new Date(), observer, target, horizonAngle))
      setIsCircumpolar(isBodyCircumpolar(observer, target, horizonAngle))

      if (!isCircumpolar) {
        let rise = getBodyNextRise(new Date(), observer, target, horizonAngle)
        let set = getBodyNextSet(new Date(), observer, target, horizonAngle)

        if (isTransitInstance(rise)) {
          setRiseTime(dayjs(rise.datetime))
        }
        if (isTransitInstance(set)) {
          setSetTime(dayjs(set.datetime))
        }
      }
    }
  }, [])


  return (
    <TouchableOpacity onPress={() => navigation.navigate(routes.objectDetails.path, { object: object })}>
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
            <Text style={searchResultCardStyles.card.body.info.value}>{prettyRa(object.ra)}</Text>
          </View>
          <View style={searchResultCardStyles.card.body.info}>
            <Text style={searchResultCardStyles.card.body.info.title}>Déclinaison :</Text>
            <Text style={searchResultCardStyles.card.body.info.value}>{prettyDec(object.dec)}</Text>
          </View>
        </View>
        <View style={searchResultCardStyles.card.footer}>
          <Text style={[searchResultCardStyles.card.footer.chip, { backgroundColor: isVisible ? app_colors.green_eighty : app_colors.red_eighty }]}>{isVisible ? `Visible` : "Non visible"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
