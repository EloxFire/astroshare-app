import React, { useEffect, useState } from 'react'
import { ImageBackground, Text, View } from 'react-native'
import { moonInfosStyles } from '../../styles/components/weather/moonInfos'
import SingleValue from './SingleValue'
import { getBodyNextRise, getBodyNextSet, getLunarAge, getLunarDistance, getLunarElongation, getLunarEquatorialCoordinate, getLunarIllumination, getLunarPhase, isTransitInstance } from '@observerly/astrometry';
import { moonPhases } from '../../helpers/constants';
import { moonIcons } from '../../helpers/scripts/loadImages';
import { useSettings } from '../../contexts/AppSettingsContext';
import dayjs from 'dayjs';
import { useSpot } from '../../contexts/ObservationSpotContext';
import { extractNumbers } from '../../helpers/scripts/extractNumbers';
import { calculateHorizonAngle } from '../../helpers/scripts/astro/calculateHorizonAngle';


export default function MoonInfos({ moonInfos }: any) {

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
      console.log(moonRise.datetime);

      moonRise.datetime > new Date() ? setMoonrise("Déjà levée") : setMoonrise(dayjs(moonRise.datetime).format('HH:mm'))
    }

    if (isTransitInstance(moonSet)) {
      console.log(moonSet.datetime);

      moonSet.datetime < new Date() ? setMoonset("Déjà couchée") : setMoonset(dayjs(moonSet.datetime).format('HH:mm'))
    }
  }

  return (
    <View style={moonInfosStyles.container}>
      <ImageBackground source={moonIcons[phase]} style={moonInfosStyles.container.illustration} />
      <View>
        {loading ? <Text>Chargement...</Text> : <Text style={moonInfosStyles.container.title}>{moonPhases[phase]}</Text>}
        <View style={moonInfosStyles.container.infos}>
          <View style={{ gap: 5 }}>
            {loading ? <Text>Chargement...</Text> : <SingleValue icon={require('../../../assets/icons/FiMoonrise.png')} value={moonrise} />}
            {loading ? <Text>Chargement...</Text> : <SingleValue icon={require('../../../assets/icons/FiSun.png')} value={illumination.toFixed(2)} unit='%' />}
            {loading ? <Text>Chargement...</Text> : <SingleValue icon={require('../../../assets/icons/FiGift.png')} value={Math.floor(age?.age!)} unit=' jours' />}
          </View>
          <View style={{ gap: 5 }}>
            {loading ? <Text>Chargement...</Text> : <SingleValue icon={require('../../../assets/icons/FiMoonset.png')} value={moonset} />}
            {loading ? <Text>Chargement...</Text> : <SingleValue icon={require('../../../assets/icons/FiAngleRight.png')} value={Math.floor(elongation)} unit='°' />}
            {loading ? <Text>Chargement...</Text> : <SingleValue icon={require('../../../assets/icons/FiRuler.png')} value={formatter.format(Math.floor(distance))} />}
          </View>
        </View>
      </View>
    </View>
  )
}
