import { Text, View } from "react-native"
import { sectionHeaderStyles } from "./SectionHeader.styles"

interface SectionHeaderProps {
  title: string;
  count?: string;
}

// Titre de section + ligne séparatrice, avec un compte optionnel à droite (ex: "3 repères").
// Partagé par toutes les sections/listes de l'app qui en ont besoin.
const SectionHeader = ({ title, count }: SectionHeaderProps) => {
  return (
    <View style={sectionHeaderStyles.header}>
      <Text style={sectionHeaderStyles.header.title}>{title}</Text>
      <View style={sectionHeaderStyles.header.separator} />
      {count && <Text style={sectionHeaderStyles.header.count}>{count}</Text>}
    </View>
  )
}

export default SectionHeader
