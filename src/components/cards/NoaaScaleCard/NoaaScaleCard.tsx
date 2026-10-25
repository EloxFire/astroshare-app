import { Text, View } from "react-native"
import { noaaScaleCardStyles } from "./NoaaScaleCard.styles";


interface NoaaScaleCardProps {
  title: string;
  value: string;
  subtitle: string;
  small?: boolean;
  valueStyle?: object;
  titleStyle?: object;
  subtitleStyle?: object;
  containerStyle?: object;
}

const NoaaScaleCard = ({ title, value, subtitle, small, valueStyle, titleStyle, subtitleStyle, containerStyle }: NoaaScaleCardProps) => {
  return (
    <View style={[noaaScaleCardStyles.card, containerStyle]}>
      <View>
        <Text style={[noaaScaleCardStyles.card.value, small && { fontSize: 16 }, valueStyle]}>{value}</Text>
        <Text style={[noaaScaleCardStyles.card.title, titleStyle]}>{title}</Text>
      </View>
      <Text style={[noaaScaleCardStyles.card.subtitle, subtitleStyle]}>{subtitle}</Text>
    </View>
  )
}

export default NoaaScaleCard