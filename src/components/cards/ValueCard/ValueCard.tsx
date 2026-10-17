import { Text, View } from "react-native"
import { valueCardStyles } from "./ValueCard.styles";


interface ValueCardProps {
  title: string;
  value: string;
  small?: boolean;
  valueStyle?: object;
  titleStyle?: object;
  containerStyle?: object;
}

const ValueCard = ({ title, value, small, valueStyle, titleStyle, containerStyle }: ValueCardProps) => {
  return (
    <View style={[valueCardStyles.card, containerStyle]}>
      <Text style={[valueCardStyles.card.title, titleStyle]}>{title}</Text>
      <Text style={[valueCardStyles.card.value, small && { fontSize: 16 }, valueStyle]}>{value}</Text>
    </View>
  )
}

export default ValueCard