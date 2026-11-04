import { Image, Text, TouchableOpacity, View } from "react-native"
import { router } from "expo-router"
import { useTranslation } from "react-i18next"
import { DEFAULT_MODEL_ILLUSTRATION } from "../../../../../../helpers/tools/3dviewer"
import { ThreeDModel } from "../../../../../../types/tools/3dViewer"
import SectionHeader from "../SectionHeader/SectionHeader"
import { relatedModelsSectionStyles } from "./RelatedModelsSection.styles"

interface RelatedModelsSectionProps {
  relatedModels: ThreeDModel[];
}

const RelatedModelsSection = ({ relatedModels }: RelatedModelsSectionProps) => {
  const { t } = useTranslation("tools/3dviewer")

  return (
    <View>
      <SectionHeader title={t("sections.seeAlso")} />

      <View style={relatedModelsSectionStyles.list}>
        {relatedModels.map((relatedModel) => (
          <TouchableOpacity
            key={relatedModel.id}
            style={relatedModelsSectionStyles.card}
            onPress={() => router.push(`/tools/3d-viewer/models/${relatedModel.id}`)}
          >
            <View style={relatedModelsSectionStyles.card.imageCircle}>
              <Image
                source={relatedModel.illustration || DEFAULT_MODEL_ILLUSTRATION}
                style={relatedModelsSectionStyles.card.image}
                resizeMode="cover"
              />
            </View>
            <Text style={relatedModelsSectionStyles.card.title}>{t(`modelNames.${relatedModel.id}`)}</Text>
            <Text style={relatedModelsSectionStyles.card.category}>{t(`modelCategories.${relatedModel.category}`)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default RelatedModelsSection
