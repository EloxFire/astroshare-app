import React, {ReactNode, useEffect, useState} from 'react'
import {ActivityIndicator, Image, ImageBackground, Text, View} from "react-native";
import {nextLaunchCountdownWidgetStyles} from "../../../styles/components/widgets/home/nextLaunchCountdown";
import {useLaunchData} from "../../../contexts/LaunchContext";
import {LaunchData} from "../../../helpers/types/LaunchData";
import dayjs from "dayjs";
import {truncate} from "../../../helpers/scripts/utils/formatters/truncate";
import {getLaunchStatusColor} from "../../../helpers/scripts/launches/getLaunchStatusColor";
import {getTimeFromLaunch} from "../../../helpers/scripts/utils/getTimeFromLaunch";


export default function NextLaunchCountdownWidget(): ReactNode {

  const { launchData } = useLaunchData()

  const [loading, setLoading] = useState<boolean>(true)
  const [launch, setLaunch] = useState<LaunchData | undefined>(undefined)
  const [countdown, setCountdown] = useState<string>('00:00:00:00') // DD:HH:mm:ss

  useEffect(() => {
    if(launchData){
      if(launchData[0]){
        if(launchData[0].status.id === 3){
          setLaunch(launchData[1])
          setLoading(false)
        }else{
          setLaunch(launchData[0])
          setLoading(false)
        }
      }
    }
  }, [launchData])

  useEffect(() => {
    if(launch){
      setCountdown(getTimeFromLaunch(dayjs(launch.net).toDate()))

      const interval = setInterval(() => {
        setCountdown(getTimeFromLaunch(dayjs(launch.net).toDate()))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [launch])



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
