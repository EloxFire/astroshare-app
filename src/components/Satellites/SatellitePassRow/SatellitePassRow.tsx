import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { satellitePassRowStyles } from "./SatellitePassRow.styles";
import { useAppUnits } from "../../../hooks/useAppUnits";
import { resolvePassQualityKey } from "../../../helpers/satellites/labels";
import { formatDuration } from "../../../helpers/format";
import Badge from "../../Badges/Badge/Badge";
import { app_colors } from "../../../helpers/variables";
import type { SatellitePass } from "../../../types/satellites/SatelliteTracking";

const QUALITY_COLORS: Record<string, { background: string; foreground: string }> = {
  excellent: { background: app_colors.green.light, foreground: app_colors.green.main },
  good: { background: app_colors.accent.light, foreground: app_colors.accent.main },
  faint: { background: app_colors.grey, foreground: app_colors.primary.medium },
};

interface SatellitePassRowProps {
  pass: SatellitePass;
}

/**
 * Ligne d'un passage à venir dans la liste (hors passage mis en avant, voir PassArcChart pour
 * celui-ci) : date, barre d'élévation max (sur 90°), qualité, durée.
 */
const SatellitePassRow = ({ pass }: SatellitePassRowProps) => {
  const { t } = useTranslation("tools/satelliteTracker");
  const { formatDate } = useAppUnits();

  const qualityKey = resolvePassQualityKey(pass.quality);
  const colors = QUALITY_COLORS[qualityKey];
  const fillRatio = Math.min(Math.max(pass.maxEl / 90, 0), 1);

  return (
    <View style={satellitePassRowStyles.row}>
      <View style={satellitePassRowStyles.dateBloc}>
        <Text style={satellitePassRowStyles.dateBloc.date}>{formatDate(pass.startUTC * 1000).format("ddd DD/MM")}</Text>
        <Text style={satellitePassRowStyles.dateBloc.compassRange}>
          {`${formatDate(pass.startUTC * 1000).format("HH:mm")} · ${pass.startAzCompass} → ${pass.endAzCompass}`}
        </Text>
      </View>

      <View style={satellitePassRowStyles.barBloc}>
        <View style={satellitePassRowStyles.barBloc.track}>
          <View style={[satellitePassRowStyles.barBloc.track.fill, { width: `${fillRatio * 100}%` }]} />
        </View>
        <Text style={satellitePassRowStyles.barBloc.duration}>{formatDuration(pass.duration, t)}</Text>
      </View>

      <Text style={satellitePassRowStyles.elevation}>{`${Math.round(pass.maxEl)}°`}</Text>

      <Badge text={t(`passQuality.${qualityKey}`)} backgroundColor={colors.background} foregroundColor={colors.foreground} />
    </View>
  );
};

export default SatellitePassRow;
