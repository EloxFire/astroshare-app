import React, { useEffect, useRef, useState } from 'react'
import { app_colors, cmeImageDescription, cmeImageSrc, cmeVideoSrc, sunIMageFiltersDescription, sunImagesSrcWavelengths, sunVideoSrcWavelengths } from '../helpers/constants'
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { moonPhasesStyles } from '../styles/screens/moonPhases'
import { solarWeatherStyles } from '../styles/screens/solarWeather'
import { ESunFilter } from '../helpers/types/SunFilter'
import { ResizeMode, Video } from 'expo-av'
import { ECmeFilters } from '../helpers/types/CmeFilters'
import axios from 'axios'
import dayjs from 'dayjs'
import PageTitle from '../components/commons/PageTitle'
import SimpleButton from '../components/commons/buttons/SimpleButton'

export default function SolarWeather({ navigation }: any) {

  const videoRef = useRef(null);

  // SUN
  const [loadingImage, setLoadingImage] = useState<boolean>(true)
  const [isImageMode, setIsImageMode] = useState<boolean>(true)
  const [currentImageFilter, setCurrentImageFilter] = useState<ESunFilter>('HMI_IC' as ESunFilter)
  const [currentImageUri, setCurrentImageUri] = useState<string>(sunImagesSrcWavelengths[currentImageFilter] as string)
  const [currentImageDate, setCurrentImageDate] = useState<string>('')

  // CME
  const [loadingCME, setLoadingCME] = useState<boolean>(true)
  const [isCmeImageMode, setIsCmeImageMode] = useState<boolean>(true)
  const [currentCmeImageFilter, setCurrentCmeImageFilter] = useState<ECmeFilters>('C2' as ECmeFilters)
  const [currentCmeImageUri, setCurrentCmeImageUri] = useState<string>(cmeImageSrc[currentCmeImageFilter] as string)
  const [currentCmeImageDate, setCurrentCmeImageDate] = useState<string>('')

  useEffect(() => {
    (async () => {
      console.log("Fetching sun image");
      setLoadingImage(true)
      const finalUri = isImageMode ? sunImagesSrcWavelengths[currentImageFilter] : sunVideoSrcWavelengths[currentImageFilter]
      const response = await axios.get(finalUri)
      setCurrentImageDate(dayjs(response.request.responseHeaders['Last-Modified']).format('DD/MM/YYYY HH:mm:ss'))
      setCurrentImageUri(finalUri)
      setLoadingImage(false)
    })()
  }, [currentImageFilter, isImageMode])

  useEffect(() => {
    (async () => {
      console.log("Fetching CME image");
      setLoadingCME(true)
      const finalUri = isCmeImageMode ? cmeImageSrc[currentCmeImageFilter] : cmeVideoSrc[currentCmeImageFilter]
      const response = await axios.get(finalUri)
      
      setCurrentCmeImageDate(dayjs(response.request.responseHeaders['Last-Modified']).format('DD/MM/YYYY HH:mm:ss'))
      setCurrentCmeImageUri(finalUri)
      setLoadingCME(false)
    })()
  }, [currentCmeImageFilter, isCmeImageMode])
  
  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title="Météo solaire" subtitle="// Météo de notre étoile en direct" />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={moonPhasesStyles.content}>
          {/* SUN CONTAINER */}
          <View style={solarWeatherStyles.container}>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => setIsImageMode(true)} style={{height: 35, flex: 1, borderBottomWidth: isImageMode ? 1 : 0, borderColor: app_colors.white, marginBottom: 10, padding: 5}}>
                <Text style={{fontFamily: 'GilroyBlack', color: app_colors.white, textTransform: 'uppercase', textAlign: "center", fontSize: 18}}>Image</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsImageMode(false)} style={{height: 35, flex: 1, borderBottomWidth: isImageMode ? 0 : 1, borderColor: app_colors.white, marginBottom: 10, padding: 5}}>
                <Text style={{fontFamily: 'GilroyBlack', color: app_colors.white, textTransform: 'uppercase', textAlign: "center", fontSize: 18}}>Vidéo</Text>
              </TouchableOpacity>
            </View>
            <Text style={solarWeatherStyles.container.title}>Instrument : {currentImageFilter}</Text>
            <Text style={[solarWeatherStyles.container.subtitle, { opacity: 1}]}>Zone d'étude : {loadingImage ? "Chargement" : sunIMageFiltersDescription[currentImageFilter]}</Text>
            <Text style={[solarWeatherStyles.container.subtitle, {marginTop: 8}]}>Image capturée le : {loadingImage ? "Chargement" : currentImageDate}</Text>
            <Text style={solarWeatherStyles.container.subtitle}>Source : NASA / SDO (Solar Dynamics Observatory)</Text>
            {
              isImageMode ?
              <Image source={{ uri: currentImageUri }} style={[solarWeatherStyles.sunImage, { opacity: loadingImage ? .1 : 1, borderWidth: loadingImage ? 1 : 0, borderColor: app_colors.white_eighty }]} />
              :
              <Video
              ref={videoRef}
              source={{uri: currentImageUri}}
              isMuted={true}
              shouldPlay={loadingImage ? false : true}
              rate={2.0}
              onLoadStart={() => setLoadingImage(true)}
              onLoad={() => setLoadingImage(false)}
              isLooping={true}
              resizeMode={ResizeMode.CONTAIN}
              style={{ width: Dimensions.get('window').width - 40, height: Dimensions.get('window').width - 40, marginVertical: 10, borderRadius: 10, opacity: loadingImage ? .1 : 1, borderWidth: loadingImage ? 1 : 0, borderColor: app_colors.white_eighty}}
              />
            }
            <View style={solarWeatherStyles.container.buttons}>
              {
                Object.keys(ESunFilter).map((key: string) => {
                  return (
                    <SimpleButton key={key} text={key} onPress={() => setCurrentImageFilter(ESunFilter[key as keyof typeof ESunFilter])} />
                  )
                })
              }
            </View>
          </View>

          {/* CME CONTAINER */}
          <View style={solarWeatherStyles.container}>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => setIsCmeImageMode(true)} style={{height: 35, flex: 1, borderBottomWidth: isCmeImageMode ? 1 : 0, borderColor: app_colors.white, marginBottom: 10, padding: 5}}>
                <Text style={{fontFamily: 'GilroyBlack', color: app_colors.white, textTransform: 'uppercase', textAlign: "center", fontSize: 18}}>Image</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsCmeImageMode(false)} style={{height: 35, flex: 1, borderBottomWidth: isCmeImageMode ? 0 : 1, borderColor: app_colors.white, marginBottom: 10, padding: 5}}>
                <Text style={{fontFamily: 'GilroyBlack', color: app_colors.white, textTransform: 'uppercase', textAlign: "center", fontSize: 18}}>Vidéo</Text>
              </TouchableOpacity>
            </View>
            <Text style={solarWeatherStyles.container.title}>Ejections de Masse Coronale (EMC)</Text>
              <Text style={[solarWeatherStyles.container.subtitle, { opacity: 1}]}>Zone d'étude : {loadingCME ? "Chargement" : cmeImageDescription[currentCmeImageFilter]}</Text>
              <Text style={[solarWeatherStyles.container.subtitle, {marginTop: 8}]}>Image capturée le : {loadingCME ? "Chargement" : currentCmeImageDate}</Text>
            <Text style={solarWeatherStyles.container.subtitle}>Source : NASA / SoHO (Solar and Heliospheric Observatory)</Text>
            {
              isCmeImageMode ?
                <Image source={{ uri: currentCmeImageUri }} style={[solarWeatherStyles.sunImage, { opacity: loadingCME ? .1 : 1, borderWidth: loadingCME ? 1 : 0, borderColor: app_colors.white_eighty }]} />
              :
              <Video
                ref={videoRef}
                source={{uri: currentCmeImageUri}}
                isMuted={true}
                shouldPlay={loadingCME ? false : true}
                rate={1.0}
                onLoadStart={() => setLoadingCME(true)}
                onLoad={() => setLoadingCME(false)}
                isLooping={true}
                resizeMode={ResizeMode.CONTAIN}
                style={{ width: Dimensions.get('window').width - 40, height: Dimensions.get('window').width - 40, marginVertical: 10, borderRadius: 10, opacity: loadingCME ? .1 : 1, borderWidth: loadingCME ? 1 : 0, borderColor: app_colors.white_eighty}}
              />
            }
            <View style={solarWeatherStyles.container.buttons}>
              {
                Object.keys(ECmeFilters).map((key: string) => {
                  return (
                    <SimpleButton key={key} text={key} onPress={() => setCurrentCmeImageFilter(ECmeFilters[key as keyof typeof ECmeFilters])} />
                  )
                })
              }
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
