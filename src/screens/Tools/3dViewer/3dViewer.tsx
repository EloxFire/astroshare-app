import { ScrollView, Text, View } from "react-native"
import { globalStyles } from "../../../helpers/globalStyles"
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader"
import { useTranslation } from "react-i18next"
import { useFocusEffect } from "expo-router"
import { useCallback } from "react"
import { StatusBar } from "expo-status-bar"
import { toolsSectionStyles } from "../components/ToolsSection/ToolsSection.styles"
import { threeDModelsCategories, threeDModelsList } from "../../../helpers/tools/3dviewer"
import { threeDViewerScreenStyles } from "./3dViewer.styles"

const ThreeDViewer = () => {

  const { t } = useTranslation("tools/3dviewer")

  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle("dark");
      return () => StatusBar.setStyle("light");
    }, [])
  );

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>
          {
            threeDModelsCategories.map((category) => {
              const modelsInCategory = threeDModelsList.filter(model => model.category === category.id)
              return (
                <View key={category.id}>
                  <View style={toolsSectionStyles.list.category.header}>
                    <Text style={toolsSectionStyles.list.category.header.title}>{t(`modelCategories.${category.id}`)}</Text>
                    <View style={toolsSectionStyles.list.category.header.separator} />
                    <Text style={toolsSectionStyles.list.category.header.subtitle}>{t("modelCount", { count: modelsInCategory.length })}</Text>
                  </View>

                  <View style={threeDViewerScreenStyles.modelsList}>
                    {
                      modelsInCategory.map((model) => {
                        return (
                          <View key={model.id} style={threeDViewerScreenStyles.modelsList.modelCard}>
                            <Text style={threeDViewerScreenStyles.modelsList.modelCard.title}>{t(`modelNames.${model.id}`)}</Text>
                          </View>
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