import { Text, TouchableOpacity, View } from "react-native";
import { infoCardStyles } from "./InfoCard.styles";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import { app_colors } from "../../helpers/variables";
import * as Linking from 'expo-linking';

interface InfoCardProps {
  title: string;
  description: string;
  icon:LucideIcon
  link?: string; // Optional link prop
}

const InfoCard = ({ title, description, icon: Icon, link }: InfoCardProps) => {

  const handlePress = () => {
    if (link) {
      // Handle navigation to the link if provided
      Linking.openURL(link);
    }
  }

  return (
    <TouchableOpacity onPress={() => handlePress} disabled={!link} style={infoCardStyles.card}>
      <Icon size={24} color={app_colors.yellow.main} />
      <View style={infoCardStyles.card.infos}>
        <Text style={infoCardStyles.card.infos.title}>{title}</Text>
        <Text style={infoCardStyles.card.infos.description}>{description}</Text>
      </View>
      {
        link && (
          <ChevronRight size={24} color={app_colors.white} />
        )
      }
    </TouchableOpacity>
  )
}

export default InfoCard;