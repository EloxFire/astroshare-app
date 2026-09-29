import { View, Text } from "react-native"
import { listBadgeStyles } from "./ListBadge.styles"
import { LucideIcon } from "lucide-react-native"

interface ListBadgeProps {
  text: string
  icon?: LucideIcon
  backgroundColor?: string
  foregroundColor?: string
  borderColor?: string
}

const ListBadge = ({ text, icon: Icon, backgroundColor, foregroundColor, borderColor }: ListBadgeProps) => {
  return (
    <View style={[listBadgeStyles.container, backgroundColor && { backgroundColor }, borderColor && { borderColor, borderWidth: 1 }]}>
      { Icon && <Icon size={16} color={foregroundColor || "white"} /> }
      <Text style={[listBadgeStyles.container.text, foregroundColor && { color: foregroundColor }]}>{text}</Text>
    </View>
  )
}

export default ListBadge