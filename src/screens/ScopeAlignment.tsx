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

export default function ScopeAlignment({ navigation }: any) {

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={globalStyles.body}>
        <PageTitle navigation={navigation} title="Mise en station" subtitle="// Pour un alignement précis" />
        <View style={globalStyles.screens.separator} />
        <View style={compassStyles.content}>
          
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
