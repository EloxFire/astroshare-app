import React, {useEffect, useState} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import { objectCardLiteStyles } from '../../styles/components/cards/objectCardLite'
import { routes } from '../../helpers/routes'
import { Star } from '../../helpers/types/Star'
import {useSettings} from "../../contexts/AppSettingsContext";
import {ComputedObjectInfos} from "../../helpers/types/objects/ComputedObjectInfos";
import {computeObject} from "../../helpers/scripts/astro/objects/computeObject";
import {useTranslation} from "../../hooks/useTranslation";
import {GlobalPlanet} from "../../helpers/types/GlobalPlanet";
import {DSO} from "../../helpers/types/DSO";
import {Image} from "expo-image";
import {getObjectIcon} from "../../helpers/scripts/astro/objects/getObjectIcon";
import {getObjectName} from "../../helpers/scripts/astro/objects/getObjectName";
import SimpleBadge from "../badges/SimpleBadge";
import {getObjectFamily} from "../../helpers/scripts/astro/objects/getObjectFamily";
import {app_colors} from "../../helpers/constants";
import {astroImages} from "../../helpers/scripts/loadImages";

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
      <Image source={getObjectIcon(object)} style={objectCardLiteStyles.card.icon} />
      <View style={objectCardLiteStyles.card.data}>
        <Text style={objectCardLiteStyles.card.data.title}>{getObjectName(object, 'all', true)}</Text>
        {
          objectInfos && (
            <View style={objectCardLiteStyles.card.data.badges}>
              <SimpleBadge
                text={objectInfos.visibilityInfos.visibilityLabel}
                icon={objectInfos.visibilityInfos.visibilityIcon}
                backgroundColor={objectInfos.visibilityInfos.visibilityBackgroundColor}
                foregroundColor={objectInfos.visibilityInfos.visibilityForegroundColor}
              />
              {
                getObjectFamily(object) === 'DSO' && (object as DSO).m !== "" && (
                  <>
                    <SimpleBadge
                      text={((object) as DSO).name}
                    />
                    <SimpleBadge
                      text={((object) as DSO).const}
                      icon={astroImages['CONSTELLATION']}
                      iconColor={app_colors.white}
                    />
                  </>

                )
              }
              {
                objectInfos.base.common_name !== "" && (
                  <SimpleBadge
                    text={((object) as DSO).type}
                  />
                )
              }
              {
                getObjectFamily(object) !== 'DSO' && objectInfos && (
                  <>
                    <SimpleBadge
                      text={objectInfos.base.alt}
                      icon={require('../../../assets/icons/FiAngleRight.png')}
                    />
                    <SimpleBadge
                      text={objectInfos.base.az}
                      icon={require('../../../assets/icons/FiCompass.png')}
                    />
                  </>

                )
              }
            </View>
          )
        }
      </View>
    </TouchableOpacity>
  )
}
