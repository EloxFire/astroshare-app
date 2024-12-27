import React, {useEffect, useState} from 'react'
import {Image, Text, TouchableOpacity, View} from 'react-native'
import { issPassCardStyles } from '../../styles/components/cards/issPassCard'
import dayjs from 'dayjs';
import { useTranslation } from '../../hooks/useTranslation';
import {IssPass} from "../../helpers/types/IssPass";
import {getWeather} from "../../helpers/api/getWeather";
import {useSettings} from "../../contexts/AppSettingsContext";
import {weatherImages} from "../../helpers/scripts/loadImages";

interface IssPassCardProps {
  pass: IssPass;
  passIndex: number;
  navigation: any;
}

export default function IssPassCard({ pass, passIndex, navigation }: IssPassCardProps) {

  const {currentLocale} = useTranslation()
  const {currentUserLocation} = useSettings()

  const [passLength, setPassLength] = useState<string>('')
  const [passesWeather, setPassesWeather] = useState<any[]>([])

  // https://api.n2yo.com/rest/v1/satellite/visualpasses/25544/43.5314643/5.4508237/341/1/45/&apiKey=SQCWS8-7VQKED-JG2RHW-5DGF
  useEffect(() => {
    const date1 = dayjs.unix(pass.startUTC)
    const date2 = dayjs.unix(pass.endUTC)
    const diff = date2.diff(date1)
    setPassLength(dayjs.duration(diff).format('mm:ss').replace(':', 'm') + 's')
  }, []);

  useEffect(() => {
    // Get weather for the pass
    if(!currentUserLocation) return;
    (async () => {
      const weather = await getWeather(currentUserLocation.lat, currentUserLocation.lon)
      setPassesWeather(weather.daily)
    })()
  }, [currentUserLocation])

  useEffect(() => {
    console.log(passesWeather)
  }, [passesWeather])

  return (
    <TouchableOpacity style={issPassCardStyles.card}>
      <View>
        {/*<Image style={{width: 30, height: 30}} source={weatherImages[passesWeather[passIndex].icon]}/>*/}
        <Text style={[issPassCardStyles.card.text, {alignSelf: 'center'}]}>ISS</Text>
      </View>
      <View>
        <Text style={issPassCardStyles.card.text}>{dayjs.unix(pass.startUTC).format('HH:mm')}</Text>
        <Text style={issPassCardStyles.card.text}>{dayjs.unix(pass.startUTC).format('HH:mm')}</Text>
      </View>
      <View>
        <Text style={issPassCardStyles.card.text}>{passLength}</Text>
        <Text style={issPassCardStyles.card.text}>{pass.maxEl.toFixed(2)}°</Text>
      </View>
      <View>
        <Text style={issPassCardStyles.card.text}>{pass.startAz.toFixed(2)}°</Text>
        <Text style={issPassCardStyles.card.text}>{pass.maxAz.toFixed(2)}°</Text>
      </View>
    </TouchableOpacity>
  )
}
