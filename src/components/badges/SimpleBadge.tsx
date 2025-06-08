import React from "react";
import {Image, ImageSourcePropType, Text, View} from "react-native";
import {app_colors} from "../../helpers/constants";
import {globalStyles} from "../../styles/global";

interface SimpleBadgeProps {
  text: string
  backgroundColor?: string
  foregroundColor?: string
  icon?: ImageSourcePropType
  iconColor?: string
  noBorder?: boolean
  small?: boolean
}

export default function SimpleBadge({text, backgroundColor, foregroundColor, icon, iconColor, noBorder, small}: SimpleBadgeProps) {

  const badgeStyles = {
    badge: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'center' as 'center',
      alignItems: 'center' as 'center',
      gap: 5,
      backgroundColor: backgroundColor ? backgroundColor : app_colors.white_no_opacity,
      borderWidth: noBorder ? 0 : 1,
      borderColor: backgroundColor ? backgroundColor : app_colors.white_no_opacity,
      paddingHorizontal: 8,
      paddingVertical: small ? 1 : 3,
      borderRadius: 20,
    },
    text: {
      color: foregroundColor ? foregroundColor : app_colors.white,
      fontSize: small ? 10 : 12,
      fontFamily: 'DMMonoRegular'
    },
    icon: {
      tintColor: iconColor ? iconColor : "",
      width: 12,
      height: 12,
    }
  }

  return (
    <View style={badgeStyles.badge}>
      {icon && <Image style={badgeStyles.icon} source={icon} resizeMode={"contain"} />}
      <Text style={badgeStyles.text}>{text}</Text>
    </View>
  )
}