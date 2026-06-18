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
import {SpecialSkyObject} from "../../helpers/types/SpecialSkyObject";
import {Image} from "expo-image";
import {getObjectIcon} from "../../helpers/scripts/astro/objects/getObjectIcon";
import {getObjectName} from "../../helpers/scripts/astro/objects/getObjectName";
import SimpleBadge from "../badges/SimpleBadge";
import {getObjectFamily} from "../../helpers/scripts/astro/objects/getObjectFamily";
import {app_colors} from "../../helpers/constants";
import {astroImages} from "../../helpers/scripts/loadImages";
import {getWindDir} from "../../helpers/scripts/getWindDir";
import {astroshareApi} from "../../helpers/api";
import dayjs from "dayjs";

interface CelestialBodyCardLiteProps {
  object: Star | DSO | GlobalPlanet | SpecialSkyObject
  navigation: any
}

export default function CelestialBodyCardLite({ object, navigation }: CelestialBodyCardLiteProps) {

  const { currentUserLocation } = useSettings()
  const { currentLocale } = useTranslation()
  const [objectInfos, setObjectInfos] = useState<ComputedObjectInfos | null>(null)
  const [moonImageSource, setMoonImageSource] = useState<{ uri: string } | null>(null)

  useEffect(() => {
    if (!currentUserLocation) return;

    const recomputeObjectInfos = () => {
      const observer = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }
      setObjectInfos(computeObject({ object, observer, lang: currentLocale, altitude: 341 }));
    };

    recomputeObjectInfos();
    const interval = setInterval(recomputeObjectInfos, 60000);

    return () => clearInterval(interval);
  }, [object, currentLocale, currentUserLocation])

  useEffect(() => {
    if ((object as SpecialSkyObject).family !== 'Moon') return;
    let cancelled = false;
    astroshareApi.get('/moon/illustration?date=' + dayjs().format('YYYY-MM-DD'))
      .then(res => { if (!cancelled) setMoonImageSource({ uri: res.data.url }); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [object])

  return (
    <TouchableOpacity onPress={() => navigation.push(routes.celestialBodies.details.path, { object: object })} style={objectCardLiteStyles.card}>
      <Image source={moonImageSource ?? getObjectIcon(object)} style={objectCardLiteStyles.card.icon} />
      <View style={objectCardLiteStyles.card.data}>
        {
          objectInfos?.base.otherName ? (
            <View style={[objectCardLiteStyles.card.header, {flexDirection: 'row', alignItems: 'center', gap: 5}]}>
              <Text style={objectCardLiteStyles.card.data.title}>{objectInfos?.base.otherName || ''}</Text>
              <Text style={objectCardLiteStyles.card.data.subtitle}>({getObjectName(object, 'all', false)})</Text>
            </View>
          ) : (
            <View style={[objectCardLiteStyles.card.header, {flexDirection: 'row', gap: 5}]}>
              <Text style={objectCardLiteStyles.card.data.title}>{objectInfos?.base.name}</Text>
            </View>
          )
        }
        {
          objectInfos && (
            <View style={objectCardLiteStyles.card.data.badges}>
              <SimpleBadge
                text={objectInfos.visibilityInfos.visibilityLabel}
                icon={objectInfos.visibilityInfos.visibilityIcon}
                backgroundColor={objectInfos.visibilityInfos.visibilityBackgroundColor}
                foregroundColor={objectInfos.visibilityInfos.visibilityForegroundColor}
                noBorder
                small
              />
              {
                getObjectFamily(object) === 'DSO' && (object as DSO).m !== "" && (
                  <SimpleBadge
                    text={((object) as DSO).const}
                    icon={astroImages['CONSTELLATION']}
                    iconColor={app_colors.white}
                    small
                  />
                )
              }
              {
                objectInfos && (
                  <>
                    <SimpleBadge
                      text={objectInfos.base.alt}
                      icon={require('../../../assets/icons/FiAngleRight.png')}
                    />
                    <SimpleBadge
                      text={getWindDir(parseFloat(objectInfos.base.az))}
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
