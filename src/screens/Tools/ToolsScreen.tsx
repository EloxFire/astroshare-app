import { ScrollView, Text, View } from "react-native";
import { Search } from "lucide-react-native";
import { toolsScreenStyles } from "./ToolsScreen.styles";
import { ScreenHeader } from "../../components/ScreenHeader/ScreenHeader";
import { InputWithIcon } from "../../components/InputWithIcon/InputWithIcon";
import { useUserDataStore } from "../../store/userData.store";
import ToolButton from "./components/ToolButton/ToolButton";
import AddPinnedToolButton from "./components/AddPinnedToolButton/AddPinnedToolButton";
import { useEffect, useState } from "react";
import { toolsList } from "../../helpers/tools/tools";
import { toolCategories } from "../../helpers/tools/categories";
import { useDebounce } from "../../hooks/useDebounce";
import { useTranslation } from "react-i18next";
import Badge from "../../components/Badges/Badge/Badge";
import { app_colors } from "../../helpers/variables";
import PinnedToolsSection from "./components/PinnedToolsSection/PinnedToolsSection";
import ToolsSection from "./components/ToolsSection/ToolsSection";

const ToolsScreen = () => {
  const { t } = useTranslation("tools");

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTools, setFilteredTools] = useState(toolsList);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

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

  const handleSearch = useDebounce((query: string) => {
    const searched = toolsList.filter((tool) =>
      t(`names.${tool.id}`).toLowerCase().includes(query.toLowerCase())
    );
    console.log(`Recherche pour "${query}":`, searched.length > 0 ? searched.map(tool => tool.id) : "Aucun outil trouvé.");
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={toolsScreenStyles.content.toolsFilters}>
            <Badge
              text={t(`categories.withCount.all`, { count: toolsList.length })}
              active={activeFilter === null}
              backgroundColor={activeFilter === null ? app_colors.accent.main : app_colors.white}
              borderColor={activeFilter === null ? app_colors.accent.main : app_colors.accent.light}
              foregroundColor={activeFilter === null ? app_colors.white : app_colors.primary.main}
              action={() => {
                setActiveFilter(null)
              }}
            />
            {
              toolCategories.map((category, _index) => {
                return (
                  <Badge
                    key={category.id}
                    text={t(`categories.withCount.${category.id}`, { count: toolsList.filter((tool) => tool.category === category.id).length })}
                    active={activeFilter === category.id}
                    backgroundColor={activeFilter === category.id ? app_colors.accent.main : app_colors.white}
                    borderColor={activeFilter === category.id ? app_colors.accent.main : app_colors.accent.light}
                    foregroundColor={activeFilter === category.id ? app_colors.white : app_colors.primary.main}
                    action={() => {
                      setActiveFilter(category.id)
                    }}
                  />
                )
              })
            }
          </View>
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingBottom: 150}}>
            {/* <PinnedToolsSection tools={userPinnedTools} /> */}
            <ToolsSection/>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ToolsScreen;