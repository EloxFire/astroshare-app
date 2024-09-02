import React, { useEffect, useRef, useState } from 'react'
import { app_colors, cmeImageSrc, cmeVideoSrc, sunImagesSrcWavelengths, sunVideoSrcWavelengths } from '../helpers/constants'
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { moonPhasesStyles } from '../styles/screens/moonPhases'
import { solarWeatherStyles } from '../styles/screens/solarWeather'
import { ESunFilter } from '../helpers/types/SunFilter'
import { ResizeMode, Video } from 'expo-av'
import { ECmeFilters } from '../helpers/types/CmeFilters'
import { Image } from 'expo-image'
import { localizedForecastPlaceholders, localizedImagePlaceholders, localizedVideoPlaceholders } from '../helpers/scripts/loadImages'
import { i18n } from '../helpers/scripts/i18n'
import PageTitle from '../components/commons/PageTitle'
import SimpleButton from '../components/commons/buttons/SimpleButton'

export default function SolarWeather({ navigation }: any) {

  const videoRef = useRef(null);

  // SUN
  const [loadingImage, setLoadingImage] = useState<boolean>(false)
  const [isImageMode, setIsImageMode] = useState<boolean>(true)
  const [currentImageFilter, setCurrentImageFilter] = useState<ESunFilter>('HMI_IC' as ESunFilter)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>("")

  // CME
  const [loadingCME, setLoadingCME] = useState<boolean>(false)
  const [isCmeImageMode, setIsCmeImageMode] = useState<boolean>(true)
  const [currentCmeImageFilter, setCurrentCmeImageFilter] = useState<ECmeFilters>('C2' as ECmeFilters)
  const [currentCmeImageUrl, setCurrentCmeImageUrl] = useState<string | undefined>("")


  useEffect(() => {
    handleChangeSunImage(currentImageFilter, 'img')
    handleChangeCMEImage(currentCmeImageFilter, 'img')
  }, [])

  const handleChangeSunImage = (filter: ESunFilter, type: 'img' | 'video') => {
    setCurrentImageUrl(undefined)
    setLoadingImage(true)

    setTimeout(() => {
      setCurrentImageFilter(filter)
      setCurrentImageUrl(type === 'img' ? sunImagesSrcWavelengths[filter] + '?' + new Date() : sunVideoSrcWavelengths[filter] + '?' + new Date())
      setLoadingImage(false)
    }, 300)
  }

  const handleChangeCMEImage = (filter: ECmeFilters, type: 'img' | 'video') => {
    setCurrentCmeImageUrl(undefined)
    setLoadingCME(true)

    setTimeout(() => {
      setCurrentCmeImageFilter(filter)
      setCurrentCmeImageUrl(type === 'img' ? cmeImageSrc[filter] + '?' + new Date() : cmeVideoSrc[filter] + '?' + new Date())
      setLoadingCME(false)
    }, 300)
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title={i18n.t('home.buttons.solar_weather.title')} subtitle={i18n.t('home.buttons.solar_weather.subtitle')} />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={moonPhasesStyles.content}>
          {/* SUN CONTAINER */}
          <View style={solarWeatherStyles.container}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => setIsImageMode(true)} style={{ height: 35, flex: 1, borderBottomWidth: isImageMode ? 1 : 0, borderColor: app_colors.white, marginBottom: 10, padding: 5 }}>
                <Text style={{ fontFamily: 'GilroyBlack', color: app_colors.white, textTransform: 'uppercase', textAlign: "center", fontSize: 18 }}>{i18n.t('solarWeather.containers.switches.image')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsImageMode(false)} style={{ height: 35, flex: 1, borderBottomWidth: isImageMode ? 0 : 1, borderColor: app_colors.white, marginBottom: 10, padding: 5 }}>
                <Text style={{ fontFamily: 'GilroyBlack', color: app_colors.white, textTransform: 'uppercase', textAlign: "center", fontSize: 18 }}>{i18n.t('solarWeather.containers.switches.video')}</Text>
              </TouchableOpacity>
            </View>
            <Text style={solarWeatherStyles.container.title}>{i18n.t('solarWeather.containers.instrument', { currentImageFilter: currentImageFilter })}</Text>
            <Text style={[solarWeatherStyles.container.subtitle, { opacity: 1 }]}>{i18n.t('solarWeather.containers.zone', { zone: loadingImage ? i18n.t('common.loadings.simple') : i18n.t(`solarWeather.studyZones.${currentImageFilter}`) })}</Text>
            <Text style={solarWeatherStyles.container.subtitle}>Source : NASA / SDO (Solar Dynamics Observatory)</Text>
            {
              isImageMode ?
                <Image priority={'high'} placeholder={localizedImagePlaceholders[i18n.locale]} source={!currentImageUrl ? undefined : { uri: currentImageUrl }} style={solarWeatherStyles.sunImage} />
                :
                <Video
                  ref={videoRef}
                  source={{ uri: sunVideoSrcWavelengths[currentImageFilter] + '?' + new Date() }}
                  isMuted={true}
                  shouldPlay={true}
                  rate={2.0}
                  isLooping={true}
                  resizeMode={ResizeMode.CONTAIN}
                  style={{ width: Dimensions.get('window').width - 40, height: Dimensions.get('window').width - 40, marginVertical: 10, borderRadius: 10, opacity: loadingImage ? .1 : 1, borderWidth: loadingImage ? 1 : 0, borderColor: app_colors.white_eighty }}
                >
                  <Image placeholder={localizedVideoPlaceholders[i18n.locale]} style={{ width: Dimensions.get('window').width - 40, height: Dimensions.get('window').width - 40, marginVertical: 10, borderRadius: 10 }} />
                </Video>
            }
            <View style={solarWeatherStyles.container.buttons}>
              {
                Object.keys(ESunFilter).map((key: string) => {
                  return (
                    <SimpleButton key={key} text={key} onPress={() => handleChangeSunImage(ESunFilter[key as keyof typeof ESunFilter], isImageMode ? 'img' : 'video')} active={key === currentImageFilter} />
                  )
                })
              }
            </View>
          </View>

          {/* CME CONTAINER */}
          <View style={solarWeatherStyles.container}>
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => setIsCmeImageMode(true)} style={{ height: 35, flex: 1, borderBottomWidth: isCmeImageMode ? 1 : 0, borderColor: app_colors.white, marginBottom: 10, padding: 5 }}>
                <Text style={{ fontFamily: 'GilroyBlack', color: app_colors.white, textTransform: 'uppercase', textAlign: "center", fontSize: 18 }}>{i18n.t('solarWeather.containers.switches.image')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsCmeImageMode(false)} style={{ height: 35, flex: 1, borderBottomWidth: isCmeImageMode ? 0 : 1, borderColor: app_colors.white, marginBottom: 10, padding: 5 }}>
                <Text style={{ fontFamily: 'GilroyBlack', color: app_colors.white, textTransform: 'uppercase', textAlign: "center", fontSize: 18 }}>{i18n.t('solarWeather.containers.switches.video')}</Text>
              </TouchableOpacity>
            </View>
            <Text style={solarWeatherStyles.container.title}>{i18n.t('solarWeather.containers.emc')}</Text>
            <Text style={solarWeatherStyles.container.subtitle}>Source : NASA / SoHO (Solar and Heliospheric Observatory)</Text>
            {
              isCmeImageMode ?
                <Image priority={'high'} placeholder={localizedImagePlaceholders[i18n.locale]} source={!currentCmeImageUrl ? undefined : { uri: currentCmeImageUrl }} style={solarWeatherStyles.sunImage} />
                :
                <Video
                  ref={videoRef}
                  source={{ uri: cmeVideoSrc[currentCmeImageFilter] + '?' + new Date() }}
                  isMuted={true}
                  shouldPlay={true}
                  rate={1.0}
                  isLooping={true}
                  resizeMode={ResizeMode.CONTAIN}
                  style={{ width: Dimensions.get('window').width - 40, height: Dimensions.get('window').width - 40, marginVertical: 10, borderRadius: 10, opacity: loadingCME ? .1 : 1, borderWidth: loadingCME ? 1 : 0, borderColor: app_colors.white_eighty }}
                >
                  <Image placeholder={localizedVideoPlaceholders[i18n.locale]} style={{ width: Dimensions.get('window').width - 40, height: Dimensions.get('window').width - 40, marginVertical: 10, borderRadius: 10 }} />
                </Video>
            }
            <View style={solarWeatherStyles.container.buttons}>
              {
                Object.keys(ECmeFilters).map((key: string) => {
                  return (
                    <SimpleButton key={key} text={key} onPress={() => handleChangeCMEImage(ECmeFilters[key as keyof typeof ECmeFilters], isCmeImageMode ? 'img' : 'video')} active={key === currentCmeImageFilter} />
                  )
                })
              }
            </View>
          </View>

          {/* SUNSPOTS CONTAINER */}
          <View style={solarWeatherStyles.container}>
            <Text style={solarWeatherStyles.container.title}>{i18n.t('solarWeather.containers.sunspots')}</Text>
            <Text style={solarWeatherStyles.container.subtitle}>Source : NASA / SoHO (Solar and Heliospheric Observatory)</Text>
            <Image placeholder={localizedImagePlaceholders[i18n.locale]} source={{ uri: "https://soho.nascom.nasa.gov/data/synoptic/sunspots_earth/mdi_sunspots.jpg" + '?' + new Date() }} style={solarWeatherStyles.sunImage} />
          </View>

          {/* AURORA CONTAINER */}
          <View style={solarWeatherStyles.container}>
            <Text style={solarWeatherStyles.container.title}>{i18n.t('solarWeather.containers.northenAurora')}</Text>
            <Text style={solarWeatherStyles.container.subtitle}>Source : NOAA Space Weather Prediction Center</Text>
            <Image placeholder={localizedForecastPlaceholders[i18n.locale]} source={{ uri: "https://services.swpc.noaa.gov/images/animations/ovation/north/latest.jpg" + '?' + new Date() }} style={solarWeatherStyles.sunImage} />
          </View>

          <View style={solarWeatherStyles.container}>
            <Text style={solarWeatherStyles.container.title}>{i18n.t('solarWeather.containers.southernAurora')}</Text>
            <Text style={solarWeatherStyles.container.subtitle}>Source : NOAA Space Weather Prediction Center</Text>
            <Image placeholder={localizedForecastPlaceholders[i18n.locale]} source={{ uri: "https://services.swpc.noaa.gov/images/animations/ovation/south/latest.jpg" + '?' + new Date() }} style={solarWeatherStyles.sunImage} />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
