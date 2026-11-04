import { Text, View } from "react-native"
import { useTranslation } from "react-i18next"
import { ChevronRight } from "lucide-react-native"
import { app_colors } from "../../../../../../helpers/variables"
import { PointOfInterest } from "../../../../../../helpers/tools/3dviewer"
import SectionHeader from "../SectionHeader/SectionHeader"
import { pointsOfInterestSectionStyles } from "./PointsOfInterestSection.styles"

interface PointsOfInterestSectionProps {
  pointsOfInterest: PointOfInterest[];
}

// Repères numérotés du modèle. Chevron purement visuel pour l'instant (pas d'action au tap) : la
// mise en évidence sur le modèle 3D attend le futur composant de scène générique.
const PointsOfInterestSection = ({ pointsOfInterest }: PointsOfInterestSectionProps) => {
  const { t } = useTranslation("tools/3dviewer")

  return (
    <View>
      <SectionHeader
        title={t("sections.pointsOfInterest")}
        count={t("pointsOfInterestCount", { count: pointsOfInterest.length })}
      />

      <View style={pointsOfInterestSectionStyles.list}>
        {pointsOfInterest.map((poi, index) => (
          <View
            key={poi.id}
            style={[
              pointsOfInterestSectionStyles.row,
              index < pointsOfInterest.length - 1 && pointsOfInterestSectionStyles.row.withBorder,
            ]}
          >
            <View style={pointsOfInterestSectionStyles.row.numberCircle}>
              <Text style={pointsOfInterestSectionStyles.row.numberCircle.text}>{index + 1}</Text>
            </View>
            <View style={pointsOfInterestSectionStyles.row.textBlock}>
              <Text style={pointsOfInterestSectionStyles.row.textBlock.title}>{t(`pointsOfInterest.${poi.id}.title`)}</Text>
              <Text style={pointsOfInterestSectionStyles.row.textBlock.description}>{t(`pointsOfInterest.${poi.id}.description`)}</Text>
            </View>
            <ChevronRight size={16} color={app_colors.primary.medium} />
          </View>
        ))}
      </View>
    </View>
  )
}

export default PointsOfInterestSection
