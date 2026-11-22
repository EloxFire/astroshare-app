import { useEffect, useMemo, useState } from "react";
import { InteractionManager, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import {
  getBodyNextRise,
  getBodyNextSet,
  getLunarEquatorialCoordinate,
  getLunarIllumination,
  getLunarPhase,
} from "@observerly/astrometry";
import { useLocation } from "../../../../context/LocationContext";
import { useAppUnits } from "../../../../hooks/useAppUnits";
import { getLunarPhaseLabel, getNextFullMoon } from "../../../../helpers/astrometry/moon/moonHelpers";
import { getAltitudeCurve, getCulmination } from "../../../../helpers/astrometry/altitude/altitudeCurve";
import MoonPhase from "../../../../components/rendering/MoonPhase/MoonPhase";
import type { CatalogObjectSummary } from "../../../../types/catalog/CatalogObject";
import { moonSearchCardStyles } from "./MoonSearchCard.styles";

interface MoonSearchCardProps {
  // Reçu du parent (déjà en main suite à la recherche) plutôt que re-fetché ici : évite un appel
  // réseau redondant pour une fiche qu'on vient de recevoir.
  object: CatalogObjectSummary;
}

type ComputedMoon = {
  phase: string;
  illumination: string;
  riseDate?: Date;
  setDate?: Date;
  culminationDate?: Date;
  culminationAltitude?: number;
  nextFullMoon: Date;
  daysUntilFullMoon: number;
};

/**
 * Carte spéciale affichée quand une recherche résout sur la Lune (plutôt qu'une ligne de résultat
 * générique) : rendu 3D (MoonPhase), phase/illumination, lever/culmination/coucher du soir, compte
 * à rebours jusqu'à la prochaine pleine lune, et liens vers le calendrier lunaire/le viewer 3D/la
 * fiche objet générique.
 */
const MoonSearchCard = ({ object }: MoonSearchCardProps) => {
  const { t } = useTranslation("search");
  const { location } = useLocation();
  const { formatDate } = useAppUnits();

  const user = useMemo(() => ({
    latitude: location?.latitude ?? 0,
    longitude: location?.longitude ?? 0,
    elevation: location?.elevation ?? 0,
  }), [location]);

  const [computed, setComputed] = useState<ComputedMoon | null>(null);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      const now = new Date();
      const eqCoords = getLunarEquatorialCoordinate(now);
      const nextRise = getBodyNextRise(now, user, eqCoords);
      const nextSet = getBodyNextSet(now, user, eqCoords);
      const points = getAltitudeCurve(now, user, getLunarEquatorialCoordinate);
      const culmination = getCulmination(points);
      const nextFullMoon = getNextFullMoon(now);

      setComputed({
        phase: getLunarPhaseLabel(getLunarPhase(now)),
        illumination: getLunarIllumination(now).toFixed(0),
        riseDate: nextRise ? nextRise.datetime : undefined,
        setDate: nextSet ? nextSet.datetime : undefined,
        culminationDate: culmination?.date,
        culminationAltitude: culmination?.altitude,
        nextFullMoon,
        daysUntilFullMoon: Math.round((nextFullMoon.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      });
    });

    return () => task.cancel();
  }, [user]);

  return (
    <View style={moonSearchCardStyles.card}>
      <View style={moonSearchCardStyles.header}>
        <MoonPhase date={new Date()} size={72} observer={location ? user : undefined} />

        <View style={moonSearchCardStyles.header.texts}>
          {location?.name && (
            <Text style={moonSearchCardStyles.header.texts.caption}>{t("moon.tonightAt", { city: location.name })}</Text>
          )}
          <Text style={moonSearchCardStyles.header.texts.name}>{object.name}</Text>
          {computed && (
            <Text style={moonSearchCardStyles.header.texts.phase}>
              {computed.phase} · {computed.illumination} %
            </Text>
          )}
        </View>
      </View>

      <View style={moonSearchCardStyles.statsRow}>
        <View style={moonSearchCardStyles.statsRow.stat}>
          <Text style={moonSearchCardStyles.statsRow.stat.time}>
            {computed?.riseDate ? formatDate(computed.riseDate).format("HH:mm") : "--:--"}
          </Text>
          <Text style={moonSearchCardStyles.statsRow.stat.caption}>{t("moon.rise")}</Text>
        </View>
        <View style={moonSearchCardStyles.statsRow.stat}>
          <Text style={moonSearchCardStyles.statsRow.stat.time}>
            {computed?.culminationDate ? formatDate(computed.culminationDate).format("HH:mm") : "--:--"}
          </Text>
          <Text style={moonSearchCardStyles.statsRow.stat.caption}>
            {t("moon.culmination", { altitude: computed?.culminationAltitude?.toFixed(0) ?? "--" })}
          </Text>
        </View>
        <View style={moonSearchCardStyles.statsRow.stat}>
          <Text style={moonSearchCardStyles.statsRow.stat.time}>
            {computed?.setDate ? formatDate(computed.setDate).format("HH:mm") : "--:--"}
          </Text>
          <Text style={moonSearchCardStyles.statsRow.stat.caption}>{t("moon.set")}</Text>
        </View>
      </View>

      <View style={moonSearchCardStyles.fullMoonRow}>
        <Text style={moonSearchCardStyles.fullMoonRow.label}>{t("moon.fullMoon")}</Text>
        {computed && (
          <Text style={moonSearchCardStyles.fullMoonRow.value}>
            {formatDate(computed.nextFullMoon).format("ddd DD MMM")} · {t("moon.daysUntil", { count: computed.daysUntilFullMoon })}
          </Text>
        )}
      </View>

      <View style={moonSearchCardStyles.actionsRow}>
        <TouchableOpacity
          style={[moonSearchCardStyles.actionsRow.button, moonSearchCardStyles.actionsRow.button.primary]}
          onPress={() => router.push("/tools/moon-calendar")}
        >
          <Text style={[moonSearchCardStyles.actionsRow.button.text, moonSearchCardStyles.actionsRow.button.primaryText]}>
            {t("moon.openCalendar")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[moonSearchCardStyles.actionsRow.button, moonSearchCardStyles.actionsRow.button.secondary]}
          onPress={() => router.push("/tools/3d-viewer/models/moon")}
        >
          <Text style={[moonSearchCardStyles.actionsRow.button.text, moonSearchCardStyles.actionsRow.button.secondaryText]}>
            {t("moon.open3D")}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push(`/objects/${object.id}`)}>
        <Text style={moonSearchCardStyles.detailsLink}>{t("moon.fullDetails")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MoonSearchCard;
