import { Image, ImageSourcePropType, Text, View } from "react-native"

interface TextWithIconProps {
  icon: ImageSourcePropType;
  text: string;
  textAdditionalStyles?: object;
  iconAdditionalStyles?: object;
}

export const TextWithIcon = ({icon, text, textAdditionalStyles, iconAdditionalStyles}: TextWithIconProps) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Image source={icon} style={[{width: 16, height: 16, marginRight: 8}, iconAdditionalStyles]} />
      <Text style={textAdditionalStyles}>{text}</Text>
    </View>
  )
}