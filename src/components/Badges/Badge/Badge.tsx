import { View, Text } from "react-native"
import { badgeStyles } from "./Badge.styles"
import { LucideIcon } from "lucide-react-native"

interface BadgeProps {
  text: string
  icon?: LucideIcon
  backgroundColor?: string
  foregroundColor?: string
  borderColor?: string
}

const Badge = ({ text, icon: Icon, backgroundColor, foregroundColor, borderColor }: BadgeProps) => {
  return (
    <View style={[badgeStyles.container, backgroundColor && { backgroundColor }, borderColor && { borderColor, borderWidth: 1 }]}>
      { Icon && <Icon size={16} color={foregroundColor || "white"} /> }
      <Text style={[badgeStyles.container.text, foregroundColor && { color: foregroundColor }]}>{text}</Text>
    </View>
  )
}

export default Badge