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
        console.log('DeviceMotion available');
        
        // DeviceMotion.setUpdateInterval(5000);
        DeviceMotion.addListener((data) => {  
          console.log({ x: data.rotation.beta * 100, y: data.rotation.gamma * 100 });
          const x = data.rotation.beta * 70;
          const y = data.rotation.gamma * 70;

          const max = 135;
          
          setDotPosition({ x: x >= max ? 135 : x , y: y >= max ? 135 : y});
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
