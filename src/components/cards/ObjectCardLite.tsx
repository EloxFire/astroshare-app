import React, {useEffect, useState} from 'react'
import { DSO } from '../../helpers/types/DSO'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { app_colors } from '../../helpers/constants'
import { getObjectName } from '../../helpers/scripts/astro/getObjectName'
import { objectCardLiteStyles } from '../../styles/components/cards/objectCardLite'
import { astroImages } from '../../helpers/scripts/loadImages'
import { getConstellationName } from '../../helpers/scripts/getConstellationName'
import { prettyDec, prettyRa } from '../../helpers/scripts/astro/prettyCoords'
import { getObjectType } from '../../helpers/scripts/astro/getObjectType'
import { routes } from '../../helpers/routes'
import {useSettings} from "../../contexts/AppSettingsContext";
import {useSpot} from "../../contexts/ObservationSpotContext";
import {convertHMSToDegreeFromString} from "../../helpers/scripts/astro/HmsToDegree";
import {convertDMSToDegreeFromString} from "../../helpers/scripts/astro/DmsToDegree";
import {calculateHorizonAngle} from "../../helpers/scripts/astro/calculateHorizonAngle";
import {extractNumbers} from "../../helpers/scripts/extractNumbers";
import {EquatorialCoordinate, GeographicCoordinate, isBodyAboveHorizon} from "@observerly/astrometry";

interface ObjectCardLiteProps {
  object: DSO
  navigation: any
}

export default function ObjectCardLite({ object, navigation }: ObjectCardLiteProps) {

  const { currentUserLocation } = useSettings()
  const { selectedSpot, defaultAltitude } = useSpot()

  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    const altitude = selectedSpot ? selectedSpot.equipments.altitude : defaultAltitude;
    const degRa: number|undefined = convertHMSToDegreeFromString(object.ra)
    const degDec: number|undefined = convertDMSToDegreeFromString(object.dec)
    const horizonAngle: number = calculateHorizonAngle(extractNumbers(altitude))

    if (!degRa || !degDec || !horizonAngle) return;
    const target: EquatorialCoordinate = { ra: degRa, dec: degDec }
    const observer: GeographicCoordinate = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }

    const visible: boolean = isBodyAboveHorizon(new Date(), observer, target, horizonAngle)
    setIsVisible(visible)
  }, [])

  return (
    <TouchableOpacity onPress={() => navigation.push(routes.objectDetails.path, { object: object })} style={objectCardLiteStyles.card}>
      <View style={[objectCardLiteStyles.card.visibility, {backgroundColor: isVisible ? app_colors.green : app_colors.red}]}/>
      <Image style={objectCardLiteStyles.card.image} source={astroImages[object.type.toUpperCase()]} />
      <View style={objectCardLiteStyles.card.infos}>
        <Text style={objectCardLiteStyles.card.infos.title}>{getObjectName(object, 'all', true).toUpperCase()} {object.common_names.split(',')[0] !== '' && `(${object.common_names.split(',')[0]})`}</Text>
        <View style={objectCardLiteStyles.card.infos.data}>
          <View style={objectCardLiteStyles.card.infos.data.info}>
            <Text style={objectCardLiteStyles.card.infos.data.info.label}>Mag</Text>
            <Text style={objectCardLiteStyles.card.infos.data.info.value}>{object.b_mag || object.v_mag}</Text>
          </View>

          <View style={objectCardLiteStyles.card.infos.data.info}>
            <Text style={objectCardLiteStyles.card.infos.data.info.label}>Const</Text>
            <Text style={objectCardLiteStyles.card.infos.data.info.value}>{getConstellationName(object.const)}</Text>
          </View>

          <View style={objectCardLiteStyles.card.infos.data.info}>
            <Text style={objectCardLiteStyles.card.infos.data.info.label}>Type</Text>
            <Text style={objectCardLiteStyles.card.infos.data.info.value}>{object.type}</Text>
          </View>

        </View>
      </View>
    </TouchableOpacity>
  )
}
