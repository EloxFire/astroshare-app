import React, { useEffect, useRef, useState } from 'react'
import { app_colors, cmeImageSrc, cmeVideoSrc, sunImagesSrcWavelengths, sunImagesSrcWavelengthsBackup, sunVideoSrcWavelengths, sunVideoSrcWavelengthsBackup } from '../helpers/constants'
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { solarWeatherStyles } from '../styles/screens/solarWeather'
import { ESunFilter, ESunFilterBackup } from '../helpers/types/SunFilter'
import { ResizeMode, Video } from 'expo-av'
import { ECmeFilters } from '../helpers/types/CmeFilters'
import { Image } from 'expo-image'
import { localizedForecastPlaceholders, localizedImagePlaceholders } from '../helpers/scripts/loadImages'
import { i18n } from '../helpers/scripts/i18n'
import PageTitle from '../components/commons/PageTitle'
import SimpleButton from '../components/commons/buttons/SimpleButton'
import ProLocker from "../components/cards/ProLocker";
import {useAuth} from "../contexts/AuthContext";
import {isProUser} from "../helpers/scripts/auth/checkUserRole";
import KpChart from "../components/graphs/KpChart";
import LineGraph from "../components/graphs/LineGraph";
import {SolarWindData} from "../helpers/types/SolarWindData";
import {getSolarWindData} from "../helpers/api/getSolarWindData";
import {useSettings} from "../contexts/AppSettingsContext";
import {useTranslation} from "../hooks/useTranslation";
import {sendAnalyticsEvent} from "../helpers/scripts/analytics";
import {eventTypes} from "../helpers/constants/analytics";
import {routes} from "../helpers/routes";
import DisclaimerBar from '../components/banners/DisclaimerBar'
import EphemerisBar from '../components/weather/EphemerisBar'
import dayjs from 'dayjs'
import { getSunData } from '../helpers/scripts/astro/solar/sunData'
import { ComputedSunInfos } from '../helpers/types/objects/ComputedSunInfos'
import { calculateDayPercentage } from '../helpers/scripts/astro/calculateDayPercentage'
import DSOValues from '../components/commons/DSOValues'
import { convertDegreesRaToHMS } from '../helpers/scripts/astro/coords/convertDegreesRaToHMS'
import { convertDegreesDecToDMS } from '../helpers/scripts/astro/coords/convertDegreesDecToDms'
import { formatKm } from '../helpers/scripts/utils/formatters/formaters'
import VisibilityGraph from '../components/graphs/VisibilityGraph'

export default function SolarWeather({ navigation }: any) {

  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()

  const sunVideoRef = useRef<any>(null);
  const cmeVideoRef = useRef<any>(null);

  const [sunData, setSunData] = useState<ComputedSunInfos | null>(null);

  // SUN
  const [loadingImage, setLoadingImage] = useState<boolean>(false)
  const [isSunVideoBuffering, setIsSunVideoBuffering] = useState<boolean>(false)
  const [isImageMode, setIsImageMode] = useState<boolean>(true)
  const [currentImageFilter, setCurrentImageFilter] = useState<ESunFilter>('HMI_IC' as ESunFilter)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>("")
  // Video URL is stable — stamped once on filter change, not inline in render
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | undefined>(undefined)

  // CME
  const [, setLoadingCME] = useState<boolean>(false)
  const [isCmeVideoBuffering, setIsCmeVideoBuffering] = useState<boolean>(false)
  const [isCmeImageMode, setIsCmeImageMode] = useState<boolean>(true)
  const [currentCmeImageFilter, setCurrentCmeImageFilter] = useState<ECmeFilters>('C2' as ECmeFilters)
  const [currentCmeImageUrl, setCurrentCmeImageUrl] = useState<string | undefined>("")
  const [currentCmeVideoUrl, setCurrentCmeVideoUrl] = useState<string | undefined>(undefined)

  const [solarWindData, setSolarWindData] = useState<SolarWindData[]>([])

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Solar Weather screen view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, [])

  useEffect(() => {
    (async () => {
      const data = await getSolarWindData();
      if(data) {
        setSolarWindData(data);
      }
    })()
  }, [])

  useEffect(() => {
    handleChangeSunImage(currentImageFilter, 'img')
    handleChangeCMEImage(currentCmeImageFilter, 'img')
  }, [])

  useEffect(() => {
    const periodicUpdate = setInterval(() => {
      setSunData(getSunData(dayjs(), { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }))
    }, 2000); // 2 seconds interval

    return () => clearInterval(periodicUpdate);
  }, [])

  const handleChangeSunImage = (filter: ESunFilter, type: 'img' | 'video') => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'solar_weather_sun_filter_change', eventTypes.BUTTON_CLICK, { filter, type }, currentLocale)
    setCurrentImageFilter(filter)
    if (type === 'img') {
      setCurrentImageUrl(undefined)
      setLoadingImage(true)
      setTimeout(() => {
        setCurrentImageUrl(sunImagesSrcWavelengths[filter] + '?' + Date.now())
        setLoadingImage(false)
      }, 300)
    } else {
      // Stamp URL once here — not inline in render — to avoid re-fetching on every re-render
      setIsSunVideoBuffering(true)
      setCurrentVideoUrl(sunVideoSrcWavelengths[filter] + '?' + Date.now())
    }
  }

  const handleChangeCMEImage = (filter: ECmeFilters, type: 'img' | 'video') => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'solar_weather_cme_filter_change', eventTypes.BUTTON_CLICK, { filter, type }, currentLocale)
    setCurrentCmeImageFilter(filter)
    if (type === 'img') {
      setCurrentCmeImageUrl(undefined)
      setLoadingCME(true)
      setTimeout(() => {
        setCurrentCmeImageUrl(cmeImageSrc[filter] + '?' + Date.now())
        setLoadingCME(false)
      }, 300)
    } else {
      setIsCmeVideoBuffering(true)
      setCurrentCmeVideoUrl(cmeVideoSrc[filter] + '?' + Date.now())
    }
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.solar_weather.title')}
        subtitle={i18n.t('home.buttons.solar_weather.subtitle')}
        backRoute={routes.home.path}
      />
      <View style={globalStyles.screens.separator} />
      {/* <View style={{ marginBottom: 10 }}>
        <DisclaimerBar message={i18n.t('solarWeather.disclaimer')} type='error' soft />
      </View> */}
      <ScrollView>
        <View>
          {/* SUN EPHEMERIS */}
          <View style={solarWeatherStyles.container}>
            <Text style={solarWeatherStyles.container.title}>{i18n.t('solarWeather.containers.ephemerids.title')}</Text>
            <Text style={solarWeatherStyles.container.subtitle}>{i18n.t('solarWeather.containers.ephemerids.subtitle')}</Text>

            {
              sunData && sunData.visibility.sunrise && sunData.visibility.sunset ? (
                <>
                  <View style={{ marginTop: 30 }}>
                  <EphemerisBar
                    mode={sunData.visibility.isCurrentlyVisible ? 'day' : 'night'}
                    percentage={calculateDayPercentage(sunData.visibility.sunrise, sunData.visibility.sunset, sunData.visibility.isCurrentlyVisible ? 0 : 1)}
                    sunrise={sunData.visibility.sunrise.format('HH:mm')}
                    sunset={sunData.visibility.sunset.format('HH:mm')}
                      riseIcon={sunData.visibility.isCurrentlyVisible ? require('../../assets/icons/FiSunrise.png') : require('../../assets/icons/FiSunset.png')}
                      setIcon={sunData.visibility.isCurrentlyVisible ? require('../../assets/icons/FiSunset.png') : require('../../assets/icons/FiSunrise.png')}
                    />
                  </View>
                  <DSOValues title={i18n.t('common.coordinates.rightAscension')} value={convertDegreesRaToHMS(sunData.base.ra)} chipValue wideChip />
                  <DSOValues title={i18n.t('common.coordinates.declination')} value={convertDegreesDecToDMS(sunData.base.dec)} chipValue wideChip />
                  <DSOValues title={i18n.t('common.coordinates.angularDiameter')} value={sunData.base.angularDiameter.toFixed(2)} chipValue wideChip />
                  <DSOValues title={i18n.t('common.coordinates.distance')} value={formatKm(sunData.base.distance, currentLocale)} chipValue wideChip />
                  <DSOValues title={i18n.t('common.coordinates.altitude')} value={`${sunData.base.alt.toFixed(2)}°`} chipValue wideChip />
                  <DSOValues title={i18n.t('common.coordinates.constellation')} value={sunData.base.constellation} chipValue wideChip />

                  <VisibilityGraph visibilityGraph={sunData.visibility.visibilityGraph} />
                </>
              ) : (
                <ActivityIndicator size="large" color={app_colors.white} style={{ marginTop: 20 }} />
              )
            }
          </View>

          {/* SUN CONTAINER */}
          <View style={solarWeatherStyles.container}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => { sendAnalyticsEvent(currentUser, currentUserLocation, 'solar_weather_sun_image_mode_click', eventTypes.BUTTON_CLICK, { mode: 'image' }, currentLocale); setIsImageMode(true) }} style={{ height: 35, flex: 1, borderBottomWidth: isImageMode ? 1 : 0, borderColor: app_colors.white, marginBottom: 10, padding: 5 }}>
                <Text style={{ fontFamily: 'GilroyBlack', color: app_colors.white, textTransform: 'uppercase', textAlign: "center", fontSize: 18 }}>{i18n.t('solarWeather.containers.switches.image')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { sendAnalyticsEvent(currentUser, currentUserLocation, 'solar_weather_sun_video_mode_click', eventTypes.BUTTON_CLICK, { mode: 'video' }, currentLocale); setIsImageMode(false); handleChangeSunImage(currentImageFilter, 'video') }} style={{ height: 35, flex: 1, borderBottomWidth: isImageMode ? 0 : 1, borderColor: app_colors.white, marginBottom: 10, padding: 5 }}>
                <Text style={{ fontFamily: 'GilroyBlack', color: app_colors.white, textTransform: 'uppercase', textAlign: "center", fontSize: 18 }}>{i18n.t('solarWeather.containers.switches.video')}</Text>
              </TouchableOpacity>
            </View>
            <Text style={solarWeatherStyles.container.title}>{i18n.t('solarWeather.containers.instrument', { currentImageFilter: currentImageFilter })}</Text>
            <Text style={[solarWeatherStyles.container.subtitle, { opacity: 1 }]}>{i18n.t('solarWeather.containers.zone', { zone: loadingImage ? i18n.t('common.loadings.simple') : i18n.t(`solarWeather.studyZones.${currentImageFilter}`) })}</Text>
            <Text style={solarWeatherStyles.container.subtitle}>{i18n.t('solarWeather.sources.sdoSoho')}</Text>
            {
              isImageMode ?
                <Image priority={'high'} placeholder={localizedImagePlaceholders[i18n.locale]} placeholderContentFit={'contain'} contentFit={'contain'} source={!currentImageUrl ? undefined : { uri: currentImageUrl }} style={solarWeatherStyles.sunImage} />
                :
                <View style={{ width: Dimensions.get('window').width - 40, height: Dimensions.get('window').width - 40, marginVertical: 10, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: app_colors.white_twenty }}>
                  {currentVideoUrl && (
                    <Video
                      ref={sunVideoRef}
                      source={{ uri: currentVideoUrl }}
                      isMuted={true}
                      shouldPlay={true}
                      rate={2.0}
                      isLooping={true}
                      resizeMode={ResizeMode.CONTAIN}
                      style={{ width: '100%', height: '100%' }}
                      onPlaybackStatusUpdate={(status) => {
                        if (status.isLoaded) setIsSunVideoBuffering(status.isBuffering && !status.isPlaying)
                      }}
                      onReadyForDisplay={() => setIsSunVideoBuffering(false)}
                    />
                  )}
                  {(isSunVideoBuffering || !currentVideoUrl) && (
                    <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.55)' }}>
                      <ActivityIndicator size="large" color={app_colors.white} />
                    </View>
                  )}
                </View>
            }
            <View style={solarWeatherStyles.container.buttons}>
              {
                Object.keys(ESunFilter).map((key: string) => {
                  return (
                    <SimpleButton textColor={app_colors.white} small key={key} text={key} onPress={() => handleChangeSunImage(ESunFilter[key as keyof typeof ESunFilter], isImageMode ? 'img' : 'video')} active={key === currentImageFilter} />
                  )
                })
              }
            </View>
          </View>

          {/* CME CONTAINER */}
          <View style={solarWeatherStyles.container}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => { sendAnalyticsEvent(currentUser, currentUserLocation, 'solar_weather_cme_image_mode_click', eventTypes.BUTTON_CLICK, { mode: 'image' }, currentLocale); setIsCmeImageMode(true) }} style={{ height: 35, flex: 1, borderBottomWidth: isCmeImageMode ? 1 : 0, borderColor: app_colors.white, marginBottom: 10, padding: 5 }}>
                <Text style={{ fontFamily: 'GilroyBlack', color: app_colors.white, textTransform: 'uppercase', textAlign: "center", fontSize: 18 }}>{i18n.t('solarWeather.containers.switches.image')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { sendAnalyticsEvent(currentUser, currentUserLocation, 'solar_weather_cme_video_mode_click', eventTypes.BUTTON_CLICK, { mode: 'video' }, currentLocale); setIsCmeImageMode(false); handleChangeCMEImage(currentCmeImageFilter, 'video') }} style={{ height: 35, flex: 1, borderBottomWidth: isCmeImageMode ? 0 : 1, borderColor: app_colors.white, marginBottom: 10, padding: 5 }}>
                <Text style={{ fontFamily: 'GilroyBlack', color: app_colors.white, textTransform: 'uppercase', textAlign: "center", fontSize: 18 }}>{i18n.t('solarWeather.containers.switches.video')}</Text>
              </TouchableOpacity>
            </View>
            <Text style={solarWeatherStyles.container.title}>{i18n.t('solarWeather.containers.emc')}</Text>
            <Text style={solarWeatherStyles.container.subtitle}>{i18n.t('solarWeather.sources.soho')}</Text>
            {
              isCmeImageMode ?
                <Image priority={'high'} placeholder={localizedImagePlaceholders[i18n.locale]} placeholderContentFit={'contain'} contentFit={'contain'} cachePolicy={'none'} source={!currentCmeImageUrl ? undefined : { uri: currentCmeImageUrl }} style={solarWeatherStyles.sunImage} />
                :
                <View style={{ width: Dimensions.get('window').width - 40, height: Dimensions.get('window').width - 40, marginVertical: 10, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: app_colors.white_twenty }}>
                  {currentCmeVideoUrl && (
                    <Video
                      ref={cmeVideoRef}
                      source={{ uri: currentCmeVideoUrl }}
                      isMuted={true}
                      shouldPlay={true}
                      rate={1.0}
                      isLooping={true}
                      resizeMode={ResizeMode.CONTAIN}
                      style={{ width: '100%', height: '100%' }}
                      onPlaybackStatusUpdate={(status) => {
                        if (status.isLoaded) setIsCmeVideoBuffering(status.isBuffering && !status.isPlaying)
                      }}
                      onReadyForDisplay={() => setIsCmeVideoBuffering(false)}
                    />
                  )}
                  {(isCmeVideoBuffering || !currentCmeVideoUrl) && (
                    <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.55)' }}>
                      <ActivityIndicator size="large" color={app_colors.white} />
                    </View>
                  )}
                </View>
            }
            <View style={solarWeatherStyles.container.buttons}>
              {
                Object.keys(ECmeFilters).map((key: string) => {
                  return (
                    <SimpleButton textColor={app_colors.white} small key={key} text={key} onPress={() => handleChangeCMEImage(ECmeFilters[key as keyof typeof ECmeFilters], isCmeImageMode ? 'img' : 'video')} active={key === currentCmeImageFilter} />
                  )
                })
              }
            </View>
          </View>

          {/* SUNSPOTS CONTAINER */}
          <View style={solarWeatherStyles.container}>
            <Text style={solarWeatherStyles.container.title}>{i18n.t('solarWeather.containers.sunspots')}</Text>
            <Text style={solarWeatherStyles.container.subtitle}>{i18n.t('solarWeather.sources.soho')}</Text>
            {/*<DisclaimerBar message={"Service temporairement indisponible."} type={"error"}/>*/}
            <Image placeholder={localizedImagePlaceholders[i18n.locale]} cachePolicy={'none'} source={{ uri: "https://soho.nascom.nasa.gov/data/synoptic/sunspots_earth/mdi_sunspots.jpg" }} style={solarWeatherStyles.sunImage} />
          </View>

          {/* AURORA CONTAINER */}
          <View style={solarWeatherStyles.container}>
            <Text style={solarWeatherStyles.container.title}>{i18n.t('solarWeather.containers.northenAurora')}</Text>
            <Text style={solarWeatherStyles.container.subtitle}>{i18n.t('solarWeather.sources.noaa')}</Text>
            <Image placeholder={localizedForecastPlaceholders[i18n.locale]} cachePolicy={'none'} source={{ uri: "https://services.swpc.noaa.gov/images/animations/ovation/north/latest.jpg" }} style={solarWeatherStyles.sunImage} />
          </View>

          <View style={solarWeatherStyles.container}>
            <Text style={solarWeatherStyles.container.title}>{i18n.t('solarWeather.containers.southernAurora')}</Text>
            <Text style={solarWeatherStyles.container.subtitle}>{i18n.t('solarWeather.sources.noaa')}</Text>
            <Image placeholder={localizedForecastPlaceholders[i18n.locale]} cachePolicy={'none'} source={{ uri: "https://services.swpc.noaa.gov/images/animations/ovation/south/latest.jpg" }} style={solarWeatherStyles.sunImage} />
          </View>

          {/* KP INDEXES CONTAINER */}
          <View style={solarWeatherStyles.container}>
            <Text style={solarWeatherStyles.container.title}>{i18n.t('solarWeather.containers.kpIndexes')}</Text>
            <Text style={[solarWeatherStyles.container.subtitle, {marginBottom: 10}]}>{i18n.t('solarWeather.sources.noaa')}</Text>
            <Text style={[solarWeatherStyles.container.subtitle, {marginBottom: 10}]}>{i18n.t('solarWeather.sources.kpNotice')}</Text>
            <Text style={[solarWeatherStyles.container.subtitle, {marginBottom: 10}]}>{i18n.t('solarWeather.sources.kpExplanation')}</Text>
            {
              isProUser(currentUser) ?
                <KpChart />
                :
              <ProLocker id={routes.solarWeather.path} darker navigation={navigation} image={require('../../assets/images/tools/sun.png')} />
            }
          </View>

          {/* SOLAR WINDS CONTAINER */}
          <View style={solarWeatherStyles.container}>
            <Text style={solarWeatherStyles.container.title}>{i18n.t('solarWeather.containers.solarWinds')}</Text>
            <Text style={[solarWeatherStyles.container.subtitle, {marginBottom: 10}]}>{i18n.t('solarWeather.sources.noaa')}</Text>
            <Text style={[solarWeatherStyles.container.subtitle, {marginBottom: 10}]}>{i18n.t('solarWeather.sources.kpNotice')}</Text>
            {
              isProUser(currentUser) ?
                <>
                  {
                    solarWindData.length !== 0 && (
                      <>
                        <Text style={[solarWeatherStyles.container.title, {fontSize: 15, marginBottom: 10}]}>{i18n.t('solarWeather.solarWinds.speed')}</Text>
                        <LineGraph yMin={100} yMax={1200} data={solarWindData} field={"speed"} lineColor={app_colors.turquoise} leftMargin={55} rightMargin={10}/>
                        <Text style={[solarWeatherStyles.container.title, {fontSize: 15, marginBottom: 10}]}>{i18n.t('solarWeather.solarWinds.density')}</Text>
                        <LineGraph yMin={-4} yMax={100} data={solarWindData} field={"density"} lineColor={app_colors.green} leftMargin={55} rightMargin={10}/>
                        <Text style={[solarWeatherStyles.container.title, {fontSize: 15, marginBottom: 10}]}>{i18n.t('solarWeather.solarWinds.temperature')}</Text>
                        <LineGraph shortNumbers yMin={-100000} yMax={600000} data={solarWindData} field={"temperature"} lineColor={app_colors.orange} leftMargin={65} rightMargin={10}/>
                      </>
                    )
                  }
                </>
                :
                <ProLocker id={routes.solarWeather.path} darker navigation={navigation} image={require('../../assets/images/tools/sun.png')} />
            }
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
