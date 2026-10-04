import { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { infoCardStyles } from "./InfoCard.styles";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import * as Linking from 'expo-linking';
import { app_colors, withOpacity } from "../../../helpers/variables";

interface InfoCardProps {
  // Acceptent aussi un ReactNode (ex: un élément <Trans> avec un <Text> stylé imbriqué) pour
  // pouvoir mettre en valeur une partie du texte — voir stepOne.lightPollution.title et
  // .description dans settings/addObservatory.
  title: string | ReactNode;
  description: string | ReactNode;
  icon: LucideIcon
  link?: string; // Optional link prop
  additionnalDescriptionStyle?: object; // Optional style for the description text
  variant?: "light" | "dark"; // Optional variant prop
}

const InfoCard = ({ title, description, icon: Icon, link, additionnalDescriptionStyle, variant = "dark" }: InfoCardProps) => {

  const handlePress = () => {
    if (link) {
      // Handle navigation to the link if provided
      Linking.openURL(link);
    }
  }

  return (
    <TouchableOpacity onPress={handlePress} disabled={!link} style={[infoCardStyles.card, variant === "light" && infoCardStyles.cardLight]}>
      <Icon size={24} color={variant === "light" ? app_colors.accent.main : app_colors.yellow.main} />
      <View style={infoCardStyles.card.infos}>
        <Text style={[infoCardStyles.card.infos.title, variant === "light" && { color: app_colors.primary.main }]}>{title}</Text>
        <Text style={[infoCardStyles.card.infos.description, additionnalDescriptionStyle, variant === "light" && { color: app_colors.primary.main }]}>{description}</Text>
      </View>
      {
        link && (
          <ChevronRight size={24} color={variant === "light" ? app_colors.primary.medium : app_colors.white} />
        )
      }
    </TouchableOpacity>
  )
}

export default InfoCard;