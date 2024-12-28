import React, {useEffect, useState} from 'react'
import {ActivityIndicator, Image, Text, TouchableOpacity, View} from 'react-native'
import { issPassCardStyles } from '../../styles/components/cards/issPassCard'
import dayjs from 'dayjs';
import {IssPass} from "../../helpers/types/IssPass";
import {weatherImages} from "../../helpers/scripts/loadImages";
import {capitalize} from "../../helpers/scripts/utils/formatters/capitalize";
import {getWindDir} from "../../helpers/scripts/getWindDir";
import {determineIssVisibility} from "../../helpers/scripts/astro/determineIssVisibility";

interface IssPassCardProps {
  pass: IssPass;
  passIndex: number;
  navigation: any;
  weather: any;
}

export default function IssPassCard({ pass, passIndex, navigation, weather }: IssPassCardProps) {

  const [passLength, setPassLength] = useState<string>('')
  const [isWeatherAccurate, setIsWeatherAccurate] = useState<boolean>(false)
  const [visibilityBadge, setVisibilityBadge] = useState<any>({})

  // https://api.n2yo.com/rest/v1/satellite/visualpasses/25544/43.5314643/5.4508237/341/1/45/&apiKey=SQCWS8-7VQKED-JG2RHW-5DGF
  useEffect(() => {
    const date1 = dayjs.unix(pass.startUTC)
    const date2 = dayjs.unix(pass.endUTC)
    const diff = date2.diff(date1)
    setPassLength(dayjs.duration(diff).format('mm:ss').replace(':', 'm') + 's')
  }, []);

  useEffect(() => {
    const weatherDateLimit = dayjs().add(3, 'day').unix()
    const passDate = dayjs.unix(pass.startUTC).unix()
    setIsWeatherAccurate(dayjs.unix(passDate).isBefore(dayjs.unix(weatherDateLimit)))
  }, []);

  useEffect(() => {
    if(passIndex <= 6){
      const badge = determineIssVisibility(pass.maxEl, weather[passIndex]?.weather[0].icon, pass.startUTC)
      setVisibilityBadge(badge)
    }
  }, []);

  return (
    <TouchableOpacity style={issPassCardStyles.card}>
      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 10}}>
        <Text style={issPassCardStyles.card.title}>{dayjs.unix(pass.startUTC).format('DD MMM YYYY')}</Text>
        <Text style={[issPassCardStyles.card.subtitle, {backgroundColor: visibilityBadge.backgroundColor, color: visibilityBadge.foregroundColor}]}>{visibilityBadge.text}</Text>
      </View>

      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <View style={issPassCardStyles.card.column}>
          <Image style={issPassCardStyles.card.weatherIcon} source={isWeatherAccurate ? weatherImages[weather[passIndex]?.weather[0].icon] : require('../../../assets/icons/FiIss.png')}/>
          {/*<Text style={issPassCardStyles.card.title}>{weather[passIndex]?.weather[0].icon}</Text>*/}
        </View>
        <View style={issPassCardStyles.card.column}>
          <View style={issPassCardStyles.card.row}>
            <Image style={issPassCardStyles.card.icon} source={require('../../../assets/icons/FiSunrise.png')}/>
            <Text style={issPassCardStyles.card.text}>{dayjs.unix(pass.startUTC).format('HH:mm')}</Text>
          </View>
          <View style={issPassCardStyles.card.row}>
            <Image style={issPassCardStyles.card.icon} source={require('../../../assets/icons/FiSunset.png')}/>
            <Text style={issPassCardStyles.card.text}>{dayjs.unix(pass.endUTC).format('HH:mm')}</Text>
          </View>
        </View>
        <View style={issPassCardStyles.card.column}>
          <View style={issPassCardStyles.card.row}>
            <Image style={issPassCardStyles.card.icon} source={require('../../../assets/icons/FiClock.png')}/>
            <Text style={issPassCardStyles.card.text}>{passLength}</Text>
          </View>
          <View style={issPassCardStyles.card.row}>
            <Image style={issPassCardStyles.card.icon} source={require('../../../assets/icons/FiSun.png')}/>
            <Text style={issPassCardStyles.card.text}>{pass.mag}</Text>
          </View>
        </View>
        <View style={issPassCardStyles.card.column}>
          <View style={issPassCardStyles.card.row}>
            <Image style={issPassCardStyles.card.icon} source={require('../../../assets/icons/FiCompass.png')}/>
            <Text style={issPassCardStyles.card.text}>{pass.startAz.toFixed(2)}° ({pass.startAzCompass})</Text>
          </View>
          <View style={issPassCardStyles.card.row}>
            <Image style={issPassCardStyles.card.icon} source={require('../../../assets/icons/FiAngleRight.png')}/>
            <Text style={issPassCardStyles.card.text}>{pass.maxEl.toFixed(2)}°</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
