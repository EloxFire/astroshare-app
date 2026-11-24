import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { getConstellation } from "@observerly/astrometry";
import { globalStyles } from "../../../../helpers/globalStyles";
import { app_colors } from "../../../../helpers/variables";
import { captitalizeFirstLetter, formatLocaleNumber } from "../../../../helpers/format";
import { useLocation } from "../../../../context/LocationContext";
import { useAppUnits } from "../../../../hooks/useAppUnits";
import { ScreenHeader } from "../../../../components/layout/ScreenHeader/ScreenHeader";
import SectionHeader from "../../../../components/layout/SectionHeader/SectionHeader";
import ValueCard from "../../../../components/cards/ValueCard/ValueCard";
import ListCard from "../../../../components/cards/ListCard/ListCard";
import SkyPreview from "../../../../components/charts/SkyPreview/SkyPreview";
import { getObjectById } from "../../../../helpers/api/catalog/objects";
import { getObjectEquatorialCoordinateResolver } from "../../../../helpers/catalog/objectEphemeris";
import { refineConjunctionAround, type Conjunction } from "../../../../helpers/catalog/conjunctions";
import { getCatalogObjectTitle } from "../../../../helpers/journal/sessions";
import type { CatalogObjectDetail } from "../../../../types/catalog/CatalogObject";
import { conjunctionDetailsScreenStyles } from "./ConjunctionDetailsScreen.styles";

// Pas de borne de séparation à ce stade (contrairement à la recherche) : la conjonction est déjà
// confirmée (trouvée par l'écran liste), on veut juste la retrouver précisément à partir de son
// horodatage de route — un seuil très large garantit que refineConjunctionAround ne la rejette pas.
const NO_SEPARATION_LIMIT_DEG = 180;

const ConjunctionDetailsScreen = () => {
  const { id, objA, objB, lat, lon, elev } = useLocalSearchParams<{ id: string; objA: string; objB: string; lat?: string; lon?: string; elev?: string }>();
  const midDateMs = Number(id);
  const { t, i18n } = useTranslation("tools/conjunctions");
  const { location } = useLocation();
  const { formatDate } = useAppUnits();

  const [objectADetail, setObjectADetail] = useState<CatalogObjectDetail | null>(null);
  const [objectBDetail, setObjectBDetail] = useState<CatalogObjectDetail | null>(null);
  const [conjunction, setConjunction] = useState<Conjunction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Le lieu utilisé pour trouver cette conjonction depuis l'écran liste n'est pas forcément
  // `location` (contexte) : il peut s'agir d'un lieu choisi sur la carte, transmis en query params
  // (voir handleConjunctionPress dans ConjunctionsScreen.tsx).
  const observer = lat && lon
    ? { latitude: Number(lat), longitude: Number(lon), elevation: elev ? Number(elev) : 0 }
    : location
      ? { latitude: location.latitude, longitude: location.longitude, elevation: location.elevation ?? 0 }
      : null;

  useFocusEffect(
    useCallback(() => {
      if (!observer || !objA || !objB || !Number.isFinite(midDateMs)) return;
      let cancelled = false;
      setIsLoading(true);

      (async () => {
        const [detailA, detailB] = await Promise.all([getObjectById(objA), getObjectById(objB)]);
        if (cancelled) return;
        setObjectADetail(detailA);
        setObjectBDetail(detailB);

        const resolverA = detailA ? getObjectEquatorialCoordinateResolver(detailA, observer) : null;
        const resolverB = detailB ? getObjectEquatorialCoordinateResolver(detailB, observer) : null;
        if (!resolverA || !resolverB) {
          setConjunction(null);
          setIsLoading(false);
          return;
        }

        setConjunction(refineConjunctionAround(resolverA, resolverB, observer, midDateMs, NO_SEPARATION_LIMIT_DEG));
        setIsLoading(false);
      })();

      return () => { cancelled = true; };
    }, [observer?.latitude, observer?.longitude, observer?.elevation, objA, objB, midDateMs])
  );

  if (isLoading) {
    return (
      <View style={globalStyles.screen}>
        <ScreenHeader title={t("details.screenTitle")} main={false} />
        <ActivityIndicator size="large" color={app_colors.accent.main} style={conjunctionDetailsScreenStyles.loader} />
      </View>
    );
  }

  if (!conjunction || !objectADetail || !objectBDetail) {
    return (
      <View style={globalStyles.screen}>
        <ScreenHeader title={t("details.screenTitle")} main={false} />
        <Text style={conjunctionDetailsScreenStyles.notFound}>{t("details.notFound")}</Text>
      </View>
    );
  }

  const constellation = getConstellation(conjunction.midpoint);

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader
        title={captitalizeFirstLetter(formatDate(conjunction.midDate).format("dddd DD MMMM YYYY"))}
        subtitle={formatDate(conjunction.midDate).format("HH:mm")}
        main={false}
      />

      <ScrollView>
        <View style={globalStyles.content}>
          <View style={conjunctionDetailsScreenStyles.section}>
            <SectionHeader title={`${getCatalogObjectTitle(objectADetail)} · ${getCatalogObjectTitle(objectBDetail)}`} />

            <View style={conjunctionDetailsScreenStyles.statsGrid}>
              <View style={conjunctionDetailsScreenStyles.statsGrid.statsRow}>
                <ValueCard
                  reverse
                  title={t("list.separationLabel")}
                  value={`${formatLocaleNumber(conjunction.separationArcmin / 60, i18n.language, 2)}°`}
                />
                <ValueCard
                  reverse
                  title={t("details.stats.position")}
                  value={`${conjunction.azimuth.toFixed(0)}° / ${conjunction.altitude.toFixed(0)}°`}
                />
              </View>
            </View>
          </View>

          {constellation && (
            <SkyPreview
              constellation={constellation}
              target={[
                { ra: conjunction.objectA.ra, dec: conjunction.objectA.dec, label: getCatalogObjectTitle(objectADetail) },
                { ra: conjunction.objectB.ra, dec: conjunction.objectB.dec, label: getCatalogObjectTitle(objectBDetail), color: app_colors.accent.main },
              ]}
              fieldDegrees={conjunction.separationArcmin / 60 * 1.5} // un peu plus large que la séparation pour que les deux objets soient visibles
              center={{ ra: conjunction.midpoint.ra, dec: conjunction.midpoint.dec }}
            />
          )}

          <View style={conjunctionDetailsScreenStyles.section}>
            <SectionHeader title={t("details.technical.title")} />
            <ListCard
              items={[
                { title: t("details.stats.time"), value: formatDate(conjunction.midDate).format("HH:mm:ss") },
                ...(constellation ? [{ title: t("details.technical.constellation"), value: constellation.name }] : []),
              ]}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ConjunctionDetailsScreen;
