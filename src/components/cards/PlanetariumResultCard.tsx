import React, {ReactNode, useEffect, useState} from 'react'
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native'
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
import {planetariumResultCardStyles} from "../../styles/components/cards/planetariumResultCard";
import { useAuth } from '../../contexts/AuthContext';
import { sendAnalyticsEvent } from '../../helpers/scripts/analytics';
import { eventTypes } from '../../helpers/constants/analytics';
import { i18n } from '../../helpers/scripts/i18n';
import { searchResultCardStyles } from '../../styles/components/searchResultCard';
import DSOValues from '../commons/DSOValues';
import { objectCardLiteStyles } from '../../styles/components/cards/objectCardLite';
import { getWindDir } from '../../helpers/scripts/getWindDir';

interface PlanetariumResultCardProps {
  object: Star | DSO | GlobalPlanet
  onPress: () => void
  navigation: any
}

export default function PlanetariumResultCard({ object, onPress, navigation }: PlanetariumResultCardProps) {

  const {currentUser} = useAuth()
  const { currentLocale } = useTranslation()
  const { currentUserLocation } = useSettings()

  const [objectInfos, setObjectInfos] = useState<ComputedObjectInfos | null>(null)

  useEffect(() => {
    const observer = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }
    setObjectInfos(computeObject({ object, observer, lang: currentLocale, altitude: 341 }));
  }, [])


  const handleClickCard = () => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'select_planetarium_search_result', eventTypes.BUTTON_CLICK, { object_name: objectInfos?.base.name, type: objectInfos?.base.rawType }, currentLocale)
    onPress()
  }


  return (
    <TouchableOpacity onPress={handleClickCard}>
      <View style={objectCardLiteStyles.card}>
      {
        objectInfos ? (
          <>
            <Image source={getObjectIcon(object)} style={objectCardLiteStyles.card.icon} />
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
          </>
        ) : (
          <ActivityIndicator size={'large'} color={app_colors.white} />
        )
      }
      </View>
    </TouchableOpacity>
  )
}
