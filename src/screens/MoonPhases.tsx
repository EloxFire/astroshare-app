import React, { useEffect, useState } from 'react'
import {ActivityIndicator, Image, ScrollView, Text, View, StyleSheet} from 'react-native'
import { globalStyles } from '../styles/global'
import { moonPhasesStyles } from '../styles/screens/moonPhases'
import {
  GeographicCoordinate,
} from '@observerly/astrometry'
import { useSettings } from '../contexts/AppSettingsContext'
import dayjs from 'dayjs'
import PageTitle from '../components/commons/PageTitle'
import { i18n } from '../helpers/scripts/i18n'
import {useTranslation} from "../hooks/useTranslation";
import {ComputedMoonInfos} from "../helpers/types/objects/ComputedMoonInfos";
import {computeMoon} from "../helpers/scripts/astro/objects/computeMoon";
import VisibilityGraph from "../components/graphs/VisibilityGraph";
import {formatDays, formatKm} from "../helpers/scripts/utils/formatters/formaters";
import {astroshareApi} from "../helpers/api";

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
  const {currentLocale, currentLCID} = useTranslation()
  dayjs().locale(currentLocale)

  const [moonData, setMoonData] = useState<ComputedMoonInfos | null>(null)
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [moonImageUrl, setMoonImageUrl] = useState<undefined | {uri: string }>({uri: `${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/moon/illustration`})

  useEffect(() => {
    const observer: GeographicCoordinate = {latitude: currentUserLocation.lat, longitude: currentUserLocation.lon}
    const data: ComputedMoonInfos = computeMoon({date: new Date(), observer})
    setMoonData(data)
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
          {
            moonData && (
              <>
                <View style={moonPhasesStyles.content.body}>
                  <Text style={moonPhasesStyles.content.body.phaseTitle}>{moonData.data.phase}</Text>
                  <Image source={moonImageUrl} style={moonPhasesStyles.content.body.icon}/>
                  {/*MOON PHASE HERE*/}
                  <View style={moonPhasesStyles.content.body.infos}>
                    <View>
                      <Text style={moonPhasesStyles.content.body.infos.info.label}>{i18n.t('moonPhases.pills.illumination')}</Text>
                      <Text style={moonPhasesStyles.content.body.infos.info.value}>{moonData.data.illumination.toFixed((2))}%</Text>
                    </View>
                    <View>
                      <Text style={moonPhasesStyles.content.body.infos.info.label}>{i18n.t('moonPhases.pills.age')}</Text>
                      <Text style={moonPhasesStyles.content.body.infos.info.value}>{formatDays(moonData.data.age, currentLCID)}</Text>
                    </View>
                    <View>
                      <Text style={moonPhasesStyles.content.body.infos.info.label}>{i18n.t('moonPhases.pills.distance')}</Text>
                      <Text style={moonPhasesStyles.content.body.infos.info.value}>{formatKm(moonData.data.distance, currentLCID)}</Text>
                    </View>
                  </View>
                  <View style={moonPhasesStyles.content.body.infos}>
                    <View>
                      <Text style={moonPhasesStyles.content.body.infos.info.label}>{i18n.t('moonPhases.pills.full_moon')}</Text>
                      <Text style={moonPhasesStyles.content.body.infos.info.value}>{dayjs(moonData.data.nextFullMoon).format('DD MMMM')}</Text>
                    </View>
                    <View>
                      <Text style={moonPhasesStyles.content.body.infos.info.label}>{i18n.t('moonPhases.pills.new_moon')}</Text>
                      <Text style={moonPhasesStyles.content.body.infos.info.value}>{dayjs(moonData.data.nextNewMoon).format('DD MMMM')}</Text>
                    </View>
                    <View>
                      <Text style={moonPhasesStyles.content.body.infos.info.label}>{i18n.t('moonPhases.pills.elongation')}</Text>
                      <Text style={moonPhasesStyles.content.body.infos.info.value}>{moonData.data.elongation}°</Text>
                    </View>
                  </View>
                </View>
                <View style={moonPhasesStyles.content.footer}>
                  <VisibilityGraph visibilityGraph={moonData?.visibility.visibilityGraph}/>
                </View>
              </>
            )
          }
        </View>
      </ScrollView>
    </View>
  )
}
