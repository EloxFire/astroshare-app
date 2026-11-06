import { Text, View } from "react-native"
import { valueCardStyles } from "./ValueCard.styles";


interface ValueCardProps {
  title: string;
  value: string;
  small?: boolean;
  valueStyle?: object;
  titleStyle?: object;
  containerStyle?: object;
  reverse?: boolean;
  square?: boolean;
}

const ValueCard = ({ title, value, small, valueStyle, titleStyle, containerStyle, reverse, square }: ValueCardProps) => {
  return (
    <View style={[valueCardStyles.card, containerStyle, reverse && { flexDirection: "column-reverse" }, square && { aspectRatio: 1, justifyContent: "space-between" }]}>
      <Text style={[valueCardStyles.card.title, titleStyle]}>{title}</Text>
      <Text style={[valueCardStyles.card.value, small && { fontSize: 16 }, valueStyle]}>{value}</Text>
    </View>
  )
}

export default ValueCard