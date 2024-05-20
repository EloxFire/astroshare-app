import React, { useEffect, useState } from 'react'
import { Image, Text, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { moonPhasesStyles } from '../styles/screens/moonPhases'
import PageTitle from '../components/commons/PageTitle'
import axios from 'axios'
import { solarWeatherStyles } from '../styles/screens/solarWeather'
import dayjs from 'dayjs'

export default function SolarWeather({ navigation }: any) {

  const [sunImage, setSunImage] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const response = await axios.get('https://sdo.gsfc.nasa.gov/assets/img/browse/2024/05/20/20240520_000000_1024_HMIIC.jpg', {responseType: 'arraybuffer'})
      if (response) {
        setSunImage('data:image/png;base64,' + response.request._response)
        console.log(response.request.responseHeaders);
        
      }
      
    })() 
  }, [])
  
  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title="Météo solaire et aurores" subtitle="// Météo de notre étoile en direct" />
      <View style={globalStyles.screens.separator} />
      <View style={moonPhasesStyles.content}>
        <View style={solarWeatherStyles.container}>
          <Text style={solarWeatherStyles.container.title}>Dernière image</Text>
          <Text style={solarWeatherStyles.container.subtitle}>Source : NASA / SDO (Solar Dynamics Observatory)</Text>
          <Text style={solarWeatherStyles.container.subtitle}>Image capturée le : </Text>
          <Image source={{uri: sunImage ? sunImage : ""}} style={solarWeatherStyles.sunImage} />
        </View>
      </View>
    </View>
  )
}
