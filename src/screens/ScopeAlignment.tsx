import React from "react";
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { globalStyles } from "../styles/global";
import { compassStyles } from "../styles/screens/compass";
import PageTitle from "../components/commons/PageTitle";

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
