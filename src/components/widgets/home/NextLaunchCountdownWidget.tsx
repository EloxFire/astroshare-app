import React, {ReactNode, useEffect, useState} from 'react'
import {ActivityIndicator, Image, ImageBackground, Text, View} from "react-native";
import {nextLaunchCountdownWidgetStyles} from "../../../styles/components/widgets/home/nextLaunchCountdown";
import {useLaunchData} from "../../../contexts/LaunchContext";
import {LaunchData} from "../../../helpers/types/LaunchData";
import dayjs from "dayjs";
import {truncate} from "../../../helpers/scripts/utils/formatters/truncate";
import {launchCardStyles} from "../../../styles/components/cards/launchCard";
import {getLaunchStatusColor} from "../../../helpers/scripts/launches/getLaunchStatusColor";


export default function NextLaunchCountdownWidget(): ReactNode {

  const { launchData } = useLaunchData()

  const [loading, setLoading] = useState<boolean>(true)
  const [launch, setLaunch] = useState<LaunchData | undefined>(undefined)
  const [countdown, setCountdown] = useState<string>('00:00:00:00') // DD:HH:mm:ss

  useEffect(() => {
    if(launchData){
      setLaunch(launchData[0])
      setLoading(false)
    }
  }, [launchData])

  useEffect(() => {
    getTimeFromLaunch()

    const interval = setInterval(() => {
      getTimeFromLaunch()
    }, 1000)

    return () => clearInterval(interval)
  }, [launch])

  const getTimeFromLaunch = () => {
    if(launch){
      const diff = dayjs(launch.net).diff(dayjs(), 'second')
      const timer = dayjs.duration(diff, 'seconds').format('D[j] HH[h] mm[m] ss[s]')
      setCountdown(timer)
    }
  }

  return (
    <View style={nextLaunchCountdownWidgetStyles.widget}>
      {
        loading ?
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size="small" color="white" />
          </View>
          :
          <ImageBackground source={{uri: launch?.image.image_url}} blurRadius={10} style={nextLaunchCountdownWidgetStyles.widget.backgroundImage}>
            <View style={nextLaunchCountdownWidgetStyles.widget.backgroundImage.filter} pointerEvents={'none'}/>
            <View style={nextLaunchCountdownWidgetStyles.widget.content}>
              <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                  <Text style={nextLaunchCountdownWidgetStyles.widget.content.text}>{launch?.name}</Text>
                  <View style={{display: 'flex', flexDirection: 'row'}}>
                    {/*<Text style={nextLaunchCountdownWidgetStyles.widget.content.countdown.sub}>T-0</Text>*/}
                    <Text style={nextLaunchCountdownWidgetStyles.widget.content.countdown}>{countdown}</Text>
                  </View>
                </View>
                {
                  launch &&
                    <Text style={[nextLaunchCountdownWidgetStyles.widget.content.badge, {backgroundColor: getLaunchStatusColor(launch.status.id).backgroundColor, color: getLaunchStatusColor(launch.status.id).textColor }]}>{launch.status.abbrev}</Text>
                }
              </View>
              <View style={nextLaunchCountdownWidgetStyles.widget.content.body}>
                <View style={{display: 'flex', flexDirection: 'column', gap: 5, flex: 1}}>
                  <View style={nextLaunchCountdownWidgetStyles.widget.content.body.info}>
                    <Image source={require('../../../../assets/icons/FiOrbit.png')} style={nextLaunchCountdownWidgetStyles.widget.content.body.info.icon} />
                    <Text style={nextLaunchCountdownWidgetStyles.widget.content.body.info.value}>{launch?.mission.orbit.name}</Text>
                  </View>
                  <View style={nextLaunchCountdownWidgetStyles.widget.content.body.info}>
                    <Image source={require('../../../../assets/icons/FiSatellite.png')} style={nextLaunchCountdownWidgetStyles.widget.content.body.info.icon} />
                    <Text style={nextLaunchCountdownWidgetStyles.widget.content.body.info.value}>{launch?.mission.type}</Text>
                  </View>
                </View>
                <View style={{display: 'flex', flexDirection: 'column', gap: 5, flex: 1}}>
                  <View style={nextLaunchCountdownWidgetStyles.widget.content.body.info}>
                    <Image source={require('../../../../assets/icons/FiRocket.png')} style={nextLaunchCountdownWidgetStyles.widget.content.body.info.icon} />
                    <Text style={nextLaunchCountdownWidgetStyles.widget.content.body.info.value}>{launch?.rocket.configuration.full_name}</Text>
                  </View>
                  <View style={nextLaunchCountdownWidgetStyles.widget.content.body.info}>
                    <Image source={require('../../../../assets/icons/FiPinMap.png')} style={nextLaunchCountdownWidgetStyles.widget.content.body.info.icon} />
                    <Text style={nextLaunchCountdownWidgetStyles.widget.content.body.info.value}>{launch?.pad.name ? truncate(launch?.pad.name, 25) : 'N/A'}</Text>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
      }
    </View>
  )
}
