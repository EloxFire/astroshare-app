import { View, Text, TouchableOpacity } from "react-native"
import { badgeStyles } from "./Badge.styles"
import { LucideIcon } from "lucide-react-native"

interface BadgeProps {
  text: string
  icon?: LucideIcon
  backgroundColor?: string
  foregroundColor?: string
  borderColor?: string
  action: () => void
  active?: boolean
}

const Badge = ({ text, icon: Icon, backgroundColor, foregroundColor, borderColor, action, active }: BadgeProps) => {
  return (
    <TouchableOpacity
      disabled={!action}
      style={[badgeStyles.container, active && badgeStyles.container.active, backgroundColor && { backgroundColor }, borderColor && { borderColor, borderWidth: 1 }]}
      onPress={action}
    >
      { Icon && <Icon size={16} color={foregroundColor || "white"} /> }
      <Text style={[badgeStyles.container.text, active && badgeStyles.container.text.active, foregroundColor && { color: foregroundColor }]}>{text}</Text>
    </TouchableOpacity>
  )
}

export default Badge