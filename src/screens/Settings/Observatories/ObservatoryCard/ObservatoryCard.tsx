import { Text, TouchableOpacity, View } from "react-native";
import { observatoryCardStyles } from "./ObservatoryCard.styles";
import { Observatory } from "../../../../types/observatory";
import { ChevronRight, Lightbulb, LucideIcon } from "lucide-react-native";
import { app_colors } from "../../../../helpers/variables";
import { convertDecimalLatitudeToDMS, convertDecimalLongitudeToDMS } from "../../../../helpers/location/convert";
import { useTranslation } from "react-i18next";

interface ObservatoryCardProps {
  active: boolean;
  observatory: Observatory
}

interface ObservatoryAttributeProps {
  text: string;
  icon: LucideIcon
}

const ObservatoryAttribute = ({ text, icon: Icon }: ObservatoryAttributeProps) => {
  return (
    <View style={observatoryCardStyles.card.attributesRow.attribute}>
      <Icon color={app_colors.accent.main} size={16} />
      <Text style={observatoryCardStyles.card.attributesRow.attribute.text}>{text}</Text>
    </View>
  )
}

const ObservatoryCard = ({ active, observatory }: ObservatoryCardProps) => {
  const { t } = useTranslation("settings");
  return (
    <TouchableOpacity style={[observatoryCardStyles.card, active && observatoryCardStyles.card.active]} onPress={() => {console.log("Observatory card pressed")}}>
      <View style={{display: "flex", flexDirection: "column", flex: 1}}>
        <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 20}}>
          <Text style={observatoryCardStyles.card.title}>{observatory.name}</Text>
          {active && <Text style={observatoryCardStyles.card.badge}>{t("observatories.activeBadge")}</Text>}
        </View>
        <View style={observatoryCardStyles.card.subtitleRow}>
          <Text style={observatoryCardStyles.card.subtitleRow.text}>
            {observatory.latitude ? convertDecimalLatitudeToDMS(observatory.latitude) :  ""} - {observatory.longitude ? convertDecimalLongitudeToDMS(observatory.longitude) : ""} - {t("observatories.altitudeAbbreviated", { value: observatory.elevation ?? "" })}
          </Text>
        </View>

        <View style={observatoryCardStyles.card.attributesRow}>
          {observatory.bortle && <ObservatoryAttribute text={t("observatories.bortleLabel", { value: observatory.bortle })} icon={Lightbulb} />}
        </View>
      </View>

      <ChevronRight color={app_colors.accent.main} size={24} />
      
    </TouchableOpacity>
  )
}

export default ObservatoryCard;