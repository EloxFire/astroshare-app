import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { globalStyles } from "../styles/global";
import { compassStyles } from "../styles/screens/compass";
import { Magnetometer, Gyroscope } from "expo-sensors";
import PageTitle from "../components/commons/PageTitle";
import { getAngle } from "../helpers/scripts/compass/getAngle";
import { getDirection } from "../helpers/scripts/compass/getDirection";
import { getDegree } from "../helpers/scripts/compass/getDegrees";
import { app_colors } from "../helpers/constants";

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={globalStyles.body}>
        <PageTitle navigation={navigation} title="Boussole" subtitle="// Pour une mise en station précise" />
        <View style={globalStyles.screens.separator} />
        <View style={compassStyles.content}>
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
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
