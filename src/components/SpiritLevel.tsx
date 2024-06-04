import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { spiritLevelStyles } from '../styles/components/spiritLevel'
import { Gyroscope } from 'expo-sensors';

export default function SpiritLevel() {

  const [gyroscopeSubscription, setGyroscopeSubscription] = useState<any>(null);
  const [gyroscope, setGyroscope] = useState<any>({ x: 0, y: 0, z: 0 });
  const [dotPosition, setDotPosition] = useState<any>({ x: 0, y: 0 });

  const _subscribe = () => {
    setGyroscopeSubscription(
      Gyroscope.addListener((result) => {
        
        setGyroscope(result);
        setDotPosition((prevPosition: any) => (
          {
            x: prevPosition.x - result.y * 10,
            y: prevPosition.y + result.x * 10,
          }
        ));
      })
    );
    Gyroscope.setUpdateInterval(200);
  };

  const _unsubscribe = () => {
    gyroscopeSubscription && gyroscopeSubscription.remove();
    setGyroscopeSubscription(null);
  };

  useEffect(() => {
    _subscribe();

    setDotPosition({
      x: gyroscope.y * 20,
      y: gyroscope.x * 20,
    })
    return () => _unsubscribe();
  }, []);

  return (
    <View style={spiritLevelStyles.container}>
      <View style={spiritLevelStyles.container.gyroDotFixed}></View>
      <View style={[spiritLevelStyles.container.gyroDot, {transform: [{translateX: dotPosition.x}, {translateY: dotPosition.y}]}]}></View>
    </View>
  )
}
