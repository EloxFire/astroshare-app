import { Linking, Text, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { sourceFooterStyles } from "./SourceFooter.styles"

interface SourceFooterProps {
  source: { name: string; url: string };
}

const SourceFooter = ({ source }: SourceFooterProps) => {
  const { t } = useTranslation("tools/3dviewer")

  return (
    <TouchableOpacity onPress={() => Linking.openURL(source.url)}>
      <Text style={sourceFooterStyles.text}>{t("source", { name: source.name })}</Text>
    </TouchableOpacity>
  )
}

export default SourceFooter
