import { Text, View } from "react-native"
import { useState } from "react";
import { toolsSectionStyles } from "./ToolsSection.styles"
import { toolCategories } from "../../../../helpers/tools/categories"
import { useTranslation } from "react-i18next";
import { AstroshareTool } from "../../../../types/tools/astroshareTool";
import ToolButton from "../ToolButton/ToolButton";
import SectionHeader from "../../../../components/layout/SectionHeader/SectionHeader";

// 3 tuiles par ligne, gap:10 (voir ToolsSection.styles.ts/tools) — répétés ici pour calculer la
// largeur exacte de chaque tuile à partir de la largeur réellement mesurée du conteneur
// (onLayout), plutôt que l'approximation Dimensions.get("window") de ToolButton.styles.ts, qui ne
// colle pas exactement une fois le gap pris en compte (laissait un espace visible à droite).
const ITEMS_PER_ROW = 3;
const ITEMS_GAP = 10;

interface ToolsSectionProps {
  // Déjà filtrés par ToolsScreen (recherche + catégorie active) : ce composant ne fait que les
  // regrouper par catégorie et les afficher, il ne connaît pas la recherche en cours.
  tools: AstroshareTool[];
}

const ToolsSection = ({ tools }: ToolsSectionProps) => {

  const { t } = useTranslation("tools");
  const [toolsContainerWidth, setToolsContainerWidth] = useState(0);

  const toolWidth = toolsContainerWidth > 0
    ? (toolsContainerWidth - ITEMS_GAP * (ITEMS_PER_ROW - 1)) / ITEMS_PER_ROW
    : undefined;

  if (tools.length === 0) {
    return (
      <View style={toolsSectionStyles.noResults}>
        <Text style={toolsSectionStyles.noResults.text}>{t("screen.noResults")}</Text>
      </View>
    )
  }

  return (
    <View style={toolsSectionStyles.list}>
      {
        toolCategories.map((category) => {
          const toolsInCategory = tools.filter((tool) => tool.category === category.id);
          // Catégorie vide (recherche sans résultat dedans, ou filtre sur une autre catégorie) :
          // pas d'en-tête de section à afficher pour une liste vide en dessous.
          if (toolsInCategory.length === 0) return null;

          return (
            <View key={category.id} style={toolsSectionStyles.list.category}>
              <SectionHeader
                title={t(`categories.${category.id}`)}
                subtitle={t(`categories.decorative.toolNumber`, { count: toolsInCategory.length })}
              />

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