import { Text, TouchableOpacity, View } from "react-native";
import { observatoryCardStyles } from "./ObservatoryCard.styles";
import { Observatory } from "../../../../types/observatory";
import { ChevronRight, Lightbulb, LucideIcon, PlusCircleIcon, Trash2 } from "lucide-react-native";
import { app_colors } from "../../../../helpers/variables";
import { convertDecimalLatitudeToDMS, convertDecimalLongitudeToDMS } from "../../../../helpers/location/convert";
import { useTranslation } from "react-i18next";
import { observatoriesEquipments } from "../../../../helpers/observatories/observatories";
import { useState } from "react";
import { useUserDataStore } from "../../../../store/userData.store";

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
  const removeObservatory = useUserDataStore((state) => state.removeObservatory);

  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <TouchableOpacity
      style={[observatoryCardStyles.card, active && observatoryCardStyles.card.active]}
      onPress={() => {console.log("Observatory card pressed")}}
      disabled={isDeleting}
      onLongPress={() => {setIsDeleting(true)}}
      onPressOut={() => {setIsDeleting(false)}}
    >
      <View style={{display: "flex", flexDirection: "column", flex: 1}}>
        <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 20}}>
          <Text style={observatoryCardStyles.card.title}>{observatory.display_name ?? observatory.name}</Text>
          {active && <Text style={observatoryCardStyles.card.badge}>{t("observatories.activeBadge")}</Text>}
          <Text>{observatory.id}</Text>
        </View>
        <View style={observatoryCardStyles.card.subtitleRow}>
          <Text style={observatoryCardStyles.card.subtitleRow.text}>
            {observatory.latitude ? convertDecimalLatitudeToDMS(observatory.latitude) :  ""} - {observatory.longitude ? convertDecimalLongitudeToDMS(observatory.longitude) : ""} - {t("observatories.altitudeAbbreviated", { value: observatory.elevation ?? "" })}
          </Text>
        </View>

        <View style={observatoryCardStyles.card.attributesRow}>
          {observatory.equipment && observatory.equipment.length > 0 && (
            observatoriesEquipments
              .filter((equipment) => (observatory.equipment as string[]).includes(equipment.id))
              .slice(0, 2)
              .map((equipment) => (
                <ObservatoryAttribute key={equipment.id} text={equipment.label} icon={equipment.icon} />
              ))
          )}
          {
            observatory.equipment && observatory.equipment.length > 2 && (
              <ObservatoryAttribute key={observatory.id} text={`+${observatory.equipment.length - 2}`} icon={ChevronRight} />
            )
          }
        </View>
      </View>

      {
        isDeleting ? (
          <ChevronRight color={app_colors.accent.main} size={24} />
        ) : (
          <TouchableOpacity onPress={() => removeObservatory(observatory.id)} style={{padding: 8}}>
            <Trash2 color={app_colors.red.main} size={24} />
          </TouchableOpacity>
        )
      }
      
    </TouchableOpacity>
  )
}

export default ObservatoryCard;