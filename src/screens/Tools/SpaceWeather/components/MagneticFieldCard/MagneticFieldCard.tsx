import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Magnet } from "lucide-react-native";
import { globalStyles } from "../../../../../helpers/globalStyles";
import { app_colors } from "../../../../../helpers/variables";
import Badge from "../../../../../components/Badges/Badge/Badge";
import InfoTooltip from "../../../../../components/overlays/InfoTooltip/InfoTooltip";
import type { ImfData } from "../../../../../types/spaceWeather/InterplanetaryMagneticField";
import { magneticFieldCardStyles } from "./MagneticFieldCard.styles";

// Amplitude affichée de la jauge Bz : demandé jusqu'à ±30 nT (au-delà, valeur bornée visuellement
// — un Bz hors de cette plage reste un évènement extrême, le marqueur sature au bord plutôt que de
// sortir de la piste).
const BZ_MIN = -30;
const BZ_MAX = 30;

interface MagneticFieldCardProps {
  imf: ImfData | null;
}

/**
 * Champ magnétique interplanétaire (Bz/Bt). `imf` reçu en prop plutôt que récupéré ici : il partage
 * un minuteur de rafraîchissement (5 min) avec le vent solaire côté API (même cadence documentée),
 * donc fetché une fois pour les deux par le parent plutôt que deux minuteurs séparés — voir
 * SpaceWeatherScreen.
 */
const MagneticFieldCard = ({ imf }: MagneticFieldCardProps) => {
  const { t } = useTranslation("tools/spaceWeather");

  return (
    <View style={globalStyles.defaultCard}>
      <View style={globalStyles.defaultCard.header}>
        <View style={magneticFieldCardStyles.titleRow}>
          <Magnet color={app_colors.primary.medium} size={20} />
          <Text style={globalStyles.categoryTitle}>{t("magneticField.title")}</Text>
        </View>
        <View style={magneticFieldCardStyles.titleRow}>
          {
            imf?.current && (
              <Badge
                text={t(`magneticField.level.${imf.current.level}`)}
                backgroundColor={imf.current.auroraFavorable ? app_colors.accent.light : app_colors.primary.light}
                foregroundColor={imf.current.auroraFavorable ? app_colors.accent.main : app_colors.primary.medium}
              />
            )
          }
          <InfoTooltip title={t("magneticField.tooltip.title")} description={t("magneticField.tooltip.description")} />
        </View>
      </View>

      <View style={magneticFieldCardStyles.container}>
        <View style={magneticFieldCardStyles.container.values}>
          <View style={magneticFieldCardStyles.valueGroup}>
            <Text style={magneticFieldCardStyles.container.values.main}>
              {imf?.current ? imf.current.bz.toFixed(1) : "--"}
            </Text>
            <Text style={magneticFieldCardStyles.container.values.unit}>nT</Text>
          </View>

          <View style={magneticFieldCardStyles.valueGroup}>
            <Text style={magneticFieldCardStyles.container.values.text}>Bt</Text>
            <Text style={magneticFieldCardStyles.container.values.secondary}>
              {imf?.current ? imf.current.bt.toFixed(1) : "--"}
            </Text>
            <Text style={magneticFieldCardStyles.container.values.text}>nT</Text>
          </View>
        </View>

        <View style={magneticFieldCardStyles.bzScale}>
          <View style={magneticFieldCardStyles.bzScale.track}>
            {
              imf?.current && (() => {
                const clamped = Math.min(Math.max(imf.current.bz, BZ_MIN), BZ_MAX);
                const valuePercent = ((clamped - BZ_MIN) / (BZ_MAX - BZ_MIN)) * 100; // 0..100, 50 = centre (0 nT)
                const fillLeft = Math.min(50, valuePercent);
                const fillWidth = Math.abs(valuePercent - 50);

                return (
                  <View
                    style={[
                      magneticFieldCardStyles.bzScale.track.fill,
                      { left: `${fillLeft}%`, width: `${fillWidth}%` },
                    ]}
                  />
                );
              })()
            }
            {/* Repère fixe du 0 — ne bouge jamais, seul le remplissage jaune indique la valeur. */}
            <View style={[magneticFieldCardStyles.bzScale.track.marker, { left: "50%" }]} />
          </View>
          <View style={[magneticFieldCardStyles.bzScale.extremes, { position: "relative" }]}>
            <Text style={magneticFieldCardStyles.bzScale.extremes.text}>
              {t("magneticField.scale.south")}
            </Text>
            {/* Position absolue sur toute la largeur de la rangée + textAlign:"center", plutôt
                que de compter sur flex pour équilibrer les deux côtés : ça centre le "0" sur le
                centre réel de la rangée (= centre de la piste au-dessus) indépendamment de la
                largeur des textes latéraux — flex:1 des deux côtés n'a pas suffi à l'obtenir. */}
            <Text style={[magneticFieldCardStyles.bzScale.extremes.text, { position: "absolute", left: 0, right: 0, textAlign: "center" }]}>
              0
            </Text>
            <Text style={magneticFieldCardStyles.bzScale.extremes.text}>
              {t("magneticField.scale.north")}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MagneticFieldCard;
