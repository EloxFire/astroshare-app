import { useState, useEffect } from "react";
import { GeographicCoordinate, getTwilightBandsForDay, EquatorialCoordinate, isBodyAboveHorizon, TwilightBand } from "@observerly/astrometry";
import { ImageSourcePropType, View, ImageBackground, ActivityIndicator, Text, Image } from "react-native";
import { useSettings } from "../../../contexts/AppSettingsContext";
import { useSpot } from "../../../contexts/ObservationSpotContext";
import { useSolarSystem } from "../../../contexts/SolarSystemContext";
import { getWeather } from "../../../helpers/api/getWeather";
import { calculateHorizonAngle } from "../../../helpers/scripts/astro/calculateHorizonAngle";
import { extractNumbers } from "../../../helpers/scripts/extractNumbers";
import { i18n } from "../../../helpers/scripts/i18n";
import { twilightBandsBackgrounds, weatherImages, astroImages } from "../../../helpers/scripts/loadImages";
import { showToast } from "../../../helpers/scripts/showToast";
import { capitalize } from "../../../helpers/scripts/utils/formatters/capitalize";
import { formatCelsius } from "../../../helpers/scripts/utils/formatters/formaters";
import { GlobalPlanet } from "../../../helpers/types/GlobalPlanet";
import { globalSummaryStyles } from "../../../styles/components/widgets/home/globalSummary";
import { globalStyles } from "../../../styles/global";
import { app_colors } from "../../../helpers/constants";

interface GlobalSummaryProps {
  noHeader?: boolean
}

export default function GlobalSummary({ noHeader }: GlobalSummaryProps) {

  const { currentUserLocation } = useSettings();
  const { selectedSpot, defaultAltitude } = useSpot()
  const { planets } = useSolarSystem()

  const [loading, setLoading] = useState<boolean>(true)
  const [currentWeather, setCurrentWeather] = useState<any>(null)
  const [backgroundColor, setBackgroundColor] = useState<ImageSourcePropType>(twilightBandsBackgrounds.Night)
  const [visiblePlanets, setVisiblePlanets] = useState<GlobalPlanet[]>([])

  useEffect(() => {
    getInfos()
  }, [currentUserLocation, planets])

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

    const bands = getTwilightBandsForDay(new Date(), observer)

    setBackgroundColor(backgroundFromTwilightBands(bands))

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
    <View style={{ marginTop: noHeader ? 0 : 10, marginBottom: 20 }}>
      {
        !noHeader &&
        <View>
          <Text style={globalStyles.sections.title}>{i18n.t('common.other.overview')}</Text>
          <Text style={[globalStyles.sections.subtitle, { marginBottom: 0 }]}>{i18n.t('widgets.homeWidgets.live.title')}</Text>
        </View>
      }
      <ImageBackground source={loading ? undefined : backgroundColor} imageStyle={globalSummaryStyles.container.backgroundPicture} resizeMode='cover' style={[globalSummaryStyles.container, { justifyContent: loading ? 'center' : 'space-between' }]}>
        {
          loading ?
            <ActivityIndicator size='large' color={app_colors.white} />
            :
            <>
              <View style={globalSummaryStyles.container.blur} />
              <View style={globalSummaryStyles.container.weatherContainer}>
                <Text style={globalSummaryStyles.container.weatherContainer.city}>{currentUserLocation ? currentUserLocation.common_name : i18n.t('common.loadings.simple')}</Text>
                <View style={globalSummaryStyles.container.weatherContainer.conditions}>
                  <Image style={globalSummaryStyles.container.weatherContainer.conditions.icon} source={currentWeather ? weatherImages[currentWeather.current.weather[0].icon] : weatherImages.default} />
                  <View style={globalSummaryStyles.container.weatherContainer.conditions.infos}>
                    <View style={globalSummaryStyles.container.weatherContainer.conditions.infos.info}>
                      <Image style={globalSummaryStyles.container.weatherContainer.conditions.infos.info.icon} source={require('../../../../assets/icons/FiThermometer.png')} />
                      <Text style={globalSummaryStyles.container.weatherContainer.conditions.infos.info.value}>{currentWeather ? formatCelsius(currentWeather.current.temp, i18n.locale) : '--'}</Text>
                    </View>
                    <View style={globalSummaryStyles.container.weatherContainer.conditions.infos.info}>
                      <Image style={globalSummaryStyles.container.weatherContainer.conditions.infos.info.icon} source={require('../../../../assets/icons/FiDroplet.png')} />
                      <Text style={globalSummaryStyles.container.weatherContainer.conditions.infos.info.value}>{currentWeather ? currentWeather.current.humidity + ' %' : '%'}</Text>
                    </View>
                  </View>
                </View>
                <Text style={globalSummaryStyles.container.weatherContainer.description}>{currentWeather ? capitalize(currentWeather.current.weather[0].description) : i18n.t('common.loadings.simple')}</Text>
              </View>
              <View style={globalSummaryStyles.container.currentSkyContainer}>
                <Text style={globalSummaryStyles.container.currentSkyContainer.title}>{i18n.t('widgets.homeWidgets.live.sky')}</Text>
                <View style={globalSummaryStyles.container.currentSkyContainer.planets}>
                  {
                    visiblePlanets.length > 0 ?
                      visiblePlanets.map((planet: GlobalPlanet, index: number) => (
                        <View key={`planet-${index}-${planet.name}`} style={globalSummaryStyles.container.currentSkyContainer.planets.planet}>
                          <Image style={globalSummaryStyles.container.currentSkyContainer.planets.planet.icon} source={astroImages[planet.name.toUpperCase()]} />
                          <Text style={globalSummaryStyles.container.currentSkyContainer.planets.planet.name}>{i18n.t(`common.planets.${planet.name}`)}</Text>
                        </View>
                      ))
                      :
                      <Text style={globalSummaryStyles.container.currentSkyContainer.planets.empty}>{i18n.t('common.errors.noPlanets')}</Text>
                  }
                </View>
              </View>
            </>
        }
      </ImageBackground>
    </View>
  )
}
