import React, { useEffect, useState } from 'react'
import { Image, Text, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { moonPhasesStyles } from '../styles/screens/moonPhases'
import PageTitle from '../components/commons/PageTitle'
import axios from 'axios'
import { solarWeatherStyles } from '../styles/screens/solarWeather'
import dayjs from 'dayjs'
import { ESunFilter } from '../helpers/types/SunFilter'
import { sunIMageFiltersDescription, sunImagesSrcWavelengths } from '../helpers/constants'
import SimpleButton from '../components/commons/buttons/SimpleButton'

export default function SolarWeather({ navigation }: any) {

  const [currentImageFilter, setCurrentImageFilter] = useState<ESunFilter>('HMIIC' as ESunFilter)
  const [currentImageUri, setCurrentImageUri] = useState<string>(sunImagesSrcWavelengths[currentImageFilter] as string)
  const [currentImageDate, setCurrentImageDate] = useState<string>('')

  useEffect(() => {
    console.log('Current image filter:', currentImageFilter);
    
    (async () => {
      const response = await axios.get(sunImagesSrcWavelengths[currentImageFilter])
      console.log('Response:', dayjs(response.request.responseHeaders['Date']).format('DD/MM/YYYY HH:mm:ss'));
      setCurrentImageDate(dayjs(response.request.responseHeaders['Date']).format('DD/MM/YYYY HH:mm:ss'))
      setCurrentImageUri(sunImagesSrcWavelengths[currentImageFilter])
    })()
  }, [currentImageFilter])
  
  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title="Météo solaire" subtitle="// Météo de notre étoile en direct" />
      <View style={globalStyles.screens.separator} />
      <View style={moonPhasesStyles.content}>
        <View style={solarWeatherStyles.container}>
          <Text style={solarWeatherStyles.container.title}>Dernières images</Text>
          <Text style={solarWeatherStyles.container.subtitle}>Source : NASA / SDO (Solar Dynamics Observatory)</Text>
          <Text style={solarWeatherStyles.container.subtitle}>Image capturée le : {currentImageDate}</Text>
          <Text style={[solarWeatherStyles.container.subtitle, {marginTop: 8}]}>Filtre : {currentImageFilter}</Text>
          <Text style={solarWeatherStyles.container.subtitle}>Zone d'étude : {sunIMageFiltersDescription[currentImageFilter]}</Text>
          <Image source={{ uri: currentImageUri }} style={solarWeatherStyles.sunImage} />
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
