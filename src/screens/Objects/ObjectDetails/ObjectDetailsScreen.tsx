import { useEffect, useState } from "react";
import { InteractionManager, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { router, useLocalSearchParams } from "expo-router";
import { Eye, InfoIcon, Telescope } from "lucide-react-native";
import { convertEquatorialToHorizontal, getBodyNextRise, getBodyNextSet, getConstellation, getLunarEquatorialCoordinate, getPlanetaryHeliocentricDistance, getPlanetaryPositions, getSolarEquatorialCoordinate } from "@observerly/astrometry";
import type { Constellation, EquatorialCoordinate } from "@observerly/astrometry";
import { globalStyles } from "../../../helpers/globalStyles";
import { app_colors, withOpacity } from "../../../helpers/variables";
import { formatLocaleNumber } from "../../../helpers/format";
import { getObjectById } from "../../../helpers/api/catalog/objects";
import { getCatalogObjectIcon } from "../../../helpers/catalog/categoryIcon";
import { getObjectAngularSize } from "../../../helpers/fieldSimulator/objectAngularSize";
import { formatAngularSizeLabel } from "../../../helpers/fieldSimulator/fieldOfView";
import { getAltitudeCurve, findPreviousHorizonCrossing } from "../../../helpers/astrometry/altitude/altitudeCurve";
import { useLocation } from "../../../context/LocationContext";
import { useAppUnits } from "../../../hooks/useAppUnits";
import { ScreenHeader } from "../../../components/layout/ScreenHeader/ScreenHeader";
import SectionHeader from "../../../components/layout/SectionHeader/SectionHeader";
import Badge from "../../../components/Badges/Badge/Badge";
import Button from "../../../components/buttons/Button/Button";
import ValueCard from "../../../components/cards/ValueCard/ValueCard";
import ListCard from "../../../components/cards/ListCard/ListCard";
import AltitudeChart from "../../../components/charts/AltitudeChart/AltitudeChart";
import SkyPreview from "../../../components/charts/SkyPreview/SkyPreview";
import type { CatalogObjectDetail } from "../../../types/catalog/CatalogObject";
import { objectDetailsScreenStyles } from "./ObjectDetailsScreen.styles";
import InfoCard from "../../../components/cards/InfoCard/InfoCard";
import { getConstellationName } from "../../../helpers/astrometry/constellations/constellationName";
import { getConstellationByAbbreviation } from "../../../helpers/astrometry/constellations/getConstellationByAbbreviation";

// RA en degrés (convention du catalogue, vérifiée en direct) → h/min/s (÷15, 360° = 24h).
const formatRightAscension = (raDegrees: number): string => {
  const totalHours = raDegrees / 15;
  const hours = Math.floor(totalHours);
  const minutes = Math.floor((totalHours - hours) * 60);
  const seconds = Math.round(((totalHours - hours) * 60 - minutes) * 60);
  return `${String(hours).padStart(2, "0")} h ${String(minutes).padStart(2, "0")} min ${String(seconds).padStart(2, "0")} s`;
};

const formatDeclination = (decDegrees: number): string => {
  const sign = decDegrees >= 0 ? "+" : "-";
  const absolute = Math.abs(decDegrees);
  const degrees = Math.floor(absolute);
  const minutes = Math.round((absolute - degrees) * 60);
  return `${sign}${String(degrees).padStart(2, "0")}° ${String(minutes).padStart(2, "0")}′`;
};

// "Désignations · M 42 · NGC 1976" — toutes les désignations connues, dans cet ordre, celles
// absentes simplement omises (un objet peut n'avoir aucun catalogue alternatif — un objet du
// système solaire n'a par exemple ni messier/caldwell/ngc/ic, voir CatalogObjectDesignations).
const formatDesignations = (designations: CatalogObjectDetail["designations"]): string => {
  const parts: string[] = [];
  if (designations.messier != null) parts.push(`M ${designations.messier}`);
  if (designations.ngc?.length) parts.push(`NGC ${designations.ngc.join(", ")}`);
  if (designations.ic?.length) parts.push(`IC ${designations.ic.join(", ")}`);
  if (designations.caldwell != null) parts.push(`C${designations.caldwell}`);
  if (designations.other?.length) parts.push(...designations.other);
  if (designations.aliases?.length) parts.push(...designations.aliases);
  return parts.join(" · ");
};

const ObjectDetailsScreen = () => {
  const { t, i18n } = useTranslation("objects/details");
  const objectId = useLocalSearchParams().id as string;
  const { location } = useLocation();
  const { formatDate } = useAppUnits();

  const [object, setObject] = useState<CatalogObjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [altitudeData, setAltitudeData] = useState<{ points: ReturnType<typeof getAltitudeCurve>; riseDate?: Date; setDate?: Date } | null>(null);
  const [planetEphemeris, setPlanetEphemeris] = useState<{
    ra: number;
    dec: number;
    alt: number;
    az: number;
    constellation: Constellation | null;
    distanceFromSunAu: number;
    semiMajorAxisAu: number;
    eccentricity: number;
    inclinationDeg: number;
    orbitalPeriodYears: number;
    relativeMass: number;
    relativeRadius: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    (async () => {
      const detail = await getObjectById(objectId);
      if (cancelled) return;
      setObject(detail);
      setIsLoading(false);
    })();
    return () => { cancelled = true; };
  }, [objectId]);

  // Pas de router.push direct pendant le rendu (même raison que TelescopeDetails/ChecklistDetailsScreen) :
  // une fois le chargement terminé, un id invalide (404 → null) déclenche le retour via cet effet.
  useEffect(() => {
    if (!isLoading && !object) router.back();
  }, [isLoading, object]);

  // Courbe d'altitude "ce soir à <ville>" : pour un objet à position fixe (étoile, DSO) comme pour
  // un objet du système solaire (Soleil, Lune, planète — position toujours null côté catalogue pour
  // ce kind, voir CatalogObjectKind, recalculée localement à chaque échantillon). getAltitudeCurve/
  // findPreviousHorizonCrossing attendent déjà une fonction (atDate: Date) => coordonnée plutôt
  // qu'une coordonnée fixe pour cette raison (voir leur commentaire dans altitudeCurve.ts) : il
  // suffit de leur fournir la bonne source selon le type d'objet.
  useEffect(() => {
    if (!location) { setAltitudeData(null); return; }

    let getEquatorialCoordinate: ((atDate: Date) => EquatorialCoordinate) | null = null;
    if (object?.position) {
      const position = object.position;
      getEquatorialCoordinate = () => ({ ra: position.ra, dec: position.dec });
    } else {
      const ephemeris = object?.solar_system?.ephemeris;
      if (ephemeris?.body === "sun") {
        getEquatorialCoordinate = getSolarEquatorialCoordinate;
      } else if (ephemeris?.body === "moon") {
        getEquatorialCoordinate = getLunarEquatorialCoordinate;
      } else if (ephemeris?.body === "planet") {
        const observer = { latitude: location.latitude, longitude: location.longitude, elevation: location.elevation ?? 0 };
        // getPlanetaryPositions calcule les 7 planètes autres que la Terre d'un coup : on ne garde
        // que celle qui correspond à cet objet (voir le commentaire de l'effet ephemeris.name/uid
        // ci-dessous), recalculée à chaque échantillon de la courbe puisqu'elle prend `atDate`.
        getEquatorialCoordinate = (atDate) => {
          const planet = getPlanetaryPositions(atDate, observer).find(
            (p) => (ephemeris.name && p.name.toLowerCase() === ephemeris.name.toLowerCase()) || (ephemeris.uid && p.uid === ephemeris.uid)
          );
          return planet ? { ra: planet.ra, dec: planet.dec } : { ra: 0, dec: 0 };
        };
      }
    }

    if (!getEquatorialCoordinate) { setAltitudeData(null); return; }
    const resolvedGetEquatorialCoordinate = getEquatorialCoordinate;

    const task = InteractionManager.runAfterInteractions(() => {
      const user = { latitude: location.latitude, longitude: location.longitude, elevation: location.elevation ?? 0 };
      const now = new Date();
      const points = getAltitudeCurve(now, user, resolvedGetEquatorialCoordinate);
      const nextRise = getBodyNextRise(now, user, resolvedGetEquatorialCoordinate(now));
      const nextSet = getBodyNextSet(now, user, resolvedGetEquatorialCoordinate(now));

      // Même raisonnement que SunSummaryCard/TonightView : getBodyNextRise/getBodyNextSet ne
      // renvoient jamais que le PROCHAIN évènement, pas celui déjà passé si l'objet est déjà levé —
      // on bascule alors sur l'évènement passé (recherché en arrière) côté opposé à celui à venir.
      const { alt: currentAltitude } = convertEquatorialToHorizontal(now, user, resolvedGetEquatorialCoordinate(now));
      const currentlyAboveHorizon = currentAltitude >= 0;
      const riseDate = currentlyAboveHorizon
        ? findPreviousHorizonCrossing(now, user, resolvedGetEquatorialCoordinate, "rise")
        : (nextRise ? nextRise.datetime : undefined);
      const setDate = currentlyAboveHorizon
        ? (nextSet ? nextSet.datetime : undefined)
        : findPreviousHorizonCrossing(now, user, resolvedGetEquatorialCoordinate, "set");

      setAltitudeData({ points, riseDate, setDate });
    });

    return () => task.cancel();
  }, [object, location]);

  // Fiche technique d'une planète (kind "solar_system", ephemeris.body "planet") : l'API ne donne
  // ni position ni magnitude pour ces objets (ils bougent, voir CatalogObjectKind) — on recalcule
  // localement avec @observerly/astrometry, seul fournisseur géré pour l'instant
  // (ephemeris.provider === "observerly", voir CatalogObjectEphemeris). getPlanetaryPositions calcule
  // d'un coup les 7 planètes autres que la Terre ; on ne garde que celle qui correspond à cet objet,
  // identifiée par ephemeris.name/uid (les seuls identifiants stables renvoyés par le catalogue pour
  // ce body, le nom affiché `object.name` peut être traduit et ne matche pas forcément celui
  // d'observerly).
  useEffect(() => {
    const ephemeris = object?.solar_system?.ephemeris;
    if (ephemeris?.body !== "planet" || !location) { setPlanetEphemeris(null); return; }

    const task = InteractionManager.runAfterInteractions(() => {
      const observer = { latitude: location.latitude, longitude: location.longitude, elevation: location.elevation ?? 0 };
      const now = new Date();
      const planet = getPlanetaryPositions(now, observer).find(
        (p) => (ephemeris.name && p.name.toLowerCase() === ephemeris.name.toLowerCase()) || (ephemeris.uid && p.uid === ephemeris.uid)
      );
      if (!planet) { setPlanetEphemeris(null); return; }

      setPlanetEphemeris({
        ra: planet.ra,
        dec: planet.dec,
        alt: planet.alt,
        az: planet.az,
        constellation: getConstellation({ ra: planet.ra, dec: planet.dec }) ?? null,
        distanceFromSunAu: getPlanetaryHeliocentricDistance(now, planet),
        semiMajorAxisAu: planet.a,
        eccentricity: planet.e,
        inclinationDeg: planet.i,
        orbitalPeriodYears: planet.T,
        relativeMass: planet.m,
        relativeRadius: planet.r,
      });
    });

    return () => task.cancel();
  }, [object, location]);

  if (isLoading || !object) return null;

  const Icon = getCatalogObjectIcon(object.category);
  const angularSize = getObjectAngularSize(object);
  // object.magnitude (catalogue) est parfois absent alors que la magnitude visuelle existe bien
  // côté photométrie (object.photometry.v, bande V de Johnson) : on s'y replie plutôt que de rater
  // l'affichage de la carte stat.
  const magnitude = object.magnitude ?? object.photometry.v;
  const designationsLabel = formatDesignations(object.designations);
  const description = i18n.language === "en" ? (object.content.description?.en ?? object.content.description?.fr) : object.content.description?.fr;

  // Carte "Position" (constellation tracée + repère de l'objet dedans) : seulement quand on a à la
  // fois une position (fixe pour une étoile/DSO, en direct pour une planète — voir planetEphemeris
  // ci-dessus) ET sa constellation. Le Soleil et la Lune n'ont pas d'éphéméride de constellation
  // calculée ici (hors périmètre de la fiche technique actuelle), donc pas de carte pour eux.
  const mapConstellation = object.position?.const
    ? getConstellationByAbbreviation(object.position.const)
    : planetEphemeris?.constellation ?? null;
  const mapTarget = object.position
    ? { ra: object.position.ra, dec: object.position.dec, label: object.name }
    : planetEphemeris
      ? { ra: planetEphemeris.ra, dec: planetEphemeris.dec, label: object.name }
      : null;

  const technicalItems: { title: string; value: string }[] = [];
  if (designationsLabel) technicalItems.push({ title: t("technical.designations"), value: designationsLabel });
  if (object.position) {
    technicalItems.push({ title: t("technical.rightAscension"), value: formatRightAscension(object.position.ra) });
    technicalItems.push({ title: t("technical.declination"), value: formatDeclination(object.position.dec) });
  } else if (planetEphemeris) {
    technicalItems.push({ title: t("technical.rightAscension"), value: formatRightAscension(planetEphemeris.ra) });
    technicalItems.push({ title: t("technical.declination"), value: formatDeclination(planetEphemeris.dec) });
    if (planetEphemeris.constellation) technicalItems.push({ title: t("technical.constellation"), value: planetEphemeris.constellation.name });
    technicalItems.push({ title: t("technical.altitude"), value: `${formatLocaleNumber(planetEphemeris.alt, i18n.language, 1)}°` });
    technicalItems.push({ title: t("technical.azimuth"), value: `${formatLocaleNumber(planetEphemeris.az, i18n.language, 1)}°` });
    technicalItems.push({ title: t("technical.distanceFromSun"), value: `${formatLocaleNumber(planetEphemeris.distanceFromSunAu, i18n.language, 2)} ${t("astronomicalUnitAbbr")}` });
    technicalItems.push({ title: t("technical.semiMajorAxis"), value: `${formatLocaleNumber(planetEphemeris.semiMajorAxisAu, i18n.language, 2)} ${t("astronomicalUnitAbbr")}` });
    technicalItems.push({ title: t("technical.eccentricity"), value: formatLocaleNumber(planetEphemeris.eccentricity, i18n.language, 3) });
    technicalItems.push({ title: t("technical.inclination"), value: `${formatLocaleNumber(planetEphemeris.inclinationDeg, i18n.language, 2)}°` });
    technicalItems.push({ title: t("technical.orbitalPeriod"), value: `${formatLocaleNumber(planetEphemeris.orbitalPeriodYears, i18n.language, 2)} ${t("yearsAbbr")}` });
    technicalItems.push({ title: t("technical.relativeMass"), value: `${formatLocaleNumber(planetEphemeris.relativeMass, i18n.language, 3)} ${t("earthUnit")}` });
    technicalItems.push({ title: t("technical.relativeRadius"), value: `${formatLocaleNumber(planetEphemeris.relativeRadius, i18n.language, 3)} ${t("earthUnit")}` });
  }
  if (object.dso?.size.pa != null) technicalItems.push({ title: t("technical.positionAngle"), value: `${object.dso.size.pa}°` });
  if (object.dso) technicalItems.push({ title: t("technical.morphology"), value: object.dso.morphology ?? t("technical.unknown") });

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader backgroundColor={app_colors.primary.main} title={object.name} />

      <ScrollView>
        <View style={objectDetailsScreenStyles.heroHeader}>

          <View style={objectDetailsScreenStyles.heroHeader.badgesRow}>
            <Badge
              text={t(`tools/journal/sessions/add:observedObjects.categories.${object.category}`, { defaultValue: object.category })}
              backgroundColor={app_colors.yellow.main}
              foregroundColor={app_colors.primary.main}
            />
            {object.position?.const && (
              <Badge text={getConstellationName(object.position.const) || ""} backgroundColor={withOpacity(app_colors.white, 0.15)} foregroundColor={app_colors.white} />
            )}
            {object.custom.naked_eye && (
              <Badge
                icon={Eye}
                text={t("nakedEye")}
                backgroundColor={withOpacity(app_colors.white, 0.15)}
                foregroundColor={app_colors.white}
              />
            )}
          </View>

          {designationsLabel && <Text style={objectDetailsScreenStyles.heroHeader.designations}>{designationsLabel}</Text>}
        </View>

        <View style={globalStyles.content}>
          <View style={objectDetailsScreenStyles.actionsRow}>
            <Button
              label={t("viewInFieldSimulator")}
              icon={Telescope}
              onPress={() => router.push(`/tools/field-simulator?objectId=${object.id}`)}
              style={{ flex: 1 }}
            />
          </View>

          <View style={objectDetailsScreenStyles.statsGrid}>
            {magnitude != null && (
              <ValueCard
                containerStyle={objectDetailsScreenStyles.statsGrid.tile}
                title={t("stats.magnitude")}
                value={formatLocaleNumber(magnitude, i18n.language, 1)}
              />
            )}
            {angularSize && (
              <ValueCard
                containerStyle={objectDetailsScreenStyles.statsGrid.tile}
                title={t("stats.apparentSize")}
                value={formatAngularSizeLabel(angularSize, i18n.language, formatLocaleNumber)}
              />
            )}
            {object.physical.distance && (
              <ValueCard
                containerStyle={objectDetailsScreenStyles.statsGrid.tile}
                title={t("stats.distance")}
                value={`${formatLocaleNumber(object.physical.distance.value, i18n.language, 0)} ${object.physical.distance.unit === "ly" ? t("lightYearsAbbr") : object.physical.distance.unit}`}
              />
            )}
            {((object.custom.best_months?.length ?? 0) > 0 || object.custom.difficulty) && (
              <ValueCard
                containerStyle={objectDetailsScreenStyles.statsGrid.tile}
                title={t("stats.bestMonths")}
                value={object.custom.best_months?.length ? object.custom.best_months.map((month) => formatDate(new Date(2000, month - 1, 1)).format("MMM")).join(" · ") : "--"}
                small
              />
            )}
          </View>

          {altitudeData && location && (
            <View style={globalStyles.defaultCard}>
              <Text style={globalStyles.categoryTitle}>{t("tonightAt", { city: location.name ?? "" })}</Text>
              <AltitudeChart points={altitudeData.points} riseDate={altitudeData.riseDate} setDate={altitudeData.setDate} variant="light" />
            </View>
          )}

          {mapConstellation && mapTarget && <SkyPreview constellation={mapConstellation} target={mapTarget} />}

          <InfoCard
            title={t("infoCard.title")}
            description={description ? description : t("infoCard.noDescription")}
            icon={InfoIcon}

          />


          {(object.discovery?.by || object.discovery?.year) && (
            <View style={objectDetailsScreenStyles.discoveryCard}>
              <View style={objectDetailsScreenStyles.discoveryCard.yearBadge}>
                <Text style={objectDetailsScreenStyles.discoveryCard.yearBadge.text}>{object.discovery.year ?? "?"}</Text>
              </View>
              <View style={objectDetailsScreenStyles.discoveryCard.texts}>
                <Text style={objectDetailsScreenStyles.discoveryCard.texts.title}>{t("discoveredBy")}</Text>
                <Text style={objectDetailsScreenStyles.discoveryCard.texts.subtitle}>{object.discovery.by ?? t("technical.unknown")}</Text>
              </View>
            </View>
          )}

          <View>
            <SectionHeader title={t("technicalSheet")} />
            <ListCard items={technicalItems}/>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ObjectDetailsScreen;
