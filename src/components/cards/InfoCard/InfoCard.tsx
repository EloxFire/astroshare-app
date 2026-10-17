import { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { infoCardStyles } from "./InfoCard.styles";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import * as Linking from 'expo-linking';
import { app_colors, withOpacity } from "../../../helpers/variables";
import { router } from "expo-router";

interface InfoCardProps {
  // Acceptent aussi un ReactNode (ex: un élément <Trans> avec un <Text> stylé imbriqué) pour
  // pouvoir mettre en valeur une partie du texte — voir stepOne.lightPollution.title et
  // .description dans settings/addObservatory.
  title: string | ReactNode;
  description: string | ReactNode;
  icon: LucideIcon
  link?: string; // Optional link prop
  internalLink?: string; // Optional internal link prop
  additionnalDescriptionStyle?: object; // Optional style for the description text
  variant?: "light" | "dark" | 'dark-light'; // Optional variant prop
}

const InfoCard = ({ title, description, icon: Icon, link, internalLink, additionnalDescriptionStyle, variant = "dark" }: InfoCardProps) => {

  const handlePress = () => {
    if (link) {
      // Handle navigation to the link if provided
      Linking.openURL(link);
    } else if (internalLink) {
      // Handle internal navigation if provided
      // Replace this with your internal navigation logic, e.g., using React Navigation
      console.log(`Navigate to internal link: ${internalLink}`);
      router.replace(internalLink);
    }
  }

  const variantStylesConstructor = (variant: "light" | "dark" | 'dark-light') => {
    switch (variant) {
      case "light":
      default:
        return  {
          container: infoCardStyles.card,
          icon: {
            color: app_colors.accent.main,
          },
          title: infoCardStyles.card.infos.title,
          description: infoCardStyles.card.infos.description,
          chevron: {
            color: app_colors.primary.medium,
          }
        }
      case "dark":
        return {
          container: infoCardStyles.cardDark,
          icon: {
            color: app_colors.yellow.main,
          },
          title: infoCardStyles.cardDark.infos.title,
          description: infoCardStyles.cardDark.infos.description,
          chevron: {
            color: app_colors.white,
          }
        }
      case "dark-light":
        return {
          container: infoCardStyles.cardDarkLight,
          icon: {
            color: app_colors.accent.main,
          },
          title: infoCardStyles.cardDarkLight.infos.title,
          description: infoCardStyles.cardDarkLight.infos.description,
          chevron: {
            color: app_colors.primary.medium,
          }
        }
    }
  };

  const variantStyles = variantStylesConstructor(variant);

  return (
    <TouchableOpacity onPress={handlePress} disabled={!(link || internalLink)} style={[variantStyles?.container]}>
      <Icon size={24} color={variantStyles?.icon.color} />
      <View style={variantStyles?.container.infos}>
        <Text style={[variantStyles?.title, additionnalDescriptionStyle]}>{title}</Text>
        <Text style={[variantStyles?.description, additionnalDescriptionStyle]}>{description}</Text>
      </View>
      {
        (link || internalLink) && (
          <ChevronRight size={24} color={variantStyles?.chevron.color} />
        )
      }
    </TouchableOpacity>
  )
}

export default InfoCard;