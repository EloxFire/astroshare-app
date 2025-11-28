import React, { ReactNode, useEffect, useState } from 'react'
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'
import { searchResultCardStyles } from '../../styles/components/searchResultCard'
import { DSO } from '../../helpers/types/DSO'
import { astroImages, planetsImages } from '../../helpers/scripts/loadImages'
import { useSettings } from '../../contexts/AppSettingsContext'
import { app_colors } from '../../helpers/constants'
import { routes } from '../../helpers/routes'
import { i18n } from '../../helpers/scripts/i18n'
import { useTranslation } from '../../hooks/useTranslation'
import { useAuth } from '../../contexts/AuthContext'
import { sendAnalyticsEvent } from '../../helpers/scripts/analytics'
import { eventTypes } from '../../helpers/constants/analytics'
import { ComputedObjectInfos } from '../../helpers/types/objects/ComputedObjectInfos'
import { computeObject } from '../../helpers/scripts/astro/objects/computeObject'
import { Star } from '../../helpers/types/Star'
import { GlobalPlanet } from '../../helpers/types/GlobalPlanet'
import DSOValues from '../commons/DSOValues'

interface SearchResultCardProps {
  object: DSO | GlobalPlanet | Star
  navigation: any
}

export default function SearchResultCard({ object, navigation }: SearchResultCardProps) {

  const {currentUser} = useAuth()
  const { currentLocale } = useTranslation()
  const { currentUserLocation } = useSettings()

  const [objectInfos, setObjectInfos] = useState<ComputedObjectInfos | null>(null)

  useEffect(() => {
    const observer = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }
    setObjectInfos(computeObject({ object, observer, lang: currentLocale, altitude: 341 }));
  }, [])


  const handleClickCard = () => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'select_search_result', eventTypes.BUTTON_CLICK, { object_name: objectInfos?.base.name, type: objectInfos?.base.rawType }, currentLocale)
    navigation.push(routes.celestialBodies.details.path, { object: object })
  }

  const renderNeededEphemeris = (): ReactNode => {
    if (!objectInfos) return null;

    if(objectInfos.visibilityInfos.isCircumpolar) {
      return i18n.t('common.visibility.circumpolar')
    }

    if(!objectInfos.visibilityInfos.isVisibleThisNight) {
      return i18n.t('common.visibility.notVisible')
    }

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <Image style={{width: 10, height: 10}} source={require('../../../assets/icons/FiSunrise.png')} />
        <Text style={{ color: app_colors.white, fontFamily: 'GiloryRegular', fontSize: 12 }}>{objectInfos.visibilityInfos.objectNextRise?.format('HH:mm')}</Text>
        <Image style={{width: 10, height: 10, marginLeft: 10}} source={require('../../../assets/icons/FiSunset.png')} />
        <Text style={{ color: app_colors.white, fontFamily: 'GiloryRegular', fontSize: 12 }}>{objectInfos.visibilityInfos.objectNextSet?.format('HH:mm')}</Text>
      </View>
    )
  }


  return (
    <TouchableOpacity onPress={handleClickCard}>
      <View style={searchResultCardStyles.card}>
      {
        objectInfos ? (
          <>
            <View style={searchResultCardStyles.card.header}>
              <View>
                <Text style={searchResultCardStyles.card.header.title}>{objectInfos.base.name}</Text>
                <Text style={searchResultCardStyles.card.header.subtitle}>{objectInfos.base.otherName}</Text>
              </View>
              {
                objectInfos.base.family === 'Planet' && (
                  <Image style={searchResultCardStyles.card.image} source={astroImages[objectInfos?.base.name.toUpperCase()]} />
                ) 
              } 
              {
                objectInfos.base.family === 'DSO' && (
                  <Image style={searchResultCardStyles.card.image} source={astroImages[objectInfos.base.rawType.toUpperCase()]} />
                )
              }
              {
                objectInfos.base.family === 'Star' && (
                  <Image style={searchResultCardStyles.card.image} source={astroImages['BRIGHTSTAR']} />
                )
              }
            </View>
            <View style={searchResultCardStyles.card.body}>
              <DSOValues small title={i18n.t('detailsPages.dso.labels.magnitude')} value={objectInfos.base.mag} />
              <DSOValues small title={i18n.t('detailsPages.dso.labels.constellation')} value={objectInfos.base.constellation} />
              {
                objectInfos.base.family === 'Planet' ? (
                  <DSOValues small title={i18n.t('detailsPages.planets.labels.distanceSun')} value={objectInfos.planetAdditionalInfos?.distanceToSun} />
                ) : (
                  <DSOValues small title={i18n.t('detailsPages.dso.labels.type')} value={objectInfos.base.type} />
                )
              }
              <DSOValues small title={i18n.t('common.visibility.title')} value={renderNeededEphemeris()} />
            </View>
            <View style={searchResultCardStyles.card.footer}>
              <Text style={[searchResultCardStyles.card.footer.chip, { backgroundColor: objectInfos.visibilityInfos.isCurrentlyVisible ? app_colors.green_eighty : app_colors.red_eighty }]}>{objectInfos.visibilityInfos.isCurrentlyVisible ? i18n.t('common.visibility.visible') : i18n.t('common.visibility.notVisible')}</Text>
              <Text style={[searchResultCardStyles.card.footer.chip, { backgroundColor: app_colors.white_forty, color: app_colors.white }]}>{i18n.t('common.other.more')}</Text>
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
