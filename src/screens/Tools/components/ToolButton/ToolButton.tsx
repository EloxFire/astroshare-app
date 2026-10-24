import { toolButtonStyles } from "./ToolButton.styles";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { LucideIcon } from "lucide-react-native";
import { router } from "expo-router";
import { app_colors } from "../../../../helpers/variables";
import { AstroshareTool } from "../../../../types/tools/astroshareTool";
import { toolCategories } from "../../../../helpers/tools/categories";

interface ToolButtonProps {
  tool: AstroshareTool;
  // Largeur exacte calculée par le conteneur parent (ToolsSection, via onLayout) — remplace la
  // largeur approximative par défaut de toolButtonStyles.button, qui ne colle pas exactement à la
  // largeur réelle du conteneur une fois le gap pris en compte.
  width?: number;
  isPro?: boolean;
}

export default function ToolButton({ tool, width }: ToolButtonProps) {

  const { t } = useTranslation("tools");

  const { id: toolId, icon: Icon, route, access } = tool;
  const toolname = t(`names.${toolId}`);
  const categoryColor = toolCategories.find(category => category.id === tool.category)?.color || app_colors.primary.main;

  const handlePress = () => {
    if (route) {
      router.push(tool.route);
    } else {
      console.log(`Tool button pressed: ${toolname}`);
    }
  }

  return (
    <TouchableOpacity
      style={[
        toolButtonStyles.button,
        { backgroundColor: categoryColor },
        width !== undefined && { width, height: width * 0.8 },
      ]}
      onPress={handlePress}
    >
      <View style={toolButtonStyles.button.header}>
        <Icon style={toolButtonStyles.button.header.icon} />
      </View>
      <Text style={toolButtonStyles.button.title}>{toolname}</Text>
    </TouchableOpacity>
  )
}
