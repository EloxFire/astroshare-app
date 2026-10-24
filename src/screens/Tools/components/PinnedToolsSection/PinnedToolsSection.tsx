import { Text, View } from "react-native"
import { AstroshareTool } from "../../../../types/tools/astroshareTool";
import { pinnedToolsSectionStyles } from "./PinnedToolsSection.styles";

interface PinnedToolsSectionProps {
  tools: [string?, string?, string?, string?, string?]
}

const PinnedToolsSection = ({ tools }: PinnedToolsSectionProps) => {
  return (
    <View style={pinnedToolsSectionStyles.pinnedList}>
      <Text>{tools.length === 0 ? "Aucun outil épinglé." : tools.filter(Boolean).join(", ")}</Text>
    </View>
  )
};

export default PinnedToolsSection;