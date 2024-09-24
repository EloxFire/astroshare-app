import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
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

  const [selectedView, setSelectedView] = useState<boolean>(true) // true = day, false = calendar

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
      illumination: illumination || i18n.t('common.errors.simple'),
      distance: distance || 0,
      elongation: elongation || 0,
      newMoon: newMoon || false,
      fullMoon: fullMoon || false,
      age: age || 0,
      moonrise: moonrise || i18n.t('common.errors.simple'),
      moonset: moonset || i18n.t('common.errors.simple'),
    })
  }

  const getMoonRiseAndSet = (date: Date): { moonrise: string, moonset: string } => {
    const altitude = 341;
    // const altitude = selectedSpot ? selectedSpot.equipments.altitude : extractNumbers(defaultAltitude);
    const horizonAngle = calculateHorizonAngle(altitude)
    const moonCoords = getLunarEquatorialCoordinate(new Date())

    const moonRise = getBodyNextRise(date, { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, moonCoords, horizonAngle)
    const moonSet = getBodyNextSet(date, { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, moonCoords, horizonAngle)

    let moonrise = i18n.t('common.errors.simple')
    let moonset = i18n.t('common.errors.simple')
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
      <PageTitle navigation={navigation} title={i18n.t('home.buttons.moon_phases.title')} subtitle={i18n.t('home.buttons.moon_phases.subtitle')} />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={moonPhasesStyles.content}>
          {
            selectedView &&
            <View>
              <View style={moonPhasesStyles.content.phaseContainer}>
                <Text style={moonPhasesStyles.content.title}>{i18n.t('moonPhases.title', { date: dayjs(date).format('DD MMMM YYYY') })}</Text>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <TouchableOpacity onPress={() => setIsDateModalVisible(true)} style={moonPhasesStyles.content.selectButton}>
                    <Text style={moonPhasesStyles.content.selectButton.text}>{i18n.t('moonPhases.select_date')}</Text>
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
                <DSOValues title={i18n.t('moonPhases.pills.rise_time')} value={moonData ? moonData.moonrise : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
                <DSOValues title={i18n.t('moonPhases.pills.set_time')} value={moonData ? moonData.moonset : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
                <DSOValues title={i18n.t('moonPhases.pills.illumination')} value={moonData ? moonData.illumination + '%' : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
                <DSOValues title={i18n.t('moonPhases.pills.distance')} value={moonData ? formatter.format(moonData.distance) : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
                <DSOValues title={i18n.t('moonPhases.pills.elongation')} value={moonData ? moonData.elongation! + '°' : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
                <DSOValues title={i18n.t('moonPhases.pills.age')} value={moonData ? moonData.age! + ' ' + i18n.t('common.other.days') : i18n.t('common.loadings.simple')} chipValue chipColor={app_colors.grey} />
                <DSOValues title={i18n.t('moonPhases.pills.new_moon')} value={moonData ? moonData.newMoon ? i18n.t('common.other.yes') : i18n.t('common.other.no') : i18n.t('common.loadings.simple')} chipValue chipColor={moonData?.newMoon! ? app_colors.green_eighty : app_colors.grey} />
                <DSOValues title={i18n.t('moonPhases.pills.full_moon')} value={moonData ? moonData.fullMoon ? i18n.t('common.other.yes') : i18n.t('common.other.no') : i18n.t('common.loadings.simple')} chipValue chipColor={moonData?.fullMoon! ? app_colors.green_eighty : app_colors.grey} />
              </View>
            </View>
          }

          {
            !selectedView &&
            <View>
              <SimpleButton icon={require('../../assets/icons/FiCalendar.png')} text={selectedView ? i18n.t('moonPhases.calendar.button.more') : i18n.t('moonPhases.calendar.button.less')} onPress={() => setSelectedView(!selectedView)} />
              <View style={moonPhasesStyles.content.calendar}>
                {
                  [...Array(dayjs().daysInMonth())].map((day, index) => {
                    const dayDate = dayjs(date).set('date', index + 1)
                    const formatedDate = dayDate.toDate()
                    const phase = getLunarPhase(formatedDate)
                    const illumination = getLunarIllumination(formatedDate).toFixed(2)
                    const distance = Math.floor(getLunarDistance(formatedDate) / 1000)
                    const elongation = Math.floor(getLunarElongation(formatedDate))
                    const newMoon = isNewMoon(formatedDate)
                    const fullMoon = isFullMoon(formatedDate)
                    const age = Math.floor(getLunarAge(formatedDate).age)
                    const moonrise = getMoonRiseAndSet(formatedDate).moonrise
                    const moonset = getMoonRiseAndSet(formatedDate).moonset
                    
                    return (
                      <View key={index} style={moonPhasesStyles.content.calendar.day}>
                        <Text style={moonPhasesStyles.content.calendar.day.title}>{dayDate.format("DD MMM")}</Text>
                        <Image source={moonIcons[phase]} style={{ height: 70, width: 70, alignSelf: 'center', marginVertical: 10 }} resizeMode='contain' />
                        <DSOValues small title={i18n.t('moonPhases.calendar.pills.rise_time')} value={moonrise} />
                        <DSOValues small title={i18n.t('moonPhases.calendar.pills.set_time')} value={moonset} />
                        <DSOValues small title={i18n.t('moonPhases.calendar.pills.illumination')} value={illumination} />
                        <DSOValues small title={i18n.t('moonPhases.calendar.pills.distance')} value={formatter.format(distance)} />
                        <DSOValues small title={i18n.t('moonPhases.calendar.pills.elongation')} value={elongation + '°'} />
                        <DSOValues small title={i18n.t('moonPhases.calendar.pills.age')} value={age + ' ' + i18n.t('common.other.days')} />
                        <DSOValues small title={i18n.t('moonPhases.calendar.pills.new_moon')} value={newMoon ? i18n.t('common.other.yes') : i18n.t('common.other.no')} />
                        <DSOValues small title={i18n.t('moonPhases.calendar.pills.full_moon')} value={fullMoon ? i18n.t('common.other.yes') : i18n.t('common.other.no')} />
                      </View>
                    )
                  })
                }
              </View>
            </View>
          }

          <SimpleButton icon={require('../../assets/icons/FiCalendar.png')} text={selectedView ? i18n.t('moonPhases.calendar.button.more') : i18n.t('moonPhases.calendar.button.less')} onPress={() => setSelectedView(!selectedView)} />
        </View>
      </ScrollView>
    </View>
  )
}
