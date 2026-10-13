import { ReactNode } from "react";
import { Text, View, ViewStyle } from "react-native";
import { switchInfoCardStyles } from "./SwitchInfoCard.styles";
import { LucideIcon } from "lucide-react-native";
import { app_colors } from "../../../helpers/variables";
import SwitchButton from "../../SwitchButton/SwitchButton";

interface SwitchInfoCardProps {
  title: string | ReactNode;
  description: string | ReactNode;
  icon: LucideIcon;
  isEnabled: boolean;
  onToggle: () => void;
  additionnalDescriptionStyle?: object; // Optional style for the description text
  additionnalContainerStyles?: ViewStyle; // Optional style for the outer container
  variant?: "light" | "dark"; // Optional variant prop
}

const SwitchInfoCard = ({
  title,
  description,
  icon: Icon,
  isEnabled,
  onToggle,
  additionnalDescriptionStyle,
  additionnalContainerStyles,
  variant = "dark",
}: SwitchInfoCardProps) => {
  return (
    <View style={[switchInfoCardStyles.card, variant === "light" && switchInfoCardStyles.cardLight, additionnalContainerStyles]}>
      <Icon size={24} color={variant === "light" ? app_colors.accent.main : app_colors.yellow.main} />
      <View style={switchInfoCardStyles.card.infos}>
        <Text style={[switchInfoCardStyles.card.infos.title, variant === "light" && { color: app_colors.primary.main }]}>{title}</Text>
        <Text style={[switchInfoCardStyles.card.infos.description, additionnalDescriptionStyle, variant === "light" && { color: app_colors.primary.main }]}>{description}</Text>
      </View>
      <SwitchButton isEnabled={isEnabled} onToggle={onToggle} />
    </View>
  )
}

export default SwitchInfoCard;
