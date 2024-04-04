import React, { useEffect, useState } from 'react'
import { Image, Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { compassStyles } from '../styles/screens/compass'
import { Magnetometer, Gyroscope } from 'expo-sensors';
import PageTitle from '../components/commons/PageTitle'
import { getAngle } from '../helpers/scripts/compass/getAngle';
import { getDirection } from '../helpers/scripts/compass/getDirection';
import { getDegree } from '../helpers/scripts/compass/getDegrees';
import { app_colors } from '../helpers/constants';

export default function Compass({ navigation }: any) {

  const [magnetometerSubscription, setMagnetometerSubscription] = useState<any>(null);
  const [gyroscopeSubscription, setGyroscopeSubscription] = useState<any>(null);
  const [magnetometer, setMagnetometer] = useState<any>(0);
  const [gyroscope, setGyroscope] = useState<any>(0);
  const degrees = Array(360).fill(null);

  const _subscribe = () => {
    setMagnetometerSubscription(
      Magnetometer.addListener(result => {
        setMagnetometer(getAngle(result));
      })
    );

    setGyroscopeSubscription(
      Gyroscope.addListener(result => {
        setGyroscope(result);
      })
    )
    Magnetometer.setUpdateInterval(500);
    Gyroscope.setUpdateInterval(1000);
  };

  const _unsubscribe = () => {
    magnetometerSubscription && magnetometerSubscription.remove();
    gyroscopeSubscription && gyroscopeSubscription.remove();
    setMagnetometerSubscription(null);
    setGyroscopeSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={globalStyles.body}>
        <PageTitle navigation={navigation} title='Boussole' />
        <View style={compassStyles.content}>
          <View style={compassStyles.content.compass}>
            {/* {
              degrees.map((currentDegree, i) => {
                return (
                  <View key={i} style={{
                    position: 'absolute',
                    top: 150,
                    left: 145,
                    width: 10,
                    height: 1,
                    backgroundColor: app_colors.white,
                    transform: [{ rotate: `${i + 90}deg` }, {translateX: -145}]
                  }}/>
                )
              })
            } */}
            <Image source={require('../../assets/icons/compassFrame.png')} resizeMode='contain' style={{ position: 'absolute', height: 300, width: 300, transform: [{ rotate: `-${getDegree(magnetometer)}deg`}] }}/>
            <Image source={require('../../assets/icons/compassNeedle.png')} resizeMode='contain' style={{ position: 'absolute', height: 300, width: 300 }}/>
            {/* <View style={[compassStyles.content.compass.mainNeedle, {transform: [{ rotate: `${getDegree(magnetometer) + 90}deg` }, { translateX: -145 }],}]}/> */}
            <View style={compassStyles.content.header}>
              <Text style={compassStyles.content.header.title}>{getDirection(getDegree(magnetometer))}</Text>
              <Text style={compassStyles.content.header.title}>{getDegree(magnetometer)}°</Text>
            </View>
          </View>
          <View style={compassStyles.content.gyroscope}>
            <Text style={{ color: 'white' }}>x: {Math.floor(gyroscope.x)}</Text>
            <Text style={{ color: 'white' }}>y: {Math.floor(gyroscope.y)}</Text>
            <Text style={{ color: 'white' }}>z: {Math.floor(gyroscope.z)}</Text>
            {/* Create a fake horizon to make a gyroscope visualisation */}
            <View style={{ height: 150, width: 300, backgroundColor: app_colors.white, position: 'absolute', top: 75 }}>
              <View style={{ height: 1, width: 300, backgroundColor: app_colors.red, position: 'absolute', top: 75 }}/>
              <View style={{ height: 1, width: 300, backgroundColor: app_colors.red, position: 'absolute', top: 150 }}/>
              <View style={{ height: 1, width: 300, backgroundColor: app_colors.red, position: 'absolute', top: 225 }} />
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}