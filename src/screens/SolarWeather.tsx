import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { moonPhasesStyles } from '../styles/screens/moonPhases'
import { solarWeatherStyles } from '../styles/screens/solarWeather'
import { ESunFilter } from '../helpers/types/SunFilter'
import { app_colors, sunIMageFiltersDescription, sunImagesSrcWavelengths, sunVideoSrcWavelengths } from '../helpers/constants'
import { ResizeMode, Video } from 'expo-av'
import axios from 'axios'
import dayjs from 'dayjs'
import PageTitle from '../components/commons/PageTitle'
import SimpleButton from '../components/commons/buttons/SimpleButton'

export default function SolarWeather({ navigation }: any) {

  const videoRef = useRef(null);

  const [loadingImage, setLoadingImage] = useState<boolean>(true)
  const [isImageMode, setIsImageMode] = useState<boolean>(true)
  const [currentImageFilter, setCurrentImageFilter] = useState<ESunFilter>('HMI_IC' as ESunFilter)
  const [currentImageUri, setCurrentImageUri] = useState<string>(sunImagesSrcWavelengths[currentImageFilter] as string)
  const [currentImageDate, setCurrentImageDate] = useState<string>('')

  useEffect(() => {
    (async () => {
      setLoadingImage(true)
      const finalUri = isImageMode ? sunImagesSrcWavelengths[currentImageFilter] : sunVideoSrcWavelengths[currentImageFilter]
      const response = await axios.get(finalUri)
      setCurrentImageDate(dayjs(response.request.responseHeaders['Last-Modified']).format('DD/MM/YYYY HH:mm:ss'))
      setCurrentImageUri(finalUri)
      setLoadingImage(false)
    })()
  }, [currentImageFilter, isImageMode])
  
  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title="Météo solaire" subtitle="// Météo de notre étoile en direct" />
      <View style={globalStyles.screens.separator} />
      <View style={moonPhasesStyles.content}>
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
      </View>
    </View>
  )
}
