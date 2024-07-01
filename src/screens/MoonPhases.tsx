import React, { useEffect, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { moonPhasesStyles } from '../styles/screens/moonPhases'
import { getBodyNextRise, getBodyNextSet, getLunarAge, getLunarDistance, getLunarElongation, getLunarEquatorialCoordinate, getLunarIllumination, getLunarPhase, isFullMoon, isNewMoon, isTransitInstance } from '@observerly/astrometry'
import { moonIcons } from '../helpers/scripts/loadImages'
import { app_colors, moonPhases } from '../helpers/constants'
import { useSpot } from '../contexts/ObservationSpotContext'
import { extractNumbers } from '../helpers/scripts/extractNumbers'
import { calculateHorizonAngle } from '../helpers/scripts/astro/calculateHorizonAngle'
import { useSettings } from '../contexts/AppSettingsContext'
import dayjs from 'dayjs'
import BigValue from '../components/commons/BigValue'
import DateTimePicker from '@react-native-community/datetimepicker';
import SimpleButton from '../components/commons/buttons/SimpleButton'
import PageTitle from '../components/commons/PageTitle'
import DSOValues from '../components/commons/DSOValues'

interface MoonData {
  phase: string,
  illumination: string,
  distance: number,
  elongation: number,
  newMoon: boolean,
  fullMoon: boolean,
  age: number
  moonrise?: string,
  moonset?: string
}


export default function MoonPhases({ navigation }: any) {

  const { selectedSpot, defaultAltitude } = useSpot()
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
      phase: phase,
      illumination: illumination,
      distance: distance,
      elongation: elongation,
      newMoon: newMoon,
      fullMoon: fullMoon,
      age: age,
      moonrise: moonrise,
      moonset: moonset
    })
  }

  const getMoonRiseAndSet = (date: Date): { moonrise: string, moonset: string } => {
    const altitude = selectedSpot ? selectedSpot.equipments.altitude : extractNumbers(defaultAltitude);
    const horizonAngle = calculateHorizonAngle(extractNumbers(altitude))
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

          <Image source={moonData?.phase ? moonIcons[moonData?.phase] : moonIcons["Full"]} style={{ height: 200, width: 200, alignSelf: 'center', marginVertical: 20 }} resizeMode='contain' />
          <Text style={moonPhasesStyles.content.title}>{moonData ? moonPhases[moonData.phase] : "Chargement..."}</Text>
        </View>

        <View style={moonPhasesStyles.content.valuesContainer}>
          <DSOValues title='Heure de lever' value={moonData ? moonData.moonrise! : "Chargement..."} chipValue chipColor={app_colors.grey} />
          <DSOValues title='Heure de coucher' value={moonData ? moonData.moonset! : "Chargement..."} chipValue chipColor={app_colors.grey} />
          <DSOValues title='Illumination' value={moonData ? moonData.illumination! + '%' : "Chargement..."} chipValue chipColor={app_colors.grey} />
          <DSOValues title='Distance' value={moonData ? formatter.format(moonData.distance!) : "Chargement..."} chipValue chipColor={app_colors.grey} />
          <DSOValues title='Élongation' value={moonData ? moonData.elongation! + '°' : "Chargement..."} chipValue chipColor={app_colors.grey} />
          <DSOValues title='Âge' value={moonData ? moonData.age! + ' jours' : "Chargement..."} chipValue chipColor={app_colors.grey} />
          <DSOValues title='Nouvelle lune' value={moonData ? moonData.newMoon! ? 'Oui' : 'Non' : "Chargement..."} chipValue chipColor={moonData?.newMoon! ? app_colors.green_eighty : app_colors.grey} />
          <DSOValues title='Pleine lune' value={moonData ? moonData.fullMoon! ? 'Oui' : 'Non' : "Chargement..."} chipValue chipColor={moonData?.fullMoon! ? app_colors.green_eighty : app_colors.grey} />
        </View>
      </View>
    </View>
  )
}
