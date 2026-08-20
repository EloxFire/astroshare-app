import React from "react";
import { toolButtonStyles } from "./ToolButton.styles";
import { Text, TouchableOpacity, View } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { app_colors } from "../../../../helpers/variables";

interface ToolButtonProps {
  icon: LucideIcon;
  toolname: string;
}

export default function ToolButton({ icon: Icon, toolname }: ToolButtonProps) {

  const handlePress = () => {
    console.log(`Tool button pressed: ${toolname}`);
    
  }

  return (
    <TouchableOpacity style={toolButtonStyles.button} onPress={handlePress}>
      <View style={toolButtonStyles.button.square}>
        <Icon color={app_colors.primary.main} />
      </View>
      <Text style={toolButtonStyles.button.name}>{toolname}</Text>
    </TouchableOpacity>
  )
}