import React, { useEffect, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { moonPhasesStyles } from '../styles/screens/moonPhases'
import { getBodyNextRise, getBodyNextSet, getLunarAge, getLunarDistance, getLunarElongation, getLunarEquatorialCoordinate, getLunarIllumination, getLunarPhase, isFullMoon, isNewMoon, isTransitInstance } from '@observerly/astrometry'
import { moonIcons } from '../helpers/scripts/loadImages'
import { app_colors } from '../helpers/constants'
import { useSpot } from '../contexts/ObservationSpotContext'
import { extractNumbers } from '../helpers/scripts/extractNumbers'
import { calculateHorizonAngle } from '../helpers/scripts/astro/calculateHorizonAngle'
import { useSettings } from '../contexts/AppSettingsContext'
import dayjs from 'dayjs'
import DateTimePicker from '@react-native-community/datetimepicker';
import SimpleButton from '../components/commons/buttons/SimpleButton'
import PageTitle from '../components/commons/PageTitle'
import DSOValues from '../components/commons/DSOValues'
import { i18n } from '../helpers/scripts/i18n'

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

  // const { selectedSpot, defaultAltitude } = useSpot()
  const { currentUserLocation } = useSettings()

  const [date, setDate] = useState<Date>(new Date())
  const [moonData, setMoonData] = useState<MoonData | null>(null)
  const [isDateModalVisible, setIsDateModalVisible] = useState(false)

  const formatter = new Intl.NumberFormat("fr-FR", {
    style: 'unit',
    unit: 'kilometer',
    unitDisplay: 'short',
    maximumFractionDigits: 0
  });

  useEffect(() => {
    getMoonData()
  }, [date])

  const getMoonData = () => {
    const phase = getLunarPhase(date)
    const illumination = getLunarIllumination(date).toFixed(2)
    const distance = Math.floor(getLunarDistance(date) / 1000)
    const elongation = Math.floor(getLunarElongation(date))
    const newMoon = isNewMoon(date)
    const fullMoon = isFullMoon(date)
    const age = Math.floor(getLunarAge(date).age)
    const moonrise = getMoonRiseAndSet(date).moonrise
    const moonset = getMoonRiseAndSet(date).moonset

    setMoonData({
      phase: phase || 'Full',
      illumination: illumination || '##Erreur##',
      distance: distance || 0,
      elongation: elongation || 0,
      newMoon: newMoon || false,
      fullMoon: fullMoon || false,
      age: age || 0,
      moonrise: moonrise || '##Erreur##',
      moonset: moonset || '##Erreur##',
    })
  }

  const getMoonRiseAndSet = (date: Date): { moonrise: string, moonset: string } => {
    const altitude = 341;
    // const altitude = selectedSpot ? selectedSpot.equipments.altitude : extractNumbers(defaultAltitude);
    const horizonAngle = calculateHorizonAngle(altitude)
    const moonCoords = getLunarEquatorialCoordinate(new Date())

    const moonRise = getBodyNextRise(date, { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, moonCoords, horizonAngle)
    const moonSet = getBodyNextSet(date, { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, moonCoords, horizonAngle)

    let moonrise = '##Erreur##'
    let moonset = '##Erreur##'
    if (isTransitInstance(moonRise)) {
      moonRise.datetime < date ? moonrise = "Déjà levée" : moonrise = dayjs(moonRise.datetime).add(2, 'h').format('HH:mm').replace(':', 'h')
    }

    if (isTransitInstance(moonSet)) {
      moonSet.datetime < date ? moonset = "Déjà couchée" : moonset = dayjs(moonSet.datetime).add(2, 'h').format('HH:mm').replace(':', 'h')
    }

    return { moonrise, moonset }
  }

  const moonPhasesList: any = {
    "New": i18n.t('common.moon_phases.new'),
    "Waxing Crescent": i18n.t('common.moon_phases.waxing_crescent'),
    "First Quarter": i18n.t('common.moon_phases.first_quarter'),
    "Waxing Gibbous": i18n.t('common.moon_phases.waxing_gibbous'),
    "Full": i18n.t('common.moon_phases.full'),
    "Waning Gibbous": i18n.t('common.moon_phases.waning_gibbous'),
    "Last Quarter": i18n.t('common.moon_phases.last_quarter'),
    "Waning Crescent": i18n.t('common.moon_phases.waning_crescent'),
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title="Phases de la lune" subtitle="// Calculez les phases de la Lune" />
      <View style={globalStyles.screens.separator} />
      <View style={moonPhasesStyles.content}>
        <View style={moonPhasesStyles.content.phaseContainer}>
          <Text style={moonPhasesStyles.content.title}>Lune du {dayjs(date).format('DD MMMM YYYY')}</Text>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <TouchableOpacity onPress={() => setIsDateModalVisible(true)} style={moonPhasesStyles.content.selectButton}>
              <Text style={moonPhasesStyles.content.selectButton.text}>Sélectioner une date</Text>
            </TouchableOpacity>
            <SimpleButton icon={require('../../assets/icons/FiRepeat.png')} small onPress={() => setDate(new Date())} />
          </View>

          {
            isDateModalVisible &&
            <DateTimePicker
              value={date}
              mode='date'
              display='default'
              onChange={(event, selectedDate) => {
                if (event.type === 'dismissed') {
                  setIsDateModalVisible(false)
                }
                if (event.type === 'set' && selectedDate) {
                  setIsDateModalVisible(false)
                  setDate(selectedDate)
                }
              }}
            />
          }

          {moonData && <Image source={moonIcons[moonData.phase]} style={{ height: 200, width: 200, alignSelf: 'center', marginVertical: 20 }} resizeMode='contain' />}
          <Text style={moonPhasesStyles.content.title}>{moonData ? moonPhasesList[moonData.phase] : i18n.t('common.loadings.simple')}</Text>
        </View>

        <View style={moonPhasesStyles.content.valuesContainer}>
          <DSOValues title='Heure de lever' value={moonData ? moonData.moonrise : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
          <DSOValues title='Heure de coucher' value={moonData ? moonData.moonset : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
          <DSOValues title='Illumination' value={moonData ? moonData.illumination + '%' : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
          <DSOValues title='Distance' value={moonData ? formatter.format(moonData.distance) : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
          <DSOValues title='Élongation' value={moonData ? moonData.elongation! + '°' : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
          <DSOValues title='Âge' value={moonData ? moonData.age! + ' ' + i18n.t('common.other.days') : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
          <DSOValues title='Nouvelle lune' value={moonData ? moonData.newMoon ? i18n.t('common.other.yes') : i18n.t('common.other.no') : i18n.t('common.loadings.simple')} chipValue chipColor={moonData?.newMoon! ? app_colors.green_eighty : app_colors.grey} />
          <DSOValues title='Pleine lune' value={moonData ? moonData.fullMoon ? i18n.t('common.other.yes') : i18n.t('common.other.no') : i18n.t('common.loadings.simple')} chipValue chipColor={moonData?.fullMoon! ? app_colors.green_eighty : app_colors.grey} />
        </View>
      </View>
    </View>
  )
}
