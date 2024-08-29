import React, { useEffect, useState } from 'react'
import { Image, ImageBackground, ImageSourcePropType, Text, View } from 'react-native'
import { globalSummaryStyles } from '../styles/components/globalSummary'
import { useSettings } from '../contexts/AppSettingsContext';
import { getWeather } from '../helpers/api/getWeather';
import { showToast } from '../helpers/scripts/showToast';
import { GeographicCoordinate, getNight, getTwilightBandsForDay, TwilightBand } from '@observerly/astrometry';
import { useSpot } from '../contexts/ObservationSpotContext';
import { extractNumbers } from '../helpers/scripts/extractNumbers';
import { calculateHorizonAngle } from '../helpers/scripts/astro/calculateHorizonAngle';
import dayjs from 'dayjs';
import { twilightBandsBackgrounds, weatherImages } from '../helpers/scripts/loadImages';
import { formatCelsius } from '../helpers/scripts/utils/formatters/formaters';
import { i18n } from '../helpers/scripts/i18n';
import { capitalize } from '../helpers/scripts/utils/formatters/capitalize';
import { app_colors } from '../helpers/constants';

interface NightInterface {
  start: Date | null,
  end: Date | null
}

export default function GlobalSummary() {

  const { currentUserLocation } = useSettings();
  const { selectedSpot, defaultAltitude } = useSpot()
  const [currentWeather, setCurrentWeather] = useState<any>(null)
  const [night, setNight] = useState<NightInterface>({ start: new Date(), end: new Date() })
  const [twilightBands, setTwilightBands] = useState<TwilightBand[]>([])
  const [backgroundColor, setBackgroundColor] = useState<ImageSourcePropType>(twilightBandsBackgrounds.Night)

  useEffect(() => {
    getInfos()
  }, [currentUserLocation])

  const getInfos = async () => {
    if (!currentUserLocation) return;

    const altitude = selectedSpot ? selectedSpot.equipments.altitude : defaultAltitude;
    const observer: GeographicCoordinate = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }
    const horizonAngle = calculateHorizonAngle(extractNumbers(altitude))

    try {
      const weather = await getWeather(currentUserLocation.lat, currentUserLocation.lon)
      setCurrentWeather(weather)

    } catch (error) {
      showToast({ message: 'Erreur lors de la récupération de la météo', type: 'error' })
    }

    const nightTimes = getNight(new Date(), observer, horizonAngle)
    const bands = getTwilightBandsForDay(new Date(), observer)
    setTwilightBands(bands)
    setNight(nightTimes)

    setBackgroundColor(backgroundFromTwilightBands(bands))
  }

  const backgroundFromTwilightBands = (twilightBands: TwilightBand[]) => {
    const now = new Date()
    const currentBand = twilightBands.find(band => now > band.interval.from && now < band.interval.to)
    if (!currentBand) return app_colors.white_no_opacity

    switch (currentBand.name) {
      case 'Civil':
        return twilightBandsBackgrounds.Civil
      case 'Nautical':
        return twilightBandsBackgrounds.Nautical
      case 'Astronomical':
        return twilightBandsBackgrounds.Astronomical
      case 'Day':
        return twilightBandsBackgrounds.Day
      default:
        return twilightBandsBackgrounds.Night
    }
  }

  return (
    <ImageBackground source={backgroundColor} imageStyle={globalSummaryStyles.container.backgroundPicture} resizeMode='cover' style={globalSummaryStyles.container}>
      <View style={globalSummaryStyles.container.blur} />
      <View style={globalSummaryStyles.container.weatherContainer}>
        <Text style={globalSummaryStyles.container.weatherContainer.city}>{currentUserLocation ? currentUserLocation.common_name : i18n.t('common.loadings.simple')}</Text>
        <View style={globalSummaryStyles.container.weatherContainer.conditions}>
          <Image style={globalSummaryStyles.container.weatherContainer.conditions.icon} source={currentWeather ? weatherImages[currentWeather.current.weather[0].icon] : weatherImages.default} />
          <View style={globalSummaryStyles.container.weatherContainer.conditions.infos}>
            <View style={globalSummaryStyles.container.weatherContainer.conditions.infos.info}>
              <Image style={globalSummaryStyles.container.weatherContainer.conditions.infos.info.icon} source={require('../../assets/icons/FiThermometer.png')} />
              <Text style={globalSummaryStyles.container.weatherContainer.conditions.infos.info.value}>{currentWeather ? formatCelsius(currentWeather.current.temp, i18n.locale) : '--'}</Text>
            </View>
            <View style={globalSummaryStyles.container.weatherContainer.conditions.infos.info}>
              <Image style={globalSummaryStyles.container.weatherContainer.conditions.infos.info.icon} source={require('../../assets/icons/FiDroplet.png')} />
              <Text style={globalSummaryStyles.container.weatherContainer.conditions.infos.info.value}>{currentWeather ? currentWeather.current.humidity + '%' : '%'}</Text>
            </View>
          </View>
        </View>
        <Text style={globalSummaryStyles.container.weatherContainer.description}>{currentWeather ? capitalize(currentWeather.current.weather[0].description) : i18n.t('common.loadings.simple')}</Text>
      </View>
    </ImageBackground>
  )
}
