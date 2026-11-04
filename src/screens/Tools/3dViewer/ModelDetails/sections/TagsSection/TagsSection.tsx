import { View } from "react-native"
import { useTranslation } from "react-i18next"
import { app_colors } from "../../../../../../helpers/variables"
import Badge from "../../../../../../components/Badges/Badge/Badge"
import { tagsSectionStyles } from "./TagsSection.styles"

interface TagsSectionProps {
  tagKeys: string[];
}

const TagsSection = ({ tagKeys }: TagsSectionProps) => {
  const { t } = useTranslation("tools/3dviewer")

  return (
    <View style={tagsSectionStyles.row}>
      {tagKeys.map((tagKey) => (
        <Badge
          key={tagKey}
          text={t(`tags.${tagKey}`)}
          backgroundColor={app_colors.accent.light}
          foregroundColor={app_colors.primary.main}
        />
      ))}
    </View>
  )
}

export default TagsSection
