import React from "react";
import {Image, Text, View} from "react-native";
import {app_colors} from "../../helpers/constants";
import {globalStyles} from "../../styles/global";

interface ProBadgeProps {
  additionalStyles?: any
  customColor?: string
}

export default function ProBadge({additionalStyles, customColor}: ProBadgeProps) {

  return (
    <View style={[globalStyles.proBadge, additionalStyles]}>
      <Image style={[globalStyles.proBadge.star1, {tintColor: customColor ? customColor : ""}]} source={require('../../../assets/icons/customStar.png')} />
      <Image style={[globalStyles.proBadge.star2, {tintColor: customColor ? customColor : ""}]} source={require('../../../assets/icons/customStar.png')} />
      <Image style={[globalStyles.proBadge.star3, {tintColor: customColor ? customColor : ""}]} source={require('../../../assets/icons/customStar.png')} />
      <Image style={[globalStyles.proBadge.star4, {tintColor: customColor ? customColor : ""}]} source={require('../../../assets/icons/customStar.png')} />
      <Text style={{color: customColor ? customColor : app_colors.white, fontSize: 12, fontFamily: 'GilroyBlack'}}>PRO</Text>
    </View>
  )
}