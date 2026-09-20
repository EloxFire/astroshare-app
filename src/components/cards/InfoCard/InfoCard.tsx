import { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { infoCardStyles } from "./InfoCard.styles";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import * as Linking from 'expo-linking';
import { app_colors } from "../../../helpers/variables";

interface InfoCardProps {
  // Acceptent aussi un ReactNode (ex: un élément <Trans> avec un <Text> stylé imbriqué) pour
  // pouvoir mettre en valeur une partie du texte — voir addObservatory.lightPollution.title et
  // .description.
  title: string | ReactNode;
  description: string | ReactNode;
  icon: LucideIcon
  link?: string; // Optional link prop
  additionnalDescriptionStyle?: object; // Optional style for the description text
}

const InfoCard = ({ title, description, icon: Icon, link, additionnalDescriptionStyle }: InfoCardProps) => {

  const handlePress = () => {
    if (link) {
      // Handle navigation to the link if provided
      Linking.openURL(link);
    }
  }

  return (
    <TouchableOpacity onPress={handlePress} disabled={!link} style={infoCardStyles.card}>
      <Icon size={24} color={app_colors.yellow.main} />
      <View style={infoCardStyles.card.infos}>
        <Text style={infoCardStyles.card.infos.title}>{title}</Text>
        <Text style={[infoCardStyles.card.infos.description, additionnalDescriptionStyle]}>{description}</Text>
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