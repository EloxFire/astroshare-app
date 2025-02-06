import React, { useEffect, useState } from 'react'
import { ImageBackground, Text, View } from 'react-native'
import { moonInfosStyles } from '../../styles/components/weather/moonInfos'
import { getBodyNextRise, getBodyNextSet, getLunarAge, getLunarDistance, getLunarElongation, getLunarEquatorialCoordinate, getLunarIllumination, getLunarPhase, isTransitInstance } from '@observerly/astrometry';
import { moonIcons } from '../../helpers/scripts/loadImages';
import { useSettings } from '../../contexts/AppSettingsContext';
import { useSpot } from '../../contexts/ObservationSpotContext';
import { extractNumbers } from '../../helpers/scripts/extractNumbers';
import { calculateHorizonAngle } from '../../helpers/scripts/astro/calculateHorizonAngle';
import SingleValue from './SingleValue'
import dayjs from 'dayjs';
import { i18n } from '../../helpers/scripts/i18n';


export default function MoonInfos() {

  const { currentUserLocation, currentUserHorizon } = useSettings()
  const { selectedSpot, defaultAltitude } = useSpot()

  const [moonrise, setMoonrise] = useState<string>('');
  const [moonset, setMoonset] = useState<string>('');
  const [illumination, setIllumination] = useState<number>(0);
  const [age, setAge] = useState<{ A: number; age: number } | null>(null);
  const [phase, setPhase] = useState<string>('');
  const [elongation, setElongation] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true)

  const [moonImageUrl, setMoonImageUrl] = useState<undefined | {uri: string }>({uri: `${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/moon/illustration`})

  const formatter = new Intl.NumberFormat("fr-FR", {
    style: 'unit',
    unit: 'kilometer',
    unitDisplay: 'short',
    maximumFractionDigits: 0
  });

  useEffect(() => {
    setAge(getLunarAge(new Date()))
    setIllumination(getLunarIllumination(new Date()))
    setPhase(getLunarPhase(new Date()))
    setDistance(getLunarDistance(new Date()))
    setElongation(getLunarElongation(new Date()))
    getMoonRiseAndSet()
    setLoading(false)
  }, [])

  const getMoonRiseAndSet = () => {
    const altitude = selectedSpot ? selectedSpot.equipments.altitude : defaultAltitude;
    const horizonAngle = calculateHorizonAngle(extractNumbers(altitude))
    const moonCoords = getLunarEquatorialCoordinate(new Date())
    console.log(moonCoords);

    const moonRise = getBodyNextRise(new Date(), { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, moonCoords, horizonAngle)
    const moonSet = getBodyNextSet(new Date(), { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, moonCoords, horizonAngle)

    if (isTransitInstance(moonRise)) {
      moonRise.datetime < new Date() ? setMoonrise("Déjà levée") : setMoonrise(dayjs(moonRise.datetime).add(2, 'h').format('HH:mm'))
    }

    if (isTransitInstance(moonSet)) {
      moonSet.datetime < new Date() ? setMoonset("Déjà couchée") : setMoonset(dayjs(moonSet.datetime).add(2, 'h').format('HH:mm'))
    }
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
    <View style={moonInfosStyles.container}>
      <ImageBackground source={moonImageUrl} style={moonInfosStyles.container.illustration} />
      <View>
        {loading ? <Text>{i18n.t('common.loadings.simple')}</Text> : <Text style={moonInfosStyles.container.title}>{moonPhasesList[phase]}</Text>}
        <View style={moonInfosStyles.container.infos}>
          <View style={{ gap: 5 }}>
            {loading ? <Text>{i18n.t('common.loadings.simple')}</Text> : <SingleValue icon={require('../../../assets/icons/FiMoonrise.png')} value={moonrise} />}
            {loading ? <Text>{i18n.t('common.loadings.simple')}</Text> : <SingleValue icon={require('../../../assets/icons/FiSun.png')} value={illumination.toFixed(2)} unit='%' />}
            {loading ? <Text>{i18n.t('common.loadings.simple')}</Text> : <SingleValue icon={require('../../../assets/icons/FiGift.png')} value={Math.floor(age?.age!)} unit={` ${i18n.t('common.other.days')}`} />}
          </View>
          <View style={{ gap: 5 }}>
            {loading ? <Text>{i18n.t('common.loadings.simple')}</Text> : <SingleValue icon={require('../../../assets/icons/FiMoonset.png')} value={moonset} />}
            {loading ? <Text>{i18n.t('common.loadings.simple')}</Text> : <SingleValue icon={require('../../../assets/icons/FiAngleRight.png')} value={Math.floor(elongation)} unit='°' />}
            {loading ? <Text>{i18n.t('common.loadings.simple')}</Text> : <SingleValue icon={require('../../../assets/icons/FiRuler.png')} value={formatter.format(Math.floor(distance / 1000))} />}
          </View>
        </View>
      </View>
    </View>
  )
}
