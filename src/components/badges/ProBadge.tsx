import React from "react";
import {Image, Text, View} from "react-native";
import {app_colors} from "../../helpers/constants";
import {globalStyles} from "../../styles/global";

interface ProBadgeProps {
  additionalStyles?: any
}

export default function ProBadge({additionalStyles}: ProBadgeProps) {

  return (
    <View style={[globalStyles.proBadge, additionalStyles]}>
      <Image style={globalStyles.proBadge.star1} source={require('../../../assets/icons/customStar.png')} />
      <Image style={globalStyles.proBadge.star2} source={require('../../../assets/icons/customStar.png')} />
      <Image style={globalStyles.proBadge.star3} source={require('../../../assets/icons/customStar.png')} />
      <Image style={globalStyles.proBadge.star4} source={require('../../../assets/icons/customStar.png')} />
      <Text style={{color: app_colors.white, fontSize: 12, fontFamily: 'GilroyBlack'}}>PRO</Text>
    </View>
  )
}