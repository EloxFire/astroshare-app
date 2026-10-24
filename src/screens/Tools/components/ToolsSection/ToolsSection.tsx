import { Text, View } from "react-native"
import { useState } from "react";
import { toolsSectionStyles } from "./ToolsSection.styles"
import { toolCategories } from "../../../../helpers/tools/categories"
import { useTranslation } from "react-i18next";
import { toolsList } from "../../../../helpers/tools/tools";
import ToolButton from "../ToolButton/ToolButton";

// 3 tuiles par ligne, gap:10 (voir ToolsSection.styles.ts/tools) — répétés ici pour calculer la
// largeur exacte de chaque tuile à partir de la largeur réellement mesurée du conteneur
// (onLayout), plutôt que l'approximation Dimensions.get("window") de ToolButton.styles.ts, qui ne
// colle pas exactement une fois le gap pris en compte (laissait un espace visible à droite).
const ITEMS_PER_ROW = 3;
const ITEMS_GAP = 10;

const ToolsSection = () => {

  const { t } = useTranslation("tools");
  const [toolsContainerWidth, setToolsContainerWidth] = useState(0);

  const toolWidth = toolsContainerWidth > 0
    ? (toolsContainerWidth - ITEMS_GAP * (ITEMS_PER_ROW - 1)) / ITEMS_PER_ROW
    : undefined;

  return (
    <View style={toolsSectionStyles.list}>
      {
        toolCategories.map((category) => {
          const toolsInCategory = toolsList.filter((tool) => tool.category === category.id);
          return (
            <View key={category.id} style={toolsSectionStyles.list.category}>
              <View style={toolsSectionStyles.list.category.header}>
                <Text style={toolsSectionStyles.list.category.header.title}>{t(`categories.${category.id}`)}</Text>
                <View style={toolsSectionStyles.list.category.header.separator} />
                <Text style={toolsSectionStyles.list.category.header.subtitle}>{t(`categories.decorative.toolNumber`, { count: toolsInCategory.length })}</Text>
              </View>

              <View
                style={toolsSectionStyles.list.category.tools}
                onLayout={(event) => setToolsContainerWidth(event.nativeEvent.layout.width)}
              >
                {
                  toolsInCategory.map((tool) => {
                    return (
                      <ToolButton
                        key={tool.id}
                        tool={tool}
                        width={toolWidth}
                      />
                    )
                  })
                }
              </View>
            </View>
          )
        })
      }
    </View>
  )
}

export default ToolsSection