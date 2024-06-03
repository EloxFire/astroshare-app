import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  View,
} from "react-native";
import { compassStyles } from "../styles/components/compass";
import { Magnetometer, Gyroscope } from "expo-sensors";
import { getAngle } from "../helpers/scripts/compass/getAngle";
import { getDirection } from "../helpers/scripts/compass/getDirection";
import { getDegree } from "../helpers/scripts/compass/getDegrees";

export default function Compass({ navigation }: any) {
  const [magnetometerSubscription, setMagnetometerSubscription] =
    useState<any>(null);
  const [gyroscopeSubscription, setGyroscopeSubscription] = useState<any>(null);
  const [magnetometer, setMagnetometer] = useState<any>(0);
  const [gyroscope, setGyroscope] = useState<any>(0);
  const degrees = Array(360).fill(null);

  const _subscribe = () => {
    setMagnetometerSubscription(
      Magnetometer.addListener((result) => {
        setMagnetometer(getAngle(result));
      })
    );

    setGyroscopeSubscription(
      Gyroscope.addListener((result) => {
        setGyroscope(result);
      })
    );
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
    <View style={compassStyles.content.compass}>
      <Image
        source={require("../../assets/icons/compassFrame.png")}
        resizeMode="contain"
        style={[compassStyles.content.compass.dialImage,{
          transform: [{ rotate: `-${getDegree(magnetometer)}deg` }],
        }]}
      />
      <Image
        source={require("../../assets/icons/compassNeedle.png")}
        resizeMode="contain"
        style={{ position: "absolute", height: 300, width: 300 }}
      />
      <View style={compassStyles.content.header}>
        <Text style={compassStyles.content.header.title}>
          {getDirection(getDegree(magnetometer))}
        </Text>
        <Text style={compassStyles.content.header.title}>
          {getDegree(magnetometer)}°
        </Text>
      </View>
    </View>
  );
}
