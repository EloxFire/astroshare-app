import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Image, ImageBackground, ImageSourcePropType, Text, View } from 'react-native'
import { useSettings } from '../../../contexts/AppSettingsContext';
import { getWeather } from '../../../helpers/api/getWeather';
import { showToast } from '../../../helpers/scripts/showToast';
import { EquatorialCoordinate, GeographicCoordinate, getNight, getTwilightBandsForDay, isBodyAboveHorizon, TwilightBand } from '@observerly/astrometry';
import { useSpot } from '../../../contexts/ObservationSpotContext';
import { extractNumbers } from '../../../helpers/scripts/extractNumbers';
import { calculateHorizonAngle } from '../../../helpers/scripts/astro/calculateHorizonAngle';
import { astroImages, twilightBandsBackgrounds, weatherImages } from '../../../helpers/scripts/loadImages';
import { formatCelsius } from '../../../helpers/scripts/utils/formatters/formaters';
import { i18n } from '../../../helpers/scripts/i18n';
import { capitalize } from '../../../helpers/scripts/utils/formatters/capitalize';
import { app_colors } from '../../../helpers/constants';
import { useSolarSystem } from '../../../contexts/SolarSystemContext';
import { GlobalPlanet } from '../../../helpers/types/GlobalPlanet';
import { globalStyles } from '../../../styles/global';
import { globalSummaryStyles } from '../../../styles/components/widgets/home/globalSummary';

interface NightInterface {
  start: Date | null,
  end: Date | null,
}

export default function NightSummary() {

  const { currentUserLocation } = useSettings();
  const { selectedSpot, defaultAltitude } = useSpot()

  const [loading, setLoading] = useState<boolean>(true)
  const [twilightBands, setTwilightBands] = useState<TwilightBand[]>([])
  const [night, setNight] = useState<NightInterface>()

  useEffect(() => {
    getInfos()
  }, [currentUserLocation])

  const getInfos = async () => {
    if (!currentUserLocation) return;

    const altitude = selectedSpot ? selectedSpot.equipments.altitude : defaultAltitude;
    const observer: GeographicCoordinate = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }
    const horizonAngle = calculateHorizonAngle(extractNumbers(altitude))


    const nightTimes = getNight(new Date(), observer, horizonAngle)
    const bands = getTwilightBandsForDay(new Date(), observer)
    setTwilightBands(bands)
    setNight(nightTimes)
    setLoading(false)
  }

  return (
    <View style={{ marginTop: 10, marginBottom: 20 }}>
      <View>
        <Text style={globalStyles.sections.title}>{i18n.t('widgets.homeWidgets.title')}</Text>
        <Text style={[globalStyles.sections.subtitle, { marginBottom: 0 }]}>{i18n.t('widgets.homeWidgets.live.title')}</Text>
      </View>
      <ImageBackground source={loading ? undefined : require('../../../../assets/icons/astro/bands/NIGHT.png')} imageStyle={globalSummaryStyles.container.backgroundPicture} resizeMode='cover' style={[globalSummaryStyles.container, { justifyContent: loading ? 'center' : 'space-between' }]}>
        {
          loading ?
            <ActivityIndicator size='large' color={app_colors.white} />
            :
            <>

            </>
        }
      </ImageBackground>
    </View>
  )
}
