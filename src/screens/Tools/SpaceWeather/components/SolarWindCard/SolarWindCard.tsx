import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Wind } from "lucide-react-native";
import { globalStyles } from "../../../../../helpers/globalStyles";
import { app_colors } from "../../../../../helpers/variables";
import { formatWithSpaces } from "../../../../../helpers/format";
import Badge from "../../../../../components/Badges/Badge/Badge";
import InfoTooltip from "../../../../../components/overlays/InfoTooltip/InfoTooltip";
import type { SolarWindData, SolarWindLevel } from "../../../../../types/spaceWeather/SolarWind";
import { solarWindCardStyles } from "./SolarWindCard.styles";

// Ordre d'affichage des paliers du vent solaire (la piste a un segment par palier, dans cet ordre).
const SOLAR_WIND_LEVELS: SolarWindLevel[] = ["slow", "moderate", "fast", "very_fast"];

interface SolarWindCardProps {
  solarWind: SolarWindData | null;
}

/**
 * Vent solaire (vitesse/densité/température). `solarWind` reçu en prop plutôt que récupéré ici :
 * voir le commentaire équivalent dans MagneticFieldCard (minuteur de 5 min partagé avec l'IMF côté
 * API, fetché une fois pour les deux par le parent).
 */
const SolarWindCard = ({ solarWind }: SolarWindCardProps) => {
  const { t } = useTranslation("tools/spaceWeather");

  return (
    <View style={globalStyles.defaultCard}>
      <View style={globalStyles.defaultCard.header}>
        <View style={solarWindCardStyles.titleRow}>
          <Wind color={app_colors.primary.medium} size={20} />
          <Text style={globalStyles.categoryTitle}>{t("solarWind.title")}</Text>
        </View>

        <InfoTooltip title={t("solarWind.tooltip.title")} description={t("solarWind.tooltip.description")} />
      </View>

      <View style={solarWindCardStyles.container}>
        <View style={solarWindCardStyles.container.valueRow}>
          <View style={solarWindCardStyles.container.valueRow.value}>
            <Text style={solarWindCardStyles.container.valueRow.value.main}>
              {solarWind?.current ? solarWind.current.speed.toFixed(0) : "--"}
            </Text>
            <Text style={solarWindCardStyles.container.valueRow.value.unit}>km/s</Text>
          </View>
          {
            solarWind?.current && (
              // Badge a alignSelf: "flex-start" en dur dans ses styles, qui écrase l'alignItems
              // du parent — contourné en l'enveloppant dans une View étirée sur toute la hauteur
              // de la rangée (voir le même contournement tenté plus haut pour le Bz).
              <View style={solarWindCardStyles.badgeWrapper}>
                <Badge
                  text={t(`solarWind.scale.${solarWind.current.level}`)}
                  backgroundColor={app_colors.yellow.main}
                  foregroundColor={app_colors.primary.main}
                />
              </View>
            )
          }
        </View>

        <View style={solarWindCardStyles.container.scale}>
          <View style={solarWindCardStyles.relativeWrapper}>
            <View style={solarWindCardStyles.container.scale.track}>
              {
                SOLAR_WIND_LEVELS.map((level) => (
                  <View
                    key={level}
                    style={[
                      solarWindCardStyles.container.scale.track.segment,
                      solarWind?.current?.level === level && solarWindCardStyles.container.scale.track.segment.active,
                    ]}
                  />
                ))
              }
            </View>
          </View>
          <View style={solarWindCardStyles.container.scale.labels}>
            {
              SOLAR_WIND_LEVELS.map((level) => (
                <Text key={level} style={solarWindCardStyles.container.scale.labels.label}>
                  {t(`solarWind.scale.${level}`)}
                </Text>
              ))
            }
          </View>
        </View>

        <View style={solarWindCardStyles.container.divider} />

        <View style={solarWindCardStyles.container.details}>
          <View style={solarWindCardStyles.container.details.column}>
            <Text style={solarWindCardStyles.container.details.column.label}>{t("solarWind.density")}</Text>
            <Text style={solarWindCardStyles.container.details.column.value}>
              {solarWind?.current?.density != null ? `${solarWind.current.density.toFixed(1)} p/cm³` : "--"}
            </Text>
          </View>
          <View style={solarWindCardStyles.container.details.column}>
            <Text style={solarWindCardStyles.container.details.column.label}>{t("solarWind.temperature")}</Text>
            <Text style={solarWindCardStyles.container.details.column.value}>
              {solarWind?.current?.temperature != null ? `${formatWithSpaces(Math.round(solarWind.current.temperature))} K` : "--"}
            </Text>
          </View>
        </View>

        {
          solarWind?.current && (
            <Text style={solarWindCardStyles.container.description}>
              {t(`solarWind.descriptions.${solarWind.current.level}`)}
            </Text>
          )
        }
      </View>
    </View>
  );
};

export default SolarWindCard;
