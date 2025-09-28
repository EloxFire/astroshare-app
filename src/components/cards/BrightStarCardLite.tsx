import React, {useEffect, useState} from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { objectCardLiteStyles } from '../../styles/components/cards/objectCardLite'
import { astroImages } from '../../helpers/scripts/loadImages'
import { routes } from '../../helpers/routes'
import { Star } from '../../helpers/types/Star'
import { getBrightStarName } from '../../helpers/scripts/astro/objects/getBrightStarName'
import {app_colors} from "../../helpers/constants";
import {useSettings} from "../../contexts/AppSettingsContext";
import {useSpot} from "../../contexts/ObservationSpotContext";
import {calculateHorizonAngle} from "../../helpers/scripts/astro/calculateHorizonAngle";
import {extractNumbers} from "../../helpers/scripts/extractNumbers";
import {EquatorialCoordinate, GeographicCoordinate, isBodyAboveHorizon} from "@observerly/astrometry";
import {convertHMSToDegreeFromString} from "../../helpers/scripts/astro/HmsToDegree";
import {convertDMSToDegreeFromString} from "../../helpers/scripts/astro/DmsToDegree";

interface BrightStarCardLiteProps {
  star: Star
  navigation: any
}

export default function BrightStarCardLite({ star, navigation }: BrightStarCardLiteProps) {

  const { currentUserLocation } = useSettings()
  const { selectedSpot, defaultAltitude } = useSpot()

  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    const altitude = selectedSpot ? selectedSpot.equipments.altitude : defaultAltitude;
    const degRa: number|undefined = star.ra
    const degDec: number|undefined = star.dec
    const horizonAngle: number = calculateHorizonAngle(extractNumbers(altitude))

    if (!degRa || !degDec || !horizonAngle) return;
    const target: EquatorialCoordinate = { ra: degRa, dec: degDec }
    const observer: GeographicCoordinate = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }

    const visible: boolean = isBodyAboveHorizon(new Date(), observer, target, horizonAngle)
    setIsVisible(visible)
  }, [])

  return (
    <TouchableOpacity onPress={() => navigation.push(routes.celestialBodies.details.path, { object: star })} style={objectCardLiteStyles.card}>
      <View style={[objectCardLiteStyles.card.visibility, {backgroundColor: isVisible ? app_colors.green : app_colors.red}]}/>
      <Image style={objectCardLiteStyles.card.image} source={astroImages['BRIGHTSTAR']} />
      <View style={objectCardLiteStyles.card.infos}>
        <Text style={objectCardLiteStyles.card.infos.title}>{getBrightStarName(star.ids)}</Text>
      </View>
    </TouchableOpacity>
  )
}
