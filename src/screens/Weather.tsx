import React, { useEffect, useState } from 'react'
import { Image, Keyboard, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { weatherStyles } from '../styles/screens/weather'
import { useSettings } from '../contexts/AppSettingsContext'
import { getWeather } from '../helpers/api/getWeather'
import { LocationObject } from '../helpers/types/LocationObject'
import PageTitle from '../components/commons/PageTitle'
import InputWithIcon from '../components/forms/InputWithIcon'
import SingleValue from '../components/weather/SingleValue'
import { getCityCoords } from '../helpers/api/getCityCoords'
import { convertDDtoDMS } from '../helpers/scripts/convertDDtoDMSCoords'
import dayjs from 'dayjs'
import { calculateDayPercentage } from '../helpers/scripts/astro/calculateDayPercentage'
import WeatherOverview from '../components/weather/WeatherOverview'
import Ephemeris from '../components/weather/Ephemeris'

export default function Weather({ navigation }: any) {
  
  const { currentUserLocation } = useSettings();
  const [searchString, setSearchString] = useState<string>('')
  const [searchedCity, setSearchedCity] = useState<LocationObject | null>(null)
  const [weather, setWeather] = useState<any>(null)

  useEffect(() => {
    getCurrent()
  }, [])

  const getCurrent = async () => {
    if (currentUserLocation) {
      const weather = await getWeather(currentUserLocation.lat, currentUserLocation.lon)
      setWeather(weather)
      setSearchedCity(null)
      setSearchString('')
    }
  }

  const searchWeather = async () => {
    if (searchString === '') {
      return
    }

    Keyboard.dismiss();
    
    const cityCoords = await getCityCoords(searchString)
    if (cityCoords.length === 0) return;

    const city: LocationObject = {
      lat: cityCoords[0].lat,
      lon: cityCoords[0].lon,
      common_name: cityCoords[0].local_names.fr,
      country: cityCoords[0].country,
      state: cityCoords[0].state || '',
      dms: convertDDtoDMS(cityCoords[0].lat, cityCoords[0].lon)
    }
   
    const searchedWeather = await getWeather(city.lat, city.lon)
    setSearchedCity(city)    
    setWeather(searchedWeather)
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title="Météo en direct" subtitle="// C'est l'heure de sortir le télescope !" />
      <View style={globalStyles.screens.separator} />
      <View style={weatherStyles.content}>
        <InputWithIcon icon={require('../../assets/icons/FiSearch.png')} placeholder="Rechercher une ville" changeEvent={(text: string) => setSearchString(text)} search={() => searchWeather()} value={searchString} />
      </View>
      {
        searchedCity &&
        <TouchableOpacity style={weatherStyles.content.resetButton} onPress={() => getCurrent()}>
          <Image source={require('../../assets/icons/FiRepeat.png')} style={{ width: 20, height: 20, marginRight: 10}}/>
          <Text style={weatherStyles.content.text}>Retour à {currentUserLocation.common_name}</Text>
        </TouchableOpacity>
      }
      <WeatherOverview weather={weather} currentUserLocation={currentUserLocation} searchedCity={searchedCity} refresh={() => getCurrent()} />
      <Ephemeris weather={weather} />
    </View>
  )
}
