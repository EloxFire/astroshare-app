import React, {useEffect, useState} from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { objectCardLiteStyles } from '../../styles/components/cards/objectCardLite'
import { astroImages } from '../../helpers/scripts/loadImages'
import { routes } from '../../helpers/routes'
import { GlobalPlanet } from '../../helpers/types/GlobalPlanet'
import { i18n } from '../../helpers/scripts/i18n'
import {app_colors} from "../../helpers/constants";
import {useSettings} from "../../contexts/AppSettingsContext";
import {useSpot} from "../../contexts/ObservationSpotContext";
import {calculateHorizonAngle} from "../../helpers/scripts/astro/calculateHorizonAngle";
import {extractNumbers} from "../../helpers/scripts/extractNumbers";
import {EquatorialCoordinate, GeographicCoordinate, isBodyAboveHorizon} from "@observerly/astrometry";

interface PlanetCardLiteProps {
  planet: GlobalPlanet
  navigation: any
}

export default function PlanetCardLite({ planet, navigation }: PlanetCardLiteProps) {


  const { currentUserLocation } = useSettings()
  const { selectedSpot, defaultAltitude } = useSpot()

  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    const altitude = selectedSpot ? selectedSpot.equipments.altitude : defaultAltitude;
    const degRa: number|undefined = planet.ra
    const degDec: number|undefined = planet.dec
    const horizonAngle: number = calculateHorizonAngle(extractNumbers(altitude))

    if (!degRa || !degDec || !horizonAngle) return;
    const target: EquatorialCoordinate = { ra: degRa, dec: degDec }
    const observer: GeographicCoordinate = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }

    const visible: boolean = isBodyAboveHorizon(new Date(), observer, target, horizonAngle)
    setIsVisible(visible)
  }, [])

  return (
    <TouchableOpacity onPress={() => navigation.push(routes.celestialBodies.details.path, { object: planet })} style={objectCardLiteStyles.card}>
      <View style={[objectCardLiteStyles.card.visibility, {backgroundColor: isVisible ? app_colors.green : app_colors.red}]}/>
      <Image style={objectCardLiteStyles.card.image} source={astroImages[planet.name.toUpperCase()]} />
      <View style={objectCardLiteStyles.card.infos}>
        <Text style={objectCardLiteStyles.card.infos.title}>{i18n.t(`common.planets.${planet.name}`).toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  )
}
