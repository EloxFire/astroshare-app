import { Text, View } from "react-native"
import { valueCardStyles } from "./ValueCard.styles";


interface ValueCardProps {
  title: string;
  value: string;
}

const ValueCard = ({ title, value }: ValueCardProps) => {
  return (
    <View style={valueCardStyles.card}>
      <Text style={valueCardStyles.card.title}>{title}</Text>
      <Text style={valueCardStyles.card.value}>{value}</Text>
    </View>
  )
}

export default ValueCard