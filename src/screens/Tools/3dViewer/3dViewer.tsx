import { Image, ScrollView, Text, View } from "react-native"
import { globalStyles } from "../../../helpers/globalStyles"
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader"
import { useTranslation } from "react-i18next"
import { router, useFocusEffect } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { StatusBar } from "expo-status-bar"
import { threeDModelsCategories, threeDModelsList } from "../../../helpers/tools/3dviewer"
import { threeDViewerScreenStyles } from "./3dViewer.styles"
import ModelGridCard from "./components/ModelGridCard/ModelGridCard"
import SectionHeader from "../../../components/SectionHeader/SectionHeader"
import ModelDownloadButton from "./components/ModelDownloadButton/ModelDownloadButton"
import { DownloadableThreeDModel, isDownloadableModel } from "../../../types/tools/3dViewer"
import { Rotate3D } from "lucide-react-native"

// 3 tuiles par ligne, gap:10 (voir modelsList ci-dessus) — même principe que ToolsSection : la
// largeur de chaque carte est calculée à partir de la largeur réellement mesurée du conteneur
// (onLayout), pas d'une approximation Dimensions.get("window").
const ITEMS_PER_ROW = 3;
const ITEMS_GAP = 10;

const ThreeDViewer = () => {

  const { t } = useTranslation("tools/3dviewer")

  const [modelsContainerWidth, setModelsContainerWidth] = useState(0);
  const [featuredModel, setFeaturedModel] = useState<DownloadableThreeDModel | null>(null);

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
    // Le modèle "à la une" ne peut être qu'un modèle déjà disponible au téléchargement.
    const downloadableModels = threeDModelsList.filter(isDownloadableModel);
    if (downloadableModels.length > 0) {
      setFeaturedModel(downloadableModels[Math.floor(Math.random() * downloadableModels.length)]);
    }
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

              {featuredModel && (
                <View style={{ marginTop: 20 }}>
                  <ModelDownloadButton
                    model={featuredModel}
                    readyLabel={t('featured.view3d')}
                    readyIcon={Rotate3D}
                    onReady={() => router.push(`/tools/3d-viewer/models/${featuredModel.id}`)}
                  />
                </View>
              )}
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
                  <SectionHeader
                    title={t(`modelCategories.${category.id}`)}
                    subtitle={t(`modelCount_${modelsInCategory.length === 1 ? 'one' : 'other'}`, { count: modelsInCategory.length })}
                  />

                  <View
                    style={threeDViewerScreenStyles.modelsList}
                    onLayout={(event) => setModelsContainerWidth(event.nativeEvent.layout.width)}
                  >
                    {
                      modelsInCategory.map((model) => {
                        return (
                          <ModelGridCard
                            key={model.id}
                            model={model}
                            imageSource={model.illustration || require("../../../../assets/images/placeholders/3d-viewer.png")}
                            title={t(`modelNames.${model.id}`)}
                            color={category.color}
                            width={modelWidth}
                            onPress={() => router.push(`/tools/3d-viewer/models/${model.id}`)}
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