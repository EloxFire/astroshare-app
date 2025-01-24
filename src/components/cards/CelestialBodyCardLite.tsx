import React, {useEffect, useState} from 'react'
import { TouchableOpacity } from 'react-native'
import { objectCardLiteStyles } from '../../styles/components/cards/objectCardLite'
import { routes } from '../../helpers/routes'
import { Star } from '../../helpers/types/Star'
import {useSettings} from "../../contexts/AppSettingsContext";
import {ComputedObjectInfos} from "../../helpers/types/objects/ComputedObjectInfos";
import {computeObject} from "../../helpers/scripts/astro/objects/computeObject";
import {useTranslation} from "../../hooks/useTranslation";
import {GlobalPlanet} from "../../helpers/types/GlobalPlanet";
import {DSO} from "../../helpers/types/DSO";

interface CelestialBodyCardLiteProps {
  object: Star | DSO | GlobalPlanet
  navigation: any
}

export default function CelestialBodyCardLite({ object, navigation }: CelestialBodyCardLiteProps) {

  const { currentUserLocation } = useSettings()
  const { currentLocale } = useTranslation()
  const [objectInfos, setObjectInfos] = useState<ComputedObjectInfos | null>(null)

  useEffect(() => {
    const observer = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }
    setObjectInfos(computeObject({ object, observer, lang: currentLocale, altitude: 341 }));
  }, [])

  return (
    <TouchableOpacity onPress={() => navigation.push(routes.celestialBodies.details.path, { object: object })} style={objectCardLiteStyles.card}>

    </TouchableOpacity>
  )
}
