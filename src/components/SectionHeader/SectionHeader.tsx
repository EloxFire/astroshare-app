import { Text, TouchableOpacity, View } from "react-native"
import { sectionHeaderStyles } from "./SectionHeader.styles"
import { LucideIcon } from "lucide-react-native";
import { app_colors } from "../../helpers/variables";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  button?: {
    label: string;
    onPress: () => void;
    icon?: LucideIcon;
  }
}

// Titre de section + ligne séparatrice, avec un compte optionnel à droite (ex: "3 repères").
// Partagé par toutes les sections/listes de l'app qui en ont besoin.
const SectionHeader = ({ title, subtitle, button }: SectionHeaderProps) => {
  return (
    <View style={sectionHeaderStyles.header}>
      <Text style={sectionHeaderStyles.header.title}>{title}</Text>
      <View style={sectionHeaderStyles.header.separator} />
      {subtitle && <Text style={sectionHeaderStyles.header.subtitle}>{subtitle}</Text>}
      {!subtitle && button && (
        <TouchableOpacity style={sectionHeaderStyles.header.button} onPress={button.onPress}>
          {button.icon && <button.icon size={16} color={app_colors.accent.main} />}
          <Text style={sectionHeaderStyles.header.button.text}>{button.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default SectionHeader
