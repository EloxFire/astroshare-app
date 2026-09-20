import { View, Text } from "react-native"
import { badgeStyles } from "./Badge.styles"

const Badge = ({ text }: { text: string }) => {
  return (
    <View style={badgeStyles.container}>
      <Text style={badgeStyles.text}>{text}</Text>
    </View>
  )
}

export default Badge