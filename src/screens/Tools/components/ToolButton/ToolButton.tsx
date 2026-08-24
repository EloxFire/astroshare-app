import React from "react";
import { toolButtonStyles } from "./ToolButton.styles";
import { Text, TouchableOpacity, View } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { router } from "expo-router";
import { app_colors } from "../../../../helpers/variables";

interface ToolButtonProps {
  icon: LucideIcon;
  toolId: string;
  toolname: string;
  variant?: "default" | "pinned";
}

// Chaque outil n'a pas encore forcément sa propre page : tant qu'une route
// n'est pas ajoutée ici, l'appui sur le bouton se contente de logger.
const TOOL_ROUTES: Partial<Record<string, "/tools/MoonCalendar">> = {
  "moon-phases-calendar": "/tools/MoonCalendar",
};

export default function ToolButton({ icon: Icon, toolId, toolname, variant = "default" }: ToolButtonProps) {

  const handlePress = () => {
    const route = TOOL_ROUTES[toolId];
    if (route) {
      router.push(route);
    } else {
      console.log(`Tool button pressed: ${toolname}`);
    }
  }

  return (
    <TouchableOpacity style={toolButtonStyles.button} onPress={handlePress}>
      <View style={[toolButtonStyles.button.square, variant === "pinned" && toolButtonStyles.button.squarePinned]}>
        <Icon color={variant === "pinned" ? app_colors.white : app_colors.primary.main} />
      </View>
      <Text style={toolButtonStyles.button.name}>{toolname}</Text>
    </TouchableOpacity>
  )
}