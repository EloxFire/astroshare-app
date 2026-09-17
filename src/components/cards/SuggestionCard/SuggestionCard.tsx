import { Text, View } from "react-native"
import { suggestionCardStyles } from "./SuggestionCard.styles"
import { ChevronRight, LucideIcon, Stars } from "lucide-react-native"
import { app_colors } from "../../../helpers/variables"

interface SuggestionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string | null;
}

const SuggestionCard = ({ title, description, icon: Icon, link }: SuggestionCardProps) => {
  return (
    <View style={suggestionCardStyles.card}>
      <Icon size={18} color={app_colors.primary.main} />
      <View style={suggestionCardStyles.card.content} >
        <View>
          <Text style={suggestionCardStyles.card.content.title}>{title}</Text>
          <Text style={suggestionCardStyles.card.content.description}>{description}</Text>
        </View>
        <View style={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }} >
          {link && <ChevronRight size={24} color={app_colors.primary.main} />}
        </View>
      </View>
    </View>
  )
}

export default SuggestionCard