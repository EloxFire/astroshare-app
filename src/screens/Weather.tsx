import React, { useEffect, useState } from 'react'
import { Image, Keyboard, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { weatherStyles } from '../styles/screens/weather'
import { useSettings } from '../contexts/AppSettingsContext'
import { getWeather } from '../helpers/api/getWeather'
import { LocationObject } from '../helpers/types/LocationObject'
import { getCityCoords } from '../helpers/api/getCityCoords'
import { getMoon } from '../helpers/api/getMoon'
import { convertDDtoDMS } from '../helpers/scripts/convertDDtoDMSCoords'
import PageTitle from '../components/commons/PageTitle'
import InputWithIcon from '../components/forms/InputWithIcon'
import SingleValue from '../components/weather/SingleValue'
import WeatherOverview from '../components/weather/WeatherOverview'
import Ephemeris from '../components/weather/Ephemeris'
import Hourly from '../components/weather/Hourly'
import Toast from 'react-native-root-toast'

export default function Weather({ navigation }: any) {
  
  const { currentUserLocation } = useSettings();
  const [searchString, setSearchString] = useState<string>('')
  const [searchedCity, setSearchedCity] = useState<LocationObject | null>(null)
  const [weather, setWeather] = useState<any>(null)
  const [moonInfos, setMoonInfos] = useState<any>(null)

  useEffect(() => {
    getCurrent()
  }, [])

  const getCurrent = async () => {
    if (currentUserLocation) {
      let toast = Toast.show('Aquisition de la météo', { duration: Toast.durations.LONG, position: Toast.positions.BOTTOM });
      setTimeout(() => {
        Toast.hide(toast);
      }, 2000)
      const weather = await getWeather(currentUserLocation.lat, currentUserLocation.lon)
      const moon = await getMoon(currentUserLocation.lat, currentUserLocation.lon)
      setWeather(weather)
      setMoonInfos(moon)
      setSearchedCity(null)
      setSearchString('')
      let toast2 = Toast.show('Succès', { duration: Toast.durations.LONG, position: Toast.positions.BOTTOM });
      setTimeout(() => {
        Toast.hide(toast2);
      }, 3000)
    }
  }

  const searchWeather = async () => {
    if (searchString === '') {
      return
    }

    let toast = Toast.show('Aquisition de la météo', { duration: Toast.durations.LONG, position: Toast.positions.BOTTOM });
    setTimeout(() => {
      Toast.hide(toast);
    }, 3000)

    setWeather(null)

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
    let toast2 = Toast.show('Succès', { duration: Toast.durations.LONG, position: Toast.positions.BOTTOM });
    setTimeout(() => {
      Toast.hide(toast2);
    }, 3000)
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
        <TouchableOpacity style={weatherStyles.weatherContainer.resetButton} onPress={() => getCurrent()}>
          <Image source={require('../../assets/icons/FiRepeat.png')} style={{ width: 15, height: 15, marginRight: 10}}/>
          <Text style={weatherStyles.content.text}>Retour à {currentUserLocation.common_name || ""}</Text>
        </TouchableOpacity>
      }
      <ScrollView>
        <WeatherOverview weather={weather} currentUserLocation={currentUserLocation} searchedCity={searchedCity} refresh={() => getCurrent()} />
        <Hourly weather={weather}/>
        <Ephemeris weather={weather} moonInfos={moonInfos} />
        <Text style={weatherStyles.weatherContainer.title}>Légende</Text>
        <View style={weatherStyles.legend}>
          <SingleValue icon={require('../../assets/icons/FiThermometer.png')} value="Température" />
          <SingleValue icon={require('../../assets/icons/FiUser.png')} value="Ressenti" />
          <SingleValue icon={require('../../assets/icons/FiDroplet.png')} value="Humidité" />
          <SingleValue icon={require('../../assets/icons/FiAlignCenter.png')} value="Nuages" />
          <SingleValue icon={require('../../assets/icons/FiWind.png')} value="Vent" />
          <SingleValue icon={require('../../assets/icons/FiCompass.png')} value="Direction vent" />
          <SingleValue icon={require('../../assets/icons/FiTrendingUp.png')} value="T max" />
          <SingleValue icon={require('../../assets/icons/FiTrendingDown.png')} value="T mini" />
        </View>
      </ScrollView>
    </View>
  )
}
