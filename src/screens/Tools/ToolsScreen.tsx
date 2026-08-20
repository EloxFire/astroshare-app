import { Text, View } from "react-native";
import { Search } from "lucide-react-native";
import { toolsScreenStyles } from "./ToolsScreen.styles";
import { ScreenHeader } from "../../components/ScreenHeader/ScreenHeader";
import { InputWithIcon } from "../../components/InputWithIcon/InputWithIcon";
import { useUserDataStore } from "../../store/userData.store";
import { toolsList } from "../../helpers/tools";
import ToolButton from "./components/ToolButton/ToolButton";
import AddPinnedToolButton from "./components/AddPinnedToolButton/AddPinnedToolButton";
import { useEffect } from "react";

const ToolsScreen = () => {

  const userPinnedTools = useUserDataStore((state) => state.pinnedTools);

  useEffect(() => {
    console.log("User pinned tools:", userPinnedTools.length > 0 ? userPinnedTools : "Aucun outil épinglé.");

    const emptySlots = Math.max(0, 5 - userPinnedTools.length);
    if (emptySlots > 0) {
      console.log(`Il y a ${emptySlots} emplacement(s) vide(s) pour épingler des outils.`);
    } else {
      console.log("Tous les emplacements pour épingler des outils sont occupés.");
    }
  }, [userPinnedTools]);

  return (
    <View style={toolsScreenStyles.screen}>
      <ScreenHeader title="Outils" />
      <View style={toolsScreenStyles.content}>
        <InputWithIcon
          icon={Search}
          placeholder="Chercher un outil, un objet, un calcul..."
        />

        <Text style={toolsScreenStyles.content.sectionTitle}>Épinglés (5 max)</Text>
        <View style={toolsScreenStyles.content.pinnedTools}>
          {
            userPinnedTools.map((toolId) => {
              const tool = toolsList.find((t) => t.toolId === toolId);
              if (!tool) return null;
              return <ToolButton key={toolId} icon={tool.ToolIcon} toolname={tool.toolName} />;
            })
          }
          {
            Array.from({ length: Math.max(0, 5 - userPinnedTools.length) }).map((_, index) => (
              <AddPinnedToolButton key={`add-pinned-tool-${index}`} />
            ))
          }
        </View>

        <View style={toolsScreenStyles.content.pinnedTools}>
          <Text style={toolsScreenStyles.content.sectionTitle}>Tous les outils</Text>
        </View>
      </View>
    </View>
  );
};

export default ToolsScreen;