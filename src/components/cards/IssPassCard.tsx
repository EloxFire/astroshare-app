import React, {useEffect, useState} from 'react'
import {Image, Text, TouchableOpacity, View} from 'react-native'
import { issPassCardStyles } from '../../styles/components/cards/issPassCard'
import dayjs from 'dayjs';
import {IssPass} from "../../helpers/types/IssPass";
import {weatherImages} from "../../helpers/scripts/loadImages";
import {determineIssVisibility} from "../../helpers/scripts/astro/determineIssVisibility";
import {getTimeFromLaunch} from "../../helpers/scripts/utils/getTimeFromLaunch";
import {getWindDir} from "../../helpers/scripts/getWindDir";

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
  const [passWeatherIndex, setPassWeatherIndex] = useState<number>(0)

  // https://api.n2yo.com/rest/v1/satellite/visualpasses/25544/43.5314643/5.4508237/341/1/45/&apiKey=SQCWS8-7VQKED-JG2RHW-5DGF

  useEffect(() => {
    const weatherDateLimit = dayjs().add(6, 'days').unix()
    const weatherAccurate = dayjs.unix(pass.startUTC).isBefore(dayjs.unix(weatherDateLimit))
    setIsWeatherAccurate(weatherAccurate)

    if(weatherAccurate){
      const weatherIndex = weather.findIndex((w: any) => dayjs.unix(w.dt).isSame(dayjs.unix(pass.startUTC), 'day'))
      setPassWeatherIndex(weatherIndex)
    }
  }, []);

  useEffect(() => {
    if(passIndex <= 6){
      const badge = determineIssVisibility(pass.maxEl, weather[passIndex]?.weather[0].icon, pass.startUTC)
      setVisibilityBadge(badge)
    }
  }, [weather]);

  return (
    <View style={issPassCardStyles.card}>
      <View style={issPassCardStyles.card.conditions}>
        {
          !isWeatherAccurate ?
            <Image style={issPassCardStyles.card.conditions.icon} source={require('../../../assets/icons/FiIss.png')}/>
            :
            <Image style={issPassCardStyles.card.conditions.icon} source={isWeatherAccurate ? weatherImages[weather[passWeatherIndex]?.weather[0].icon] : require('../../../assets/icons/FiIss.png')}/>
        }
        <View style={issPassCardStyles.column}>
          <Text style={issPassCardStyles.card.conditions.title}>ISS</Text>
          <Text style={issPassCardStyles.card.conditions.subtitle}>Mag : {pass.mag}</Text>
        </View>
      </View>

      <View style={issPassCardStyles.card.infos}>
        <View style={issPassCardStyles.column}>
          <Text style={issPassCardStyles.column.title}>Heure</Text>
          <Text style={issPassCardStyles.column.value}>{dayjs.unix(pass.startUTC).format('HH:mm')}</Text>
        </View>

        <View style={issPassCardStyles.column}>
          <Text style={issPassCardStyles.column.title}>Altitude</Text>
          <Text style={issPassCardStyles.column.value}>{pass.startEl}°</Text>
        </View>

        <View style={issPassCardStyles.column}>
          <Text style={issPassCardStyles.column.title}>Direction</Text>
          <Text style={issPassCardStyles.column.value}>{pass.startAzCompass}</Text>
        </View>
      </View>
    </View>
    // <TouchableOpacity style={issPassCardStyles.card}>
    //   <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 10}}>
    //     <Text style={issPassCardStyles.card.title}>{dayjs.unix(pass.startUTC).format('DD MMM YYYY')}</Text>
    //     <Text style={[issPassCardStyles.card.subtitle, {backgroundColor: visibilityBadge.backgroundColor, color: visibilityBadge.foregroundColor}]}>{visibilityBadge.text}</Text>
    //     {!isWeatherAccurate && <Image style={issPassCardStyles.card.noWeather} source={require('../../../assets/icons/FiCloudOff.png')}/>}
    //   </View>
    //
    //   <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
    //     <View style={issPassCardStyles.card.column}>
    //       <Image style={issPassCardStyles.card.weatherIcon} source={isWeatherAccurate ? weatherImages[weather[passWeatherIndex]?.weather[0].icon] : require('../../../assets/icons/FiIss.png')}/>
    //     </View>
    //     <View style={issPassCardStyles.card.column}>
    //       <View style={issPassCardStyles.card.row}>
    //         <Image style={issPassCardStyles.card.icon} source={require('../../../assets/icons/FiSunrise.png')}/>
    //         <Text style={issPassCardStyles.card.text}>{dayjs.unix(pass.startUTC).format('HH:mm')}</Text>
    //       </View>
    //       <View style={issPassCardStyles.card.row}>
    //         <Image style={issPassCardStyles.card.icon} source={require('../../../assets/icons/FiSunset.png')}/>
    //         <Text style={issPassCardStyles.card.text}>{dayjs.unix(pass.endUTC).format('HH:mm')}</Text>
    //       </View>
    //     </View>
    //     <View style={issPassCardStyles.card.column}>
    //       <View style={issPassCardStyles.card.row}>
    //         <Image style={issPassCardStyles.card.icon} source={require('../../../assets/icons/FiClock.png')}/>
    //         <Text style={issPassCardStyles.card.text}>{passLength}</Text>
    //       </View>
    //       <View style={issPassCardStyles.card.row}>
    //         <Image style={issPassCardStyles.card.icon} source={require('../../../assets/icons/FiSun.png')}/>
    //         <Text style={issPassCardStyles.card.text}>{pass.mag}</Text>
    //       </View>
    //     </View>
    //     <View style={issPassCardStyles.card.column}>
    //       <View style={issPassCardStyles.card.row}>
    //         <Image style={issPassCardStyles.card.icon} source={require('../../../assets/icons/FiCompass.png')}/>
    //         <Text style={issPassCardStyles.card.text}>{pass.startAz.toFixed(2)}° ({pass.startAzCompass})</Text>
    //       </View>
    //       <View style={issPassCardStyles.card.row}>
    //         <Image style={issPassCardStyles.card.icon} source={require('../../../assets/icons/FiAngleRight.png')}/>
    //         <Text style={issPassCardStyles.card.text}>{pass.maxEl.toFixed(2)}°</Text>
    //       </View>
    //     </View>
    //   </View>
    // </TouchableOpacity>
  )
}
