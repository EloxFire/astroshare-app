import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import { Search } from "lucide-react-native";
import { toolsScreenStyles } from "./ToolsScreen.styles";
import { ScreenHeader } from "../../components/ScreenHeader/ScreenHeader";
import { InputWithIcon } from "../../components/InputWithIcon/InputWithIcon";
import { useUserDataStore } from "../../store/userData.store";
import ToolButton from "./components/ToolButton/ToolButton";
import AddPinnedToolButton from "./components/AddPinnedToolButton/AddPinnedToolButton";
import { useEffect, useMemo, useState } from "react";
import { toolsList } from "../../helpers/tools/tools";
import { toolCategories } from "../../helpers/tools/categories";
import { getRowGap } from "./components/ToolButton/ToolButton.styles";
import { spacing } from "../../helpers/variables";
import { useDebounce } from "../../hooks/useDebounce";
import { useTranslation } from "react-i18next";

const TOOLS_PER_ROW = 5;

const chunkIntoRows = <T,>(items: T[], size: number): T[][] => {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
};

const ToolsScreen = () => {
  const { t } = useTranslation("tools");

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTools, setFilteredTools] = useState(toolsList);

  const userPinnedTools = useUserDataStore((state) => state.pinnedTools);

  const { width: screenWidth } = useWindowDimensions();
  const rowGap = useMemo(
    () => getRowGap(screenWidth - spacing.screenMargin * 2, TOOLS_PER_ROW),
    [screenWidth]
  );

  useEffect(() => {
    console.log("User pinned tools:", userPinnedTools.length > 0 ? userPinnedTools : "Aucun outil épinglé.");

    const emptySlots = Math.max(0, 5 - userPinnedTools.length);
    if (emptySlots > 0) {
      console.log(`Il y a ${emptySlots} emplacement(s) vide(s) pour épingler des outils.`);
    } else {
      console.log("Tous les emplacements pour épingler des outils sont occupés.");
    }
  }, [userPinnedTools]);

  const handleSearch = useDebounce((query: string) => {
    const searched = toolsList.filter((tool) =>
      t(`names.${tool.toolId}`).toLowerCase().includes(query.toLowerCase())
    );
    console.log(`Recherche pour "${query}":`, searched.length > 0 ? searched.map(tool => tool.toolId) : "Aucun outil trouvé.");
    setFilteredTools(searched);
  }, 300);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);


  return (
    <View style={toolsScreenStyles.screen}>
      <ScreenHeader title={t("screen.title")} disableBackButton />
      <View style={toolsScreenStyles.content}>
        <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
          <InputWithIcon
            icon={Search}
            placeholder={t("screen.searchPlaceholder")}
            value={searchQuery}
            onChangeText={setSearchQuery}
            action={() => handleSearch(searchQuery)}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={toolsScreenStyles.content.sectionTitle}>{t("screen.pinnedSection")}</Text>
          <View style={toolsScreenStyles.content.pinnedTools}>
            {
              userPinnedTools.map((toolId) => {
                const tool = toolsList.find((candidate) => candidate.toolId === toolId);
                if (!tool) return null;
                return <ToolButton key={toolId} icon={tool.ToolIcon} toolId={tool.toolId} toolname={t(`names.${tool.toolId}`)} variant="pinned" />;
              })
            }
            {
              Array.from({ length: Math.max(0, 5 - userPinnedTools.length) }).map((_, index) => (
                <AddPinnedToolButton key={`add-pinned-tool-${index}`} />
              ))
            }
          </View>

          {
            toolCategories.map((category) => {
              const categoryTools = filteredTools.filter((tool) => tool.category === category.id);
              const rows = chunkIntoRows(categoryTools, TOOLS_PER_ROW);

              return (
                <View key={category.id} style={toolsScreenStyles.content.toolSection}>
                  <Text style={toolsScreenStyles.content.sectionTitle}>{t(`categories.${category.id}`)}</Text>

                  <View style={toolsScreenStyles.content.toolSection.toolsList}>
                    {
                      rows.map((row, rowIndex) => (
                        <View key={`${category.id}-row-${rowIndex}`} style={[toolsScreenStyles.content.toolSection.toolsList.row, { gap: rowGap }]}>
                          {
                            row.map((tool) => (
                              <ToolButton key={tool.toolId} icon={tool.ToolIcon} toolId={tool.toolId} toolname={t(`names.${tool.toolId}`)} />
                            ))
                          }
                        </View>
                      ))
                    }
                  </View>
                </View>
              )
            })
          }
        </ScrollView>
      </View>
    </View>
  );
};

export default ToolsScreen;