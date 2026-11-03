import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { globalStyles } from "../../../helpers/globalStyles"
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader"
import { useTranslation } from "react-i18next"
import { useFocusEffect } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { StatusBar } from "expo-status-bar"
import { toolsSectionStyles } from "../components/ToolsSection/ToolsSection.styles"
import { threeDModelsCategories, threeDModelsList } from "../../../helpers/tools/3dviewer"
import { threeDViewerScreenStyles } from "./3dViewer.styles"
import IllustratedButtonCard from "../../../components/cards/IllustratedButtonCard/IllustratedButtonCard"
import { ThreeDModel } from "../../../types/tools/3dViewer"
import { Rotate3D } from "lucide-react-native"

// 3 tuiles par ligne, gap:10 (voir modelsList ci-dessus) — même principe que ToolsSection : la
// largeur de chaque carte est calculée à partir de la largeur réellement mesurée du conteneur
// (onLayout), pas d'une approximation Dimensions.get("window").
const ITEMS_PER_ROW = 3;
const ITEMS_GAP = 10;

const ThreeDViewer = () => {

  const { t } = useTranslation("tools/3dviewer")

  const [modelsContainerWidth, setModelsContainerWidth] = useState(0);
  const [featuredModel, setFeaturedModel] = useState<ThreeDModel | null>(null);

  const modelWidth = modelsContainerWidth > 0
    ? (modelsContainerWidth - ITEMS_GAP * (ITEMS_PER_ROW - 1)) / ITEMS_PER_ROW
    : undefined;

  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle("dark");
      return () => StatusBar.setStyle("light");
    }, [])
  );

  useEffect(() => {
    setFeaturedModel(threeDModelsList[Math.floor(Math.random() * threeDModelsList.length)]);
  }, [])

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>

          <View style={threeDViewerScreenStyles.featuredCard}>
            <View style={threeDViewerScreenStyles.featuredCard.content}>
              <Text style={threeDViewerScreenStyles.featuredCard.content.headline}>{t('featured.headline')}</Text>
              <Text style={threeDViewerScreenStyles.featuredCard.content.title}>{featuredModel ? t(`modelNames.${featuredModel.id}`) : ""}</Text>
              <Text style={threeDViewerScreenStyles.featuredCard.content.description}>{featuredModel ? t(`modelDescriptions.${featuredModel.id}`) : ""}</Text>
            
              <TouchableOpacity style={threeDViewerScreenStyles.featuredCard.content.button} onPress={() => { /* TODO: open 3D model */ }}>
                <Rotate3D size={20} color="white" />
                <Text style={threeDViewerScreenStyles.featuredCard.content.button.text}>{t('featured.view3d')}</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={featuredModel?.illustration || require("../../../../assets/images/placeholders/3d-viewer.png")}
              style={threeDViewerScreenStyles.featuredCard.image}
              resizeMode="cover"
            />
          </View>

          {
            threeDModelsCategories.map((category) => {
              const modelsInCategory = threeDModelsList.filter(model => model.category === category.id)

              if (modelsInCategory.length === 0) return null;

              return (
                <View style={{marginBottom: 10}} key={category.id}>
                  <View style={toolsSectionStyles.list.category.header}>
                    <Text style={toolsSectionStyles.list.category.header.title}>{t(`modelCategories.${category.id}`)}</Text>
                    <View style={toolsSectionStyles.list.category.header.separator} />
                    <Text style={toolsSectionStyles.list.category.header.subtitle}>{t(`modelCount_${modelsInCategory.length === 1 ? 'one' : 'other'}`, { count: modelsInCategory.length })}</Text>
                  </View>

                  <View
                    style={threeDViewerScreenStyles.modelsList}
                    onLayout={(event) => setModelsContainerWidth(event.nativeEvent.layout.width)}
                  >
                    {
                      modelsInCategory.map((model) => {
                        return (
                          <IllustratedButtonCard
                            key={model.id}
                            imageSource={model.illustration || require("../../../../assets/images/placeholders/3d-viewer.png")}
                            title={t(`modelNames.${model.id}`)}
                            color={category.color}
                            width={modelWidth}
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
      </ScrollView>
    </View>
  )
}

export default ThreeDViewer