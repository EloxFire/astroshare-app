import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { spiritLevelStyles } from '../styles/components/spiritLevel'
import { DeviceMotion } from 'expo-sensors';

export default function SpiritLevel() {

  const [dotPosition, setDotPosition] = useState({x: 0, y: 0});

  useEffect(() => {
    (async () => {
      const { status } = await DeviceMotion.requestPermissionsAsync();
      const motionSensorAvailable = await DeviceMotion.isAvailableAsync();

      if (status === 'granted' && motionSensorAvailable) {
        // DeviceMotion.setUpdateInterval(500);
        DeviceMotion.addListener((data) => {          
          setDotPosition({ x: data.rotation.beta * 100, y: data.rotation.gamma * 100 });
        });
      }
      
    })()

    return () => {
      DeviceMotion.removeAllListeners();
    }
  }, [])

  return (
    <View style={spiritLevelStyles.container}>
      <View style={spiritLevelStyles.container.gyroDotFixed}></View>
      <View style={[spiritLevelStyles.container.gyroDot, {transform: [{translateX: dotPosition.y}, {translateY: dotPosition.x}]}]}></View>
    </View>
  )
}
