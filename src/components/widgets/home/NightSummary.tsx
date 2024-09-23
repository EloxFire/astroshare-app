import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ImageBackground, Text, View } from 'react-native'
import { useSettings } from '../../../contexts/AppSettingsContext';
import { EquatorialCoordinate, GeographicCoordinate, getBodyNextRise, getBodyNextSet, getLunarAge, getLunarDistance, getLunarElongation, getLunarEquatorialCoordinate, getLunarIllumination, getLunarPhase, getNight, getTwilightBandsForDay, isBodyAboveHorizon, isFullMoon, isNewMoon, isTransitInstance, TwilightBand } from '@observerly/astrometry';
import { useSpot } from '../../../contexts/ObservationSpotContext';
import { extractNumbers } from '../../../helpers/scripts/extractNumbers';
import { calculateHorizonAngle } from '../../../helpers/scripts/astro/calculateHorizonAngle';
import { i18n } from '../../../helpers/scripts/i18n';
import { app_colors } from '../../../helpers/constants';
import { globalStyles } from '../../../styles/global';
import { nightSummaryStyles } from '../../../styles/components/widgets/home/nightSummary';
import dayjs from 'dayjs';
import { moonIcons } from '../../../helpers/scripts/loadImages';
import { GlobalPlanet } from '../../../helpers/types/GlobalPlanet';
import { useSolarSystem } from '../../../contexts/SolarSystemContext';
import { isNightPastTwelve } from '../../../helpers/scripts/astro/transits/isNightPastTwelve';

interface NightInterface {
  start: Date | null,
  end: Date | null,
}

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

interface NightSummaryProps {
  noHeader?: boolean
}

export default function NightSummary({ noHeader }: NightSummaryProps) {

  const { currentUserLocation } = useSettings();
  const { selectedSpot, defaultAltitude } = useSpot()
  const { planets } = useSolarSystem()

  const [loading, setLoading] = useState<boolean>(true)
  const [night, setNight] = useState<NightInterface>()
  const [moonData, setMoonData] = useState<MoonData | null>(null)
  const [visiblePlanets, setVisiblePlanets] = useState<GlobalPlanet[]>([])

  useEffect(() => {
    getInfos()
  }, [currentUserLocation])

  const getInfos = async () => {
    if (!currentUserLocation) return;

    const altitude = selectedSpot ? selectedSpot.equipments.altitude : defaultAltitude;
    const observer: GeographicCoordinate = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }
    const horizonAngle = calculateHorizonAngle(extractNumbers(altitude))

    const nightTimes = getNight(new Date(), observer, horizonAngle)
    setNight(nightTimes)

    getMoonData()

    let vp: GlobalPlanet[] = [];
    planets.forEach((planet: GlobalPlanet) => {
      const target: EquatorialCoordinate = { ra: planet.ra, dec: planet.dec }
      const isAbove = isBodyAboveHorizon(new Date(), observer, target, horizonAngle)
      if (isAbove && planet.name !== 'Earth') {
        vp.push(planet)
      }
    })

    setVisiblePlanets(vp)
    setLoading(false)
  }

  const getMoonData = () => {
    const date = new Date()
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
    const horizonAngle = calculateHorizonAngle(altitude)
    const moonCoords = getLunarEquatorialCoordinate(new Date())

    const moonRise = getBodyNextRise(date, { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, moonCoords, horizonAngle)
    const moonSet = getBodyNextSet(date, { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, moonCoords, horizonAngle)

    let moonrise = i18n.t('common.errors.simple')
    let moonset = i18n.t('common.errors.simple')
    if (isTransitInstance(moonRise)) {
      moonRise.datetime < date ? moonrise = "Levée" : moonrise = dayjs(moonRise.datetime).add(2, 'h').format('HH:mm').replace(':', 'h')
    }

    if (isTransitInstance(moonSet)) {
      moonSet.datetime < date ? moonset = "Couchée" : moonset = dayjs(moonSet.datetime).add(2, 'h').format('HH:mm').replace(':', 'h')
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
    <View style={{ marginTop: noHeader ? 0 : 10, marginBottom: 20 }}>
      {
        !noHeader &&
        <View>
          <Text style={globalStyles.sections.title}>{i18n.t('common.other.overview')}</Text>
          <Text style={[globalStyles.sections.subtitle, { marginBottom: 0 }]}>{i18n.t('widgets.homeWidgets.night.title')}</Text>
        </View>
      }
      <ImageBackground source={loading ? undefined : require('../../../../assets/icons/astro/bands/NIGHT.png')} imageStyle={nightSummaryStyles.container.backgroundPicture} resizeMode='cover' style={[nightSummaryStyles.container, { justifyContent: loading ? 'center' : 'flex-start' }]}>
        {
          loading ?
            <ActivityIndicator size='large' color={app_colors.white} />
            :
            <>
              <View style={nightSummaryStyles.container.blur} />
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={nightSummaryStyles.container.title}>{isNightPastTwelve(new Date, {latitude: currentUserLocation.lat, longitude: currentUserLocation.lon}) ? i18n.t('widgets.homeWidgets.night.container.alterTitle') : i18n.t('widgets.homeWidgets.night.container.title')}</Text>
                {/* <Text style={nightSummaryStyles.container.title}>Planètes</Text> */}
                <Text style={nightSummaryStyles.container.title}>{moonData ? moonPhasesList[moonData.phase] : i18n.t('common.loadings.simple')}</Text>
              </View>
              <View style={nightSummaryStyles.container.data}>
                <View style={nightSummaryStyles.container.data.timings}>
                  <View style={nightSummaryStyles.container.data.timings.info}>
                    <Text style={nightSummaryStyles.container.data.timings.info.title}>{i18n.t('widgets.homeWidgets.night.container.night.start')}</Text>
                    <Text style={nightSummaryStyles.container.data.timings.info.value}>{dayjs(night?.start).format('HH:mm').replace(':', 'h')}</Text>
                  </View>
                  <View style={nightSummaryStyles.container.data.timings.info}>
                    <Text style={nightSummaryStyles.container.data.timings.info.title}>{i18n.t('widgets.homeWidgets.night.container.night.end')}</Text>
                    <Text style={nightSummaryStyles.container.data.timings.info.value}>{dayjs(night?.end).format('HH:mm').replace(':', 'h')}</Text>
                  </View>
                </View>
                {
                  moonData &&
                  <>
                    <View style={nightSummaryStyles.container.data.moon}>
                      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        {/* <View style={[nightSummaryStyles.container.data.timings.info, { alignItems: 'flex-end' }]}>
                          <Text style={nightSummaryStyles.container.data.timings.info.title}>Lever</Text>
                          <Text style={nightSummaryStyles.container.data.timings.info.value}>{moonData.moonrise}</Text>
                        </View> */}
                        <Image source={moonIcons[moonData.phase]} style={nightSummaryStyles.container.data.moon.icon} resizeMode='contain' />
                        {/* <View style={[nightSummaryStyles.container.data.timings.info, { alignItems: 'flex-start' }]}>
                          <Text style={nightSummaryStyles.container.data.timings.info.title}>Coucher</Text>
                          <Text style={nightSummaryStyles.container.data.timings.info.value}>{moonData.moonset}</Text>
                        </View> */}
                      </View>
                      {/* <Text style={nightSummaryStyles.container.data.moon.title}>{moonPhasesList[moonData.phase]}</Text> */}
                    </View>
                    <View style={nightSummaryStyles.container.data.timings}>
                      <View style={nightSummaryStyles.container.data.timings.info}>
                        <Text style={nightSummaryStyles.container.data.timings.info.title}>{i18n.t('widgets.homeWidgets.night.container.moon.rise')}</Text>
                        <Text style={nightSummaryStyles.container.data.timings.info.value}>{moonData.moonrise}</Text>
                      </View>
                      <View style={nightSummaryStyles.container.data.timings.info}>
                        <Text style={nightSummaryStyles.container.data.timings.info.title}>{i18n.t('widgets.homeWidgets.night.container.moon.set')}</Text>
                        <Text style={nightSummaryStyles.container.data.timings.info.value}>{moonData.moonset}</Text>
                      </View>
                    </View>
                  </>
                }
                {/* <View style={nightSummaryStyles.container.data.planets}>
                  {
                    visiblePlanets.length > 0 ?
                      visiblePlanets.map((planet: GlobalPlanet, index: number) => (
                        <>
                          <View key={index} style={nightSummaryStyles.container.data.planets.planet}>
                            <Image style={nightSummaryStyles.container.data.planets.planet.icon} source={astroImages[planet.name.toUpperCase()]} />
                            <Text style={nightSummaryStyles.container.data.planets.planet.name}>{i18n.t(`common.planets.${planet.name}`)}</Text>
                          </View>
                        </>
                      ))
                      :
                      <Text style={globalSummaryStyles.container.currentSkyContainer.planets.empty}>{i18n.t('common.errors.noPlanets')}</Text>
                  }
                </View> */}
              </View>
            </>
        }
      </ImageBackground>
    </View>
  )
}
