import React, { useEffect, useState } from 'react'
import {ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View} from 'react-native'
import { globalStyles } from '../styles/global'
import { moonPhasesStyles } from '../styles/screens/moonPhases'
import {
  GeographicCoordinate,
  getBodyNextRise,
  getBodyNextSet,
  getLunarAge,
  getLunarDistance,
  getLunarElongation,
  getLunarEquatorialCoordinate,
  getLunarIllumination,
  getLunarPhase,
  isFullMoon,
  isNewMoon,
  isTransitInstance
} from '@observerly/astrometry'
import { calculateHorizonAngle } from '../helpers/scripts/astro/calculateHorizonAngle'
import { useSettings } from '../contexts/AppSettingsContext'
import dayjs from 'dayjs'
import PageTitle from '../components/commons/PageTitle'
import { i18n } from '../helpers/scripts/i18n'
import {useTranslation} from "../hooks/useTranslation";
import {ComputedMoonInfos} from "../helpers/types/objects/ComputedMoonInfos";
import {computeMoon} from "../helpers/scripts/astro/objects/computeMoon";
import MoonPreview from "../components/three/MoonPreview";

interface MoonData {
  phase: string,
  illumination: string,
  distance: number,
  elongation: number,
  newMoon: boolean,
  fullMoon: boolean,
  age: number
  moonrise: string,
  moonset: string
}


export default function MoonPhases({ navigation }: any) {

  const { currentUserLocation } = useSettings()
  const {currentLocale} = useTranslation()
  dayjs().locale(currentLocale)

  const [moonData, setMoonData] = useState<ComputedMoonInfos | null>(null)
  const [currentDate, setCurrentDate] = useState(dayjs())

  useEffect(() => {
    const observer: GeographicCoordinate = {latitude: currentUserLocation.lat, longitude: currentUserLocation.lon}
    setMoonData(computeMoon({date: new Date(), observer}))
  }, [currentUserLocation])

  useEffect(() => {
    setCurrentDate(dayjs())

    const interval = setInterval(() => {
      setCurrentDate(dayjs())
    }, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title={i18n.t('home.buttons.moon_phases.title')} subtitle={i18n.t('home.buttons.moon_phases.subtitle')} />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={moonPhasesStyles.content}>
          <View style={moonPhasesStyles.content.header}>
            <View style={moonPhasesStyles.content.header.transitCard}>
              <Image source={require('../../assets/icons/FiMoonrise.png')} style={moonPhasesStyles.content.header.transitCard.icon} />
              {moonData ? <Text style={moonPhasesStyles.content.header.transitCard.text}>{moonData.visibility.objectNextRise}</Text> : <ActivityIndicator size={"small"} />}
            </View>
            <View>
              <Text style={moonPhasesStyles.content.header.transitCard.text}>{currentDate.format('DD MMMM YYYY')}</Text>
              <Text style={moonPhasesStyles.content.header.transitCard.text}>{currentDate.format('HH:mm:ss')}</Text>
            </View>
            <View style={moonPhasesStyles.content.header.transitCard}>
              <Image source={require('../../assets/icons/FiMoonset.png')} style={moonPhasesStyles.content.header.transitCard.icon} />
              {moonData ? <Text style={moonPhasesStyles.content.header.transitCard.text}>{moonData.visibility.objectNextSet}</Text> : <ActivityIndicator size={"small"} />}
            </View>
          </View>
          <View style={moonPhasesStyles.content.body}>
            <MoonPreview size={Dimensions.get('window').width - 40}/>
          </View>
          <View style={moonPhasesStyles.content.footer}>

          </View>
        </View>
      </ScrollView>
    </View>
  )
}
