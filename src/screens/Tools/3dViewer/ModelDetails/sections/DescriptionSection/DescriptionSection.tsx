import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useTranslation } from "react-i18next"
import SectionHeader from "../SectionHeader/SectionHeader"
import { descriptionSectionStyles } from "./DescriptionSection.styles"

const COLLAPSED_LINES = 4;

interface DescriptionSectionProps {
  modelId: string;
}

// Description longue, repliée par défaut (avec "Lire la suite") ; retombe sur la description
// courte des cartes si aucun texte long n'existe encore pour ce modèle.
const DescriptionSection = ({ modelId }: DescriptionSectionProps) => {
  const { t } = useTranslation("tools/3dviewer")
  const [expanded, setExpanded] = useState(false)

  return (
    <View>
      <SectionHeader title={t("sections.description")} />

      <Text
        style={descriptionSectionStyles.text}
        // numberOfLines={expanded ? undefined : COLLAPSED_LINES}
      >
        {t(`longDescriptions.${modelId}`, { defaultValue: t(`modelDescriptions.${modelId}`) })}
      </Text>
    </View>
  )
}

export default DescriptionSection
