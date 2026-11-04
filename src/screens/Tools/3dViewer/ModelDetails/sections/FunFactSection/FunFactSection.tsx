import { Text, View } from "react-native"
import { useTranslation } from "react-i18next"
import { funFactSectionStyles } from "./FunFactSection.styles"
import InfoCard from "../../../../../../components/cards/InfoCard/InfoCard";
import { CircleQuestionMark } from "lucide-react-native";

interface FunFactSectionProps {
  modelId: string;
}

const FunFactSection = ({ modelId }: FunFactSectionProps) => {
  const { t } = useTranslation("tools/3dviewer")

  return (
    <InfoCard
      title={t("sections.funFact")}
      variant="dark"
      icon={CircleQuestionMark}
      description={t(`funFacts.${modelId}`)}
    />
  )
}

export default FunFactSection
