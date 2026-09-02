import { Text, View } from "react-native";
import { Image } from "expo-image";
import { useQuery, useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { tonightViewStyles } from "./TonightView.styles";
import { useMoon } from "../../../../../hooks/useMoon";
import { useObservatory } from "../../../../../hooks/useObservatory";
import { useAppUnits, type FormatDate } from "../../../../../hooks/useAppUnits";
import { useUpcomingMoonPhases } from "../../../../../hooks/useUpcomingMoonPhases";
import { LUNAR_SYNODIC_MONTH, type Observer, type TransitInstance } from "../../../../../helpers/astrometry/moon";
import { convertAzimuthToCardinalDirection } from "../../../../../helpers/location/convert";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { getMoonIllustration } from "../../../../../helpers/api/moon";
import { globalStyles } from "../../../../../helpers/globalStyles";
import { convertEquatorialToHorizontal } from "@observerly/astrometry";
import { formatWithSpaces } from "../../../../../helpers/format";

// Affiche l'heure + le point cardinal d'un lever/coucher ; gère les cas
// particuliers (jamais de lever/coucher pour cet observateur) et l'attente
// de la position (observer pas encore résolu, requireObserver() interdit l'appel).
// `formatDate` est injectée (plutôt que d'importer dayjs directement) pour respecter
// le réglage UTC/heure locale de l'utilisateur — voir useAppUnits.
// `referenceDate` sert à détecter "hier"/"demain" : un lever/coucher peut tomber la
// veille ou le lendemain de `referenceDate` selon l'heure du jour.
const formatTransit = (transit: TransitInstance | boolean | undefined, t: TFunction, formatDate: FormatDate, referenceDate: Date): string => {
  if (transit === undefined) return t("transit.loading");
  if (transit === false) return t("transit.notApplicable");
  if (transit === true) return t("transit.neverSets");

  const time = formatDate(transit.datetime).format("HH:mm");
  const direction = convertAzimuthToCardinalDirection(transit.az);
  const dayDiff = formatDate(transit.datetime).startOf("day").diff(formatDate(referenceDate).startOf("day"), "day");

  if (dayDiff === -1) return t("transit.yesterday", { time, direction });
  if (dayDiff === 1) return t("transit.tomorrow", { time, direction });
  return t("transit.today", { time, direction });
};

const TonightView = () => {
  const { t } = useTranslation("moon");
  const { formatDate } = useAppUnits();

  const today = useMemo(() => new Date(), []);
  const { position } = useObservatory();

  const observer: Observer | undefined = useMemo(
    () => (position ? { ...position, datetime: today } : undefined),
    [position, today]
  );

  const moon = useMoon(today, observer);
  const { age } = moon.getLunarAge();
  const cycleProgress = Math.min(1, age / LUNAR_SYNODIC_MONTH);

  const nextRise = observer ? moon.getLunarNextRise() : undefined;
  const nextSet = observer ? moon.getLunarNextSet() : undefined;

  const currentMoonAltitude = observer ? convertEquatorialToHorizontal(today, observer, moon.getLunarEquatorialCoordinate()) : undefined;

  const isNewMoonNext = !formatDate(moon.getNextFullMoon()).isAfter(moon.getNextNewMoon());
  const daysUntilNextPhase = isNewMoonNext
    ? formatDate(moon.getNextNewMoon()).diff(today, "day")
    : formatDate(moon.getNextFullMoon()).diff(today, "day");

  // Les 4 prochaines phases principales (Nouvelle, Premier Quartier, Pleine, Dernier
  // Quartier), déjà triées par date — voir useUpcomingMoonPhases pour le calcul.
  const upcomingPhases = useUpcomingMoonPhases(today);

  // Illustration de la phase du jour (apparence actuelle de la Lune, pas forcément
  // une des 4 phases principales). staleTime: Infinity car l'illustration d'une date
  // donnée ne change jamais une fois publiée.
  const { data: currentIllustrationUrl } = useQuery({
    queryKey: ["moonIllustration", formatDate(today).format("YYYY-MM-DD")],
    queryFn: () => getMoonIllustration(formatDate(today).format("YYYY-MM-DD")),
    staleTime: Infinity,
  });

  // Une requête par phase à venir, en parallèle (même principe que ci-dessus, mais
  // pour un nombre de dates variable — useQueries est fait pour ça).
  const upcomingIllustrations = useQueries({
    queries: upcomingPhases.map((event) => {
      const dateKey = formatDate(event.date).format("YYYY-MM-DD");
      return {
        queryKey: ["moonIllustration", dateKey],
        queryFn: () => getMoonIllustration(dateKey),
        staleTime: Infinity,
      };
    }),
  });

  return (
    <View style={[globalStyles.screen.content, { padding: 0 }]}>
      <View style={tonightViewStyles.currentPhaseContainer}>
        <Image
          source={{ uri: currentIllustrationUrl ?? undefined }}
          style={{ width: 150, height: 150, borderRadius: 75 }}
          cachePolicy="memory-disk"
        />
        <View style={tonightViewStyles.currentPhaseContainer.infos}>
          <Text style={tonightViewStyles.currentPhaseContainer.infos.subtitle}>{formatDate(today).format("dddd DD MMMM")}</Text>
          <Text style={tonightViewStyles.currentPhaseContainer.infos.phase}>{moon.getLunarPhaseLabel()}</Text>
          <Text style={[tonightViewStyles.currentPhaseContainer.infos.subtitle, { textTransform: "none" as const, marginTop: 10 }]}>
            {t(isNewMoonNext ? "daysUntil.newMoon" : "daysUntil.fullMoon", { count: daysUntilNextPhase })}
          </Text>
        </View>
      </View>

      <View style={tonightViewStyles.lunarCycleProgressContainer}>
        <View style={tonightViewStyles.lunarCycleProgressContainer.progressBar}>
          <View style={[tonightViewStyles.lunarCycleProgressContainer.progressBar.progress, { width: `${cycleProgress * 100}%` }]} />
        </View>
        <Text style={tonightViewStyles.lunarCycleProgressContainer.age}>{t("dayProgress", { age: age.toFixed(1), total: LUNAR_SYNODIC_MONTH.toFixed(1) })}</Text>
      </View>

      <View style={tonightViewStyles.mainInfoBlocs}>
        <View style={tonightViewStyles.mainInfoBlocs.bloc}>
          <Text style={tonightViewStyles.mainInfoBlocs.bloc.title}>{t("stats.illumination")}</Text>
          <Text style={tonightViewStyles.mainInfoBlocs.bloc.value}>{(moon.getLunarIllumination()).toFixed(1)}%</Text>
        </View>

        <View style={tonightViewStyles.mainInfoBlocs.bloc}>
          <Text style={tonightViewStyles.mainInfoBlocs.bloc.title}>{t("stats.age")}</Text>
          <Text style={tonightViewStyles.mainInfoBlocs.bloc.value}>{t("stats.ageValue", { value: moon.getLunarAge().age.toFixed(0) })}</Text>
        </View>

        <View style={tonightViewStyles.mainInfoBlocs.bloc}>
          <Text style={tonightViewStyles.mainInfoBlocs.bloc.title}>{t("stats.diameter")}</Text>
          <Text style={tonightViewStyles.mainInfoBlocs.bloc.value}>{moon.getLunarAngularDiameter().toFixed(2)}°</Text>
        </View>
      </View>

      <View style={tonightViewStyles.ephemerisContainer}>
        <View style={[tonightViewStyles.ephemerisContainer.bloc, tonightViewStyles.ephemerisContainer.bloc.withBorder]}>
          <Text style={tonightViewStyles.ephemerisContainer.bloc.title}>{t("ephemeris.rise")}</Text>
          <Text style={tonightViewStyles.ephemerisContainer.bloc.value}>{formatTransit(nextRise, t, formatDate, today)}</Text>
        </View>

        <View style={[tonightViewStyles.ephemerisContainer.bloc, tonightViewStyles.ephemerisContainer.bloc.withBorder]}>
          <Text style={tonightViewStyles.ephemerisContainer.bloc.title}>{t("ephemeris.set")}</Text>
          <Text style={tonightViewStyles.ephemerisContainer.bloc.value}>{formatTransit(nextSet, t, formatDate, today)}</Text>
        </View>

        <View style={[tonightViewStyles.ephemerisContainer.bloc, tonightViewStyles.ephemerisContainer.bloc.withBorder]}>
          <Text style={tonightViewStyles.ephemerisContainer.bloc.title}>{t("ephemeris.distance")}</Text>
          <Text style={tonightViewStyles.ephemerisContainer.bloc.value}>{t("ephemeris.distanceValue", { value: formatWithSpaces(Math.round(moon.getLunarDistance() / 1000)) })}</Text>
        </View>

        <View style={tonightViewStyles.ephemerisContainer.bloc}>
          <Text style={tonightViewStyles.ephemerisContainer.bloc.title}>{t("ephemeris.altitude")}</Text>
          <Text style={tonightViewStyles.ephemerisContainer.bloc.value}>{t("ephemeris.altitudeValue", { value: currentMoonAltitude?.alt.toFixed(1) })}</Text>
        </View>
      </View>

      <View style={globalStyles.content.heroCard}>
        <Text style={[globalStyles.categoryTitle, { fontSize: 12 }]}>{t("phasesOverview.title")}</Text>
        <View style={tonightViewStyles.mainPhasesContainer}>
          {
            upcomingPhases.map((event, index) => (
              <View key={event.phase} style={tonightViewStyles.mainPhasesContainer.card}>
                <Image
                  source={{ uri: upcomingIllustrations[index].data ?? undefined }}
                  style={tonightViewStyles.mainPhasesContainer.card.image}
                  cachePolicy="memory-disk"
                />
                <Text style={tonightViewStyles.mainPhasesContainer.card.date}>
                  {formatDate(event.date).format("D MMM").toUpperCase()}
                </Text>
                <Text style={tonightViewStyles.mainPhasesContainer.card.label}>
                  {t(`phasesShort.${event.phase}`)}
                </Text>
              </View>
            ))
          }
        </View>
      </View>
    </View>
  );
};

export default TonightView;
