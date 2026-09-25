import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { observatoryCardStyles } from "./ObservatoryCard.styles";
import { Observatory } from "../../../../types/observatory";
import { ChevronRight, Lightbulb, LucideIcon, Mountain, Users } from "lucide-react-native";
import { app_colors } from "../../../../helpers/variables";
import { useTranslation } from "react-i18next";
import { observatoriesAccessTypes, observatoriesEquipments } from "../../../../helpers/observatories/observatories";
import Badge from "../../../../components/Badge/Badge";

interface ObservatoryCardProps {
  active: boolean;
  observatory: Observatory
}

const ObservatoryQuickInfo = ({ icon: Icon, value }: { icon: LucideIcon, value?: string }) => {
  return (
    <View style={observatoryCardStyles.card.body.observatoryInfos.quickInfos.quickInfo}>
      <Icon size={16} color={app_colors.primary.main} />
      { value && <Text style={observatoryCardStyles.card.body.observatoryInfos.quickInfos.quickInfo.value}>{value}</Text>}
    </View>
  )
}

const ObservatoryCard = ({ active, observatory }: ObservatoryCardProps) => {
  const { t } = useTranslation("settings");

  return (
    <TouchableOpacity
      style={[observatoryCardStyles.card, active && observatoryCardStyles.card.active]}
      onPress={() => {
        router.push(`/settings/observatories/${observatory.id}`);
      }}
    >
      <View style={observatoryCardStyles.card.body}>
        <View style={observatoryCardStyles.card.body.bortleBadge}>
          <Text style={observatoryCardStyles.card.body.bortleBadge.label}>{t('observatories.observatoryCard.bortle')}</Text>
          <Text style={observatoryCardStyles.card.body.bortleBadge.value}>{observatory.light_pollution?.bortle}</Text>
        </View>
        <View style={observatoryCardStyles.card.body.observatoryInfos}>
          <View style={observatoryCardStyles.card.body.observatoryInfos.observatoryNameContainer}>
            <Text style={observatoryCardStyles.card.body.observatoryInfos.observatoryNameContainer.observatoryName}>{observatory.display_name ?? observatory.name}</Text>
            {active && <Badge text={t('observatories.observatoryCard.activeBadge')} backgroundColor={app_colors.accent.main} foregroundColor={app_colors.white} />}
            {observatory.shared && <Users size={16} color={app_colors.primary.main} />}
          </View>
          <Text style={observatoryCardStyles.card.body.observatoryInfos.observatoryLocation}>
            {observatory.display_name ? observatory.name : ""}
          </Text>
          <View style={observatoryCardStyles.card.body.observatoryInfos.quickInfos}>
            { observatory.elevation && <ObservatoryQuickInfo icon={Mountain} value={`${observatory.elevation.toString()} m`} /> }
            { observatory.light_pollution?.mpsas && <ObservatoryQuickInfo icon={Lightbulb} value={`${observatory.light_pollution.mpsas.toString()} mag/arcsec²`} /> }
          </View>
        </View>
        <View style={observatoryCardStyles.card.body.chevronRight}>
          <ChevronRight size={20} color={app_colors.accent.main} />
        </View>
      </View>

      <View style={observatoryCardStyles.card.footer}>
        <View style={observatoryCardStyles.card.footer.observatoryEquipments}>
          {
            observatory.equipment && observatory.equipment.length > 0 && (
              observatoriesEquipments
                .filter((equipment) => (observatory.equipment as string[]).includes(equipment.id))
                .map((equipment, _index, filteredEquipments) => (
                  <ObservatoryQuickInfo
                    key={equipment.id}
                    icon={equipment.icon}
                    value={filteredEquipments.length < 3 ? equipment.label : undefined}
                  />
                ))
            )
          }
        </View>
        <View style={observatoryCardStyles.card.footer.communityInfos}>
          {observatory.shared && <Badge text={t('observatories.observatoryCard.sharedBadge')} />}
          {
            observatory.access && (
              observatoriesAccessTypes
                .filter((accessType) => accessType.id === observatory.access)
                .map((accessType) => ( 
                  <Badge
                    key={accessType.id}
                    icon={accessType.icon}
                    text={t(`observatories.observatoryAccess.${observatory.access}`)}
                    backgroundColor={app_colors.accent.light}
                    foregroundColor={app_colors.primary.main}
                  />
                ))
            )
          }
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ObservatoryCard;