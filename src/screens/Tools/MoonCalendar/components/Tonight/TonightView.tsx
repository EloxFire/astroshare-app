import { ActivityIndicator, InteractionManager, Text, View } from "react-native";
import type { SuggestionCard as SuggestionCardType } from "../../../../../types/suggestions/suggestionCard";
import { Image } from "expo-image";
import { useEffect, useMemo, useState } from "react";
import { tonightViewStyles } from "./TonightView.styles";
import { useAppUnits, type FormatDate } from "../../../../../hooks/useAppUnits";
import { useTranslation } from "react-i18next";
import { globalStyles } from "../../../../../helpers/globalStyles";
import { getLunarPhaseLabel, getNextFirstMoonQuarter, getNextFullMoon, getNextLastMoonQuarter } from "../../../../../helpers/astrometry/moon/moonHelpers";
import { convertEquatorialToHorizontal, getBodyNextRise, getBodyNextSet, getLunarAge, getLunarAngularDiameter, getLunarDistance, getLunarEclipticCoordinate, getLunarEquatorialCoordinate, getLunarIllumination, getLunarPhase, getNextNewMoon, LUNAR_SYNODIC_MONTH } from "@observerly/astrometry";
import { getMoonIllustration } from "../../../../../helpers/api/moon/moonIllustration";
import { app_colors } from "../../../../../helpers/variables";
import ListCard from "../../../../../components/cards/ListCard/ListCard";
import ValueCard from "../../../../../components/cards/ValueCard/ValueCard";
import { formatDistanceInKm, formatTransit } from "../../../../../helpers/format";
import { useLocation } from "../../../../../context/GpsContext";
import { StatusBar } from "expo-status-bar";
import { Stars } from "lucide-react-native";
import { getRandomMoonCalendarSuggestion } from "../../../../../helpers/suggestions/moon/moonCalendarSuggestions";
import SuggestionCard from "../../../../../components/cards/SuggestionCard/SuggestionCard";
import { findPreviousHorizonCrossing, getAltitudeCurve } from "../../../../../helpers/astrometry/altitude/altitudeCurve";
import AltitudeChart from "../../../../../components/AltitudeChart/AltitudeChart";


const TonightView = () => {

  const { location, loading: loadingLocation } = useLocation();
  const user = useMemo(() => ({
    latitude: location?.latitude ?? 0,
    longitude: location?.longitude ?? 0,
    altitude: location?.elevation ?? 0,
  }), [location]);
  const { t, i18n } = useTranslation("moon");
  const { formatDate } = useAppUnits();
  const [computedMoon, setComputedMoon] = useState<any>(null);
  const [loadingAdditionalData, setLoadingAdditionalData] = useState<boolean>(true);
  const [illustrationUrl, setIllustrationUrl] = useState<string | null>(null);
  const [upcomingIllustrations, setUpcomingIllustrations] = useState<(string | null)[]>([]);
  const [displayedSuggestion, setDisplayedSuggestion] = useState<SuggestionCardType | null>(null);

  const today = useMemo(() => new Date(), []);

  // Les 4 prochaines phases principales, triées par date. nextNewMoon n'arrive qu'après le
  // calcul différé (InteractionManager, voir plus bas) — tant qu'il n'est pas prêt, la liste
  // reste vide et la carte affiche son état de chargement.
  const upcomingPhases = useMemo(() => {
    if (!computedMoon?.nextNewMoon) return [];
    return [
      { phase: "New", date: computedMoon.nextNewMoon },
      { phase: "First Quarter", date: computedMoon.nextFirstQuarter },
      { phase: "Full", date: computedMoon.nextFullMoon },
      { phase: "Last Quarter", date: computedMoon.nextLastQuarter },
    ].sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [computedMoon?.nextNewMoon, computedMoon?.nextFirstQuarter, computedMoon?.nextFullMoon, computedMoon?.nextLastQuarter]);

  // Tout le calcul (y compris ce qui était avant dans un useEffect séparé non différé) tourne
  // après la fin des interactions en cours (InteractionManager) : l'animation de transition de
  // navigation a donc le thread JS pour elle seule tant qu'elle n'est pas terminée, au lieu de le
  // partager avec ce bloc de calculs — c'est ce qui causait le "saut" de mise en page visible à
  // l'arrivée sur l'écran (le SafeAreaView du header se dessinait avant que la transition soit
  // stabilisée).
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      const now = new Date();
      const age = getLunarAge(now).age;
      const eqCoords = getLunarEquatorialCoordinate(now);
      const nextFullMoon = getNextFullMoon(now);
      // getNextNewMoon reste sur l'implémentation (plus lente) d'Observerly plutôt que notre
      // recherche rapide par bissection — voir moonHelpers.ts pour le pourquoi. Calculé une seule
      // fois ici (au lieu de 3x dans l'ancien code) : c'est l'appel le plus coûteux du bloc.
      const nextNewMoon = getNextNewMoon(now);
      const points = getAltitudeCurve(now, user, getLunarEquatorialCoordinate);
      const coords = convertEquatorialToHorizontal(now, user, eqCoords);
      const nextRise = getBodyNextRise(today, user, eqCoords);
      const nextSet = getBodyNextSet(today, user, eqCoords);

      // getBodyNextRise/getBodyNextSet ne renvoient jamais que le PROCHAIN évènement — correct pour
      // la ListCard ("Prochain lever/coucher"), mais pas pour le graphique de trajectoire : si la
      // Lune est déjà levée, son prochain lever est potentiellement demain, alors qu'on veut montrer
      // l'heure (déjà passée) à laquelle elle s'est levée aujourd'hui. On bascule donc sur l'évènement
      // déjà passé (recherché en arrière) côté opposé à celui qui est encore à venir.
      const currentlyAboveHorizon = coords.alt >= 0;
      const chartRiseDate = currentlyAboveHorizon
        ? findPreviousHorizonCrossing(now, user, getLunarEquatorialCoordinate, "rise")
        : (nextRise ? nextRise.datetime : undefined);
      const chartSetDate = currentlyAboveHorizon
        ? (nextSet ? nextSet.datetime : undefined)
        : findPreviousHorizonCrossing(now, user, getLunarEquatorialCoordinate, "set");

      setComputedMoon({
        altitudeCurve: points,
        chartRiseDate,
        chartSetDate,
        phase: getLunarPhaseLabel(getLunarPhase(now)),
        illumination: getLunarIllumination(now).toFixed(2),
        age,
        nextFullMoon,
        nextFirstQuarter: getNextFirstMoonQuarter(now),
        nextLastQuarter: getNextLastMoonQuarter(now),
        cycleProgress: age / LUNAR_SYNODIC_MONTH,
        distance: getLunarDistance(now).toFixed(0),
        diameter: getLunarAngularDiameter(now),
        eqCoords,
        coords,
        rise: nextRise,
        set: nextSet,
        isNewMoonNext: nextNewMoon < nextFullMoon,
        daysUntilNextPhase: Math.round(Math.min(
          (nextNewMoon.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
          (nextFullMoon.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )),
        nextNewMoon,
      });
      setLoadingAdditionalData(false);
    });

    return () => task.cancel(); // évite un setState après démontage si on quitte l'écran vite
  }, []);

  useEffect(() => {
    (async () => {
      const url = await getMoonIllustration(today);
      setIllustrationUrl(url);
    })();
  }, []);

  useEffect(() => {
    const suggestion = getRandomMoonCalendarSuggestion();
    setDisplayedSuggestion(suggestion);
  }, [])

  // Une illustration par phase à venir, une fois la liste triée disponible (voir upcomingPhases
  // ci-dessus — dépend de nextNewMoon, calculé après le montage).
  useEffect(() => {
    if (upcomingPhases.length === 0) return;
    (async () => {
      const urls = await Promise.all(upcomingPhases.map((event) => getMoonIllustration(event.date)));
      setUpcomingIllustrations(urls);
    })();
  }, [upcomingPhases]);

  useEffect(() => {
    StatusBar.setStyle("dark");
  }, [])

  return (
    <View style={[globalStyles.screen.content, { padding: 0 }]}>
      <View style={tonightViewStyles.currentPhaseContainer}>
        {
          illustrationUrl ? (
            <Image
              source={{ uri: illustrationUrl ?? undefined }}
              style={{ width: 150, height: 150, borderRadius: 75 }}
              cachePolicy="memory-disk"
            />
          ) : (
            <View style={{width: 150, height: 150, display: "flex", alignItems: "center", justifyContent: "center"}}>
              <ActivityIndicator color={app_colors.yellow.light}/>
            </View>
          )
        }
        
        <View style={tonightViewStyles.currentPhaseContainer.infos}>
          <Text style={tonightViewStyles.currentPhaseContainer.infos.subtitle}>{formatDate(today).format("dddd DD MMMM")}</Text>
          <Text style={tonightViewStyles.currentPhaseContainer.infos.phase}>{computedMoon?.phase}</Text>
          <Text style={[tonightViewStyles.currentPhaseContainer.infos.subtitle, { textTransform: "none" as const, marginTop: 10 }]}>
            {t(computedMoon?.isNewMoonNext ? "daysUntil.newMoon" : "daysUntil.fullMoon", { count: computedMoon?.daysUntilNextPhase })}
          </Text>
        </View>
      </View>

      <View style={tonightViewStyles.lunarCycleProgressContainer}>
        <Text style={tonightViewStyles.lunarCycleProgressContainer.age}>{t("dayProgress", { age: computedMoon?.age?.toFixed(1) ?? "--", total: LUNAR_SYNODIC_MONTH.toFixed(1) })}</Text>
        <View style={tonightViewStyles.lunarCycleProgressContainer.progressBar}>
          <View style={[tonightViewStyles.lunarCycleProgressContainer.progressBar.progress, { width: `${computedMoon?.cycleProgress * 100}%` }]} />
        </View>
      </View>

      <View style={tonightViewStyles.mainInfoBlocs}>
        <ValueCard title={t("stats.age")} value={computedMoon?.age != null ? `${computedMoon?.age.toFixed(1)} j` : "--"} />
        <ValueCard title={t("stats.illumination")} value={computedMoon?.illumination != null ? `${computedMoon?.illumination} %` : "--"} />
        <ValueCard title={t("stats.altitude")} value={computedMoon?.coords?.alt != null ? `${computedMoon?.coords?.alt.toFixed(2)} °` : "--"} />
      </View>

      <ListCard additionalContainerStyles={{marginTop: 20}} items={[
        { title: t("ephemeris.nextRise"), value: formatTransit(computedMoon?.rise, t, formatDate, today) ?? "--" },
        { title: t("ephemeris.nextSet"), value: formatTransit(computedMoon?.set, t, formatDate, today) ?? "--" },
        { title: t("ephemeris.distance"), value: computedMoon?.distance != null ? formatDistanceInKm(computedMoon?.distance, i18n.language) : "--" },
        { title: t("ephemeris.diameter"), value: computedMoon?.diameter != null ? `${computedMoon?.diameter.toFixed(2)}°` : "--" },
      ]} />

      <View style={tonightViewStyles.nextPhasesContainer}>
        <Text style={[globalStyles.categoryTitle, { fontSize: 12 }]}>{t("phasesOverview.title")}</Text>
        <View style={tonightViewStyles.mainPhasesContainer}>
          {
            upcomingPhases.map((event, index) => (
              <View key={event.phase} style={tonightViewStyles.mainPhasesContainer.card}>
                <Image
                  source={{ uri: upcomingIllustrations[index] ?? undefined }}
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

      {
        // TODO : Implémenter le système de ressources complet pour les suggestions.
        displayedSuggestion && (
          <SuggestionCard
            title={t(`moonCalendar.${displayedSuggestion.id}.title`, {ns: "suggestionsCards"})}
            description={t(`moonCalendar.${displayedSuggestion.id}.description`, {ns: "suggestionsCards"})}
            icon={Stars}
            link={displayedSuggestion.link}
          />
        )
      }

      {/* <Text>{JSON.stringify(computedMoon, null, 2)}</Text> */}

      {
        computedMoon?.altitudeCurve && (
          <View style={tonightViewStyles.altitudeCurveContainer}>
            <Text style={[globalStyles.categoryTitle, { fontSize: 12 }]}>{t("ephemeris.altitudeCurve")}</Text>
            <AltitudeChart
              points={computedMoon.altitudeCurve}
              riseDate={computedMoon.chartRiseDate}
              setDate={computedMoon.chartSetDate}
            />
          </View>
        )
      }
    </View>
  );
};

export default TonightView;
