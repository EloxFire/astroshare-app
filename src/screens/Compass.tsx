import React, { useEffect, useState } from 'react'
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { compassStyles } from '../styles/screens/compass'
import { Magnetometer } from 'expo-sensors';
import PageTitle from '../components/commons/PageTitle'
import { getAngle } from '../helpers/scripts/compass/getAngle';
import { getDirection } from '../helpers/scripts/compass/getDirection';
import { getDegree } from '../helpers/scripts/compass/getDegrees';
import { app_colors } from '../helpers/constants';

export default function Compass({ navigation }: any) {

  const [subscription, setSubscription] = useState<any>(null);
  const [magnetometer, setMagnetometer] = useState<any>(0);
  const degrees = Array(360).fill(null);

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener(result => {
        setMagnetometer(getAngle(result));
      })
    );

    // Magnetometer.setUpdateInterval(60000);
    Magnetometer.setUpdateInterval(200);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
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
            {
              degrees.map((currentDegree, i) => {
                return (
                  <View key={i} style={{
                    position: 'absolute',
                    top: 150,
                    left: 145,
                    width: 10,
                    height: 1,
                    backgroundColor: i === getDegree(magnetometer) ? app_colors.red : app_colors.white,
                    transform: [{ rotate: `${i + 90}deg` }, {translateX: -145}]
                  }}/>
                )
              })
            }
            <View style={compassStyles.content.header}>
              <Text style={compassStyles.content.header.title}>{getDirection(getDegree(magnetometer))}</Text>
              <Text style={compassStyles.content.header.title}>{getDegree(magnetometer)}°</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}