import { memo, useMemo } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react-native";
import type { GeographicCoordinate } from "@observerly/astrometry";
import EclipseCircumstancesSheet from "../../Tools/Eclipses/components/EclipseCircumstancesSheet/EclipseCircumstancesSheet";
import ValueCard from "../../../components/cards/ValueCard/ValueCard";
import AltitudeChart from "../../../components/charts/AltitudeChart/AltitudeChart";
import { getCatalogObjectIcon } from "../../../helpers/catalog/categoryIcon";
import { getCatalogObjectSubtitle } from "../../../helpers/journal/sessions";
import { getObjectEquatorialCoordinateResolver } from "../../../helpers/catalog/objectEphemeris";
import { getAltitudeCurve } from "../../../helpers/astrometry/altitude/altitudeCurve";
import { getVisibilityWindow } from "../../../helpers/astrometry/night/nightWindow";
import { formatLocaleNumber } from "../../../helpers/format";
import { app_colors } from "../../../helpers/variables";
import { SOLAR_SYSTEM_CATALOG_ID } from "../../../helpers/planetarium/layers/SolarSystemLayer";
import type { PickedObject } from "../../../helpers/planetarium/selection/ObjectPicker";
import type { CatalogObjectDetail } from "../../../types/catalog/CatalogObject";
import { objectSelectionSheetStyles as styles } from "./ObjectSelectionSheet.styles";

interface ObjectSelectionSheetProps {
  picked: PickedObject;
  detail: CatalogObjectDetail | null;
  observer: GeographicCoordinate;
  minimized: boolean;
  onExpand: () => void;
  onMinimize: () => void;
  onClose: () => void;
  bottomInset: number;
}

const catalogIdFor = (picked: PickedObject, detail: CatalogObjectDetail | null): string =>
  detail?.id ?? (picked.kind === "solar_system" ? SOLAR_SYSTEM_CATALOG_ID[picked.bodyId] : picked.object.id);

/**
 * Fiche de sélection (phase 5) : affichée dès le tap avec ce qu'on a déjà en main (nom/catégorie/
 * magnitude pour une étoile/un DSO, immédiatement disponibles depuis le résumé catalogue déjà chargé
 * en mémoire), complétée dès que `getObjectById` répond (fiche complète, nécessaire pour la courbe
 * d'altitude/lever-coucher — ces helpers attendent un `CatalogObjectDetail`, voir
 * getObjectEquatorialCoordinateResolver). Pour un corps du système solaire, rien n'est disponible
 * avant cette réponse (le catalogue ne liste jamais leur position/magnitude, voir
 * CatalogObjectSolarSystemDetails) : seul le nom traduit s'affiche en attendant.
 *
 * Volontairement un RÉSUMÉ + un bouton vers la fiche complète existante (`app/objects/[id]`) plutôt
 * qu'une reconstruction de tout ObjectDetailsScreen dans cette feuille — simplification assumée, à
 * mentionner à l'utilisateur.
 */
const ObjectSelectionSheet = ({ picked, detail, observer, minimized, onExpand, onMinimize, onClose, bottomInset }: ObjectSelectionSheetProps) => {
  const { t, i18n } = useTranslation(["explore", "objects/details"]);
  const router = useRouter();

  // Superset de `CatalogObjectSummary` dès que la fiche complète est chargée ; avant ça, le résumé
  // catalogue qu'on a déjà pour une étoile/un DSO (tap immédiat, pas d'attente réseau) — `undefined`
  // pour un corps du système solaire pas encore chargé (aucun résumé catalogue pour ces objets).
  const summary = detail ?? (picked.kind !== "solar_system" ? picked.object : undefined);

  const displayName = picked.kind === "solar_system" ? t(`explore:bodies.${picked.bodyId}`) : summary?.name ?? "";
  const Icon = getCatalogObjectIcon(summary?.category ?? "solar_system");
  const categoryLabel = summary ? getCatalogObjectSubtitle(summary, t) : "";

  const altitudeData = useMemo(() => {
    const resolver = getObjectEquatorialCoordinateResolver(detail, observer);
    if (!resolver) return null;
    const now = new Date();
    const points = getAltitudeCurve(now, observer, resolver);
    const window = getVisibilityWindow(now, observer, resolver);
    return { points, riseDate: window?.start, setDate: window?.end };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `observer` est un nouvel objet à
    // chaque render (voir ExploreScreen) : seules ses coordonnées comptent pour cette fenêtre.
  }, [detail, observer.latitude, observer.longitude]);

  return (
    <EclipseCircumstancesSheet
      minimized={minimized}
      onExpand={onExpand}
      onMinimize={onMinimize}
      onClose={onClose}
      bottomInset={bottomInset}
      header={
        <View style={styles.header}>
          <View style={styles.header.iconBloc}>
            <Icon size={18} color={app_colors.accent.main} />
          </View>
          <View style={styles.header.textBloc}>
            <Text style={styles.header.textBloc.name} numberOfLines={1}>
              {displayName}
            </Text>
            {!!categoryLabel && (
              <Text style={styles.header.textBloc.category} numberOfLines={1}>
                {categoryLabel}
              </Text>
            )}
          </View>
        </View>
      }
    >
      {!summary ? (
        <ActivityIndicator color={app_colors.accent.main} style={styles.loader} />
      ) : (
        <>
          <View style={styles.statsRow}>
            {summary.magnitude != null && (
              <ValueCard title={t("objects/details:stats.magnitude")} value={formatLocaleNumber(summary.magnitude, i18n.language, 1)} />
            )}
            {summary.distance && (
              <ValueCard
                title={t("objects/details:stats.distance")}
                value={`${formatLocaleNumber(summary.distance.value, i18n.language, summary.distance.unit === "ly" ? 0 : 2)} ${
                  summary.distance.unit === "ly" ? t("objects/details:lightYearsAbbr") : summary.distance.unit
                }`}
              />
            )}
          </View>

          {altitudeData && altitudeData.points.length > 1 && (
            <AltitudeChart points={altitudeData.points} riseDate={altitudeData.riseDate} setDate={altitudeData.setDate} />
          )}

          <TouchableOpacity style={styles.fullSheetButton} onPress={() => router.push(`/objects/${catalogIdFor(picked, detail)}`)}>
            <Text style={styles.fullSheetButton.text}>{t("explore:selection.viewFullSheet")}</Text>
            <ChevronRight size={16} color={app_colors.accent.main} />
          </TouchableOpacity>
        </>
      )}
    </EclipseCircumstancesSheet>
  );
};

// `memo` : évite de re-rendre toute la feuille (dont le SVG d'AltitudeChart, bien plus lourd) à
// chaque re-rendu d'ExploreScreen (ex: `setDisplayedDate` ~20/s) tant que ses props ne changent pas
// réellement — suppose que l'écran appelant passe des props stables (`observer` mémoïsé, handlers en
// `useCallback`), ce qu'il fait déjà.
export default memo(ObjectSelectionSheet);
