import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { ChevronDown, Cloud, Droplet, Droplets, Eye, Gauge as GaugeIcon, Moon, Sparkles, Waves, Wind, type LucideIcon } from "lucide-react-native";
import Animated, { FadeIn, FadeOut, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { getLunarPhase } from "@observerly/astrometry";
import { observabilityScoreCardStyles } from "./ObservabilityScoreCard.styles";
import CircularGauge from "../CircularGauge/CircularGauge";
import Badge from "../Badges/Badge/Badge";
import { globalStyles } from "../../helpers/globalStyles";
import { app_colors, getObservabilityScoreBand, getObservabilityScoreColor, withOpacity } from "../../helpers/variables";
import { formatWindSpeed } from "../../helpers/format";
import { computeMoonScore, findClosestAstroPoint, isMoonUp, type ObservabilityScore } from "../../helpers/weather/observabilityScore";
import { type ObservabilityNightReference } from "../../helpers/weather/nightConditions";
import { getLunarPhaseLabel } from "../../helpers/astrometry/moon/moonHelpers";
import { useAppUnits } from "../../hooks/useAppUnits";
import type { WeatherData } from "../../types/weather/Weather";
import type { AstroConditionsData } from "../../types/weather/AstroConditions";

interface ObservabilityScoreCardProps {
  weather: WeatherData | null;
  astro: AstroConditionsData | null;
  score: ObservabilityScore | null;
  nightReference: ObservabilityNightReference | null;
}

interface MetricRow {
  key: string;
  icon: LucideIcon;
  label: string;
  value: string;
  secondaryValue?: string; // valeur brute (ex: plage en arcsec du seeing), affichée sous la version "humanisée"
  barPercent: number | null; // 0-100, null = pas de donnée (pas de barre) — détermine la LONGUEUR de la barre
  goodnessPercent: number | null; // 0-100 (100 = idéal) — détermine la COULEUR de la tuile/barre (mêmes paliers que le cercle de score)
}

// Bornes utilisées uniquement pour l'échelle visuelle des barres (pas pour le score lui-même).
// Pour nuages/écart de rosée/vent/rafales, la longueur de barre suit la grandeur brute affichée :
// plus le nombre affiché est grand, plus la barre est longue, indépendamment de ce que ça signifie
// pour l'observation — la "bonté" (qui pilote la couleur) est calculée séparément ci-dessous.
// Seeing/transparence suivent directement la convention "bonté" (barre et couleur confondues),
// explicitement demandée : plus la condition est BONNE, plus la barre est remplie (même formule que
// computeSeeingTransparencyScore dans observabilityScore.ts, code 1 = meilleur = 100%).
const DEW_POINT_SPREAD_MAX = 15; // °C
const WIND_SPEED_MAX_KMH = 40; // vent moyen — plafond visuel plus bas que les rafales
const GUST_SPEED_MAX_KMH = 60;
const CONDITION_CODE_MAX = 8; // échelle seeing/transparency 7Timer

const toPercent = (value: number, max: number): number => Math.min(Math.max((value / max) * 100, 0), 100);

const toConditionGoodnessPercent = (code: number): number =>
  toPercent(CONDITION_CODE_MAX - code, CONDITION_CODE_MAX - 1);

// Carte "Observabilité" : anneau de score (0-100) en vedette + verdict, puis une grille de données
// clés affichées à titre indicatif — nuages, humidité, vent moyen et rafales (OpenWeather), écart de
// rosée (dérivé de temp/dew_point, indicateur de risque de buée sur l'optique), seeing et
// transparence (7Timer/astro). Ce sont les facteurs les plus parlants pour un débutant, pas
// nécessairement un miroir 1:1 des entrées exactes de computeObservabilityScore (ex: écart de rosée,
// vent moyen et rafales sont affichés ici à titre informatif, mais seuls le vent moyen et l'humidité
// entrent réellement dans le calcul du score — voir observabilityScore.ts).
const ObservabilityScoreCard = ({ weather, astro, score, nightReference }: ObservabilityScoreCardProps) => {
  const { t } = useTranslation("tools/weather");
  const { formatDate } = useAppUnits();

  // Détail replié par défaut (juste les icônes colorées + chevron) — l'utilisateur déplie au besoin.
  const [expanded, setExpanded] = useState(false);
  const chevronRotation = useSharedValue(0);
  const chevronStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${chevronRotation.value}deg` }] }));

  const toggleExpanded = () => {
    const next = !expanded;
    setExpanded(next);
    chevronRotation.value = withTiming(next ? 180 : 0, { duration: 220 });
  };

  const astroPoint = useMemo(
    () => (astro ? findClosestAstroPoint(astro.data, nightReference?.date ?? new Date()) : undefined),
    [astro, nightReference]
  );

  // Facteur lune (15% du score, voir observabilityScore.ts) : pas de tuile dédiée sur cet écran,
  // juste cette ligne sous le conseil — mêmes moonrise/moonset/date que ceux utilisés en interne par
  // computeMoonScore (via isMoonUp, exporté pour ça), pour qu'affichage et score ne divergent jamais.
  const moonInfo = useMemo(() => {
    const today = weather?.daily[0];
    if (!weather || !today) return null;

    const referenceDate = nightReference?.date ?? new Date();
    const isUp = isMoonUp(today.moonrise, today.moonset, Math.floor(referenceDate.getTime() / 1000));
    return {
      isUp,
      phaseLabel: isUp ? getLunarPhaseLabel(getLunarPhase(referenceDate)) : null,
      color: getObservabilityScoreColor(computeMoonScore(weather, referenceDate)),
    };
  }, [weather, nightReference]);

  const rows: MetricRow[] = useMemo(() => {
    const clouds = weather?.current.clouds;
    const humidity = weather?.current.humidity;
    const dewSpread = weather?.current ? weather.current.temp - weather.current.dew_point : undefined;
    const windSpeedKmh = weather?.current ? weather.current.wind_speed * 3.6 : undefined;
    const gustKmh = weather?.current.wind_gust != null ? weather.current.wind_gust * 3.6 : undefined;

    return [
      {
        key: "clouds",
        icon: Cloud,
        label: t("observability.clouds"),
        value: clouds != null ? `${Math.round(clouds)}%` : "--",
        // Plus de nuages = pire : bonté inversée par rapport à la grandeur brute affichée.
        barPercent: clouds != null ? toPercent(clouds, 100) : null,
        goodnessPercent: clouds != null ? 100 - toPercent(clouds, 100) : null,
      },
      {
        key: "seeing",
        icon: Eye,
        label: t("observability.seeing"),
        value: astroPoint?.seeing.label ?? "--",
        // Plage brute en arcsec (ex: "1-1.25\""), affichée en plus du libellé humanisé.
        secondaryValue: astroPoint?.seeing.range,
        barPercent: astroPoint ? toConditionGoodnessPercent(astroPoint.seeing.code) : null,
        goodnessPercent: astroPoint ? toConditionGoodnessPercent(astroPoint.seeing.code) : null,
      },
      {
        key: "transparency",
        icon: Sparkles,
        label: t("observability.transparency"),
        value: astroPoint?.transparency.label ?? "--",
        barPercent: astroPoint ? toConditionGoodnessPercent(astroPoint.transparency.code) : null,
        goodnessPercent: astroPoint ? toConditionGoodnessPercent(astroPoint.transparency.code) : null,
      },
      {
        key: "dewPointSpread",
        icon: Droplet,
        label: t("observability.dewPointSpread"),
        value: dewSpread != null ? `${Math.round(dewSpread)}°C` : "--",
        // Plus l'écart est grand, plus l'air est loin de la saturation (moins de risque de buée) :
        // bonté dans le même sens que la grandeur brute, pas d'inversion.
        barPercent: dewSpread != null ? toPercent(dewSpread, DEW_POINT_SPREAD_MAX) : null,
        goodnessPercent: dewSpread != null ? toPercent(dewSpread, DEW_POINT_SPREAD_MAX) : null,
      },
      {
        key: "humidity",
        icon: Droplets,
        label: t("observability.humidity"),
        value: humidity != null ? `${Math.round(humidity)}%` : "--",
        // Plus humide = pire (buée, transparence réduite) : bonté inversée.
        barPercent: humidity != null ? toPercent(humidity, 100) : null,
        goodnessPercent: humidity != null ? 100 - toPercent(humidity, 100) : null,
      },
      {
        key: "windSpeed",
        icon: GaugeIcon,
        label: t("observability.windSpeed"),
        value: weather?.current ? formatWindSpeed(weather.current.wind_speed) : "--",
        // Plus de vent = pire : bonté inversée.
        barPercent: windSpeedKmh != null ? toPercent(windSpeedKmh, WIND_SPEED_MAX_KMH) : null,
        goodnessPercent: windSpeedKmh != null ? 100 - toPercent(windSpeedKmh, WIND_SPEED_MAX_KMH) : null,
      },
      // {
      //   key: "gusts",
      //   icon: Wind,
      //   label: t("observability.gusts"),
      //   value: gustKmh != null ? formatWindSpeed(gustKmh / 3.6) : "--",
      //   // Plus de rafales = pire : bonté inversée par rapport à la grandeur brute affichée.
      //   barPercent: gustKmh != null ? toPercent(gustKmh, GUST_SPEED_MAX_KMH) : null,
      //   goodnessPercent: gustKmh != null ? 100 - toPercent(gustKmh, GUST_SPEED_MAX_KMH) : null,
      // },
    ];
  }, [weather, astroPoint, t]);

  const scoreBand = getObservabilityScoreBand(score?.total);
  const scoreColor = getObservabilityScoreColor(score?.total);

  return (
    <Animated.View style={globalStyles.defaultCard} layout={LinearTransition.duration(220)}>
      <View>
        <Text style={observabilityScoreCardStyles.title}>{t("astroConditions.title")}</Text>
        {
          nightReference && (
            <Text style={observabilityScoreCardStyles.subtitle}>
              {
                nightReference.isCurrentlyNight
                  ? t("astroConditions.referenceTime.inProgress")
                  : t("astroConditions.referenceTime.upcoming", { time: formatDate(nightReference.date).format("HH:mm") })
              }
            </Text>
          )
        }
      </View>

      <View style={observabilityScoreCardStyles.body}>
        <View style={observabilityScoreCardStyles.body.hero}>
          <CircularGauge value={score?.total ?? 0} size={120} strokeWidth={9} progressColor={scoreColor}>
            <Text style={observabilityScoreCardStyles.body.hero.gauge.main}>{score?.total ?? "--"}</Text>
            <Text style={observabilityScoreCardStyles.body.hero.gauge.secondary}>/100</Text>
          </CircularGauge>

          {
            scoreBand && (
              <View style={observabilityScoreCardStyles.body.hero.info}>
                <Badge
                  text={t(`astroConditions.verdict.${scoreBand}`)}
                  backgroundColor={withOpacity(scoreColor, 0.15)}
                  foregroundColor={scoreColor}
                />
                <Text style={observabilityScoreCardStyles.body.hero.info.advice}>{t(`astroConditions.advice.${scoreBand}`)}</Text>
                {
                  moonInfo && (
                    <View style={[observabilityScoreCardStyles.body.moonNote, { backgroundColor: withOpacity(moonInfo.color, 0.1), borderWidth: 1, borderColor: withOpacity(moonInfo.color, 0.2) }]}>
                      <View
                        style={[
                          observabilityScoreCardStyles.body.tileHeader.iconBadge,
                          { width: 18, height: 18, backgroundColor: withOpacity(moonInfo.color, 0.2) },
                        ]}
                      >
                        <Moon size={10} color={moonInfo.color} />
                      </View>
                      <Text style={observabilityScoreCardStyles.body.moonNote.text}>
                        {moonInfo.isUp ? t("astroConditions.moon.up", { phase: moonInfo.phaseLabel }) : t("astroConditions.moon.down")}
                      </Text>
                    </View>
                  )
                }
              </View>
            )
          }
        </View>

        <TouchableOpacity activeOpacity={0.7} onPress={toggleExpanded} style={observabilityScoreCardStyles.body.collapseToggle}>
          {
            !expanded ? (
              <Animated.View exiting={FadeOut.duration(120)} style={observabilityScoreCardStyles.body.collapseToggle.icons}>
                {
                  rows.map((row) => {
                    const color = getObservabilityScoreColor(row.goodnessPercent);
                    return (
                      <View
                        key={row.key}
                        style={[observabilityScoreCardStyles.body.tileHeader.iconBadge, { backgroundColor: withOpacity(color, 0.18) }]}
                      >
                        <row.icon size={18} color={color} />
                      </View>
                    );
                  })
                }
              </Animated.View>
            ) : (
              <Animated.Text exiting={FadeOut.duration(120)} style={observabilityScoreCardStyles.body.collapseToggle.title}>
                {t("astroConditions.metrics")}
              </Animated.Text>
            )
          }

          <Animated.View style={[chevronStyle, { marginLeft: "auto" }]}>
            <ChevronDown size={25} color={app_colors.primary.medium} />
          </Animated.View>
        </TouchableOpacity>

        {
          expanded && (
            <Animated.View
              entering={FadeIn.duration(180)}
              exiting={FadeOut.duration(140)}
              style={observabilityScoreCardStyles.body.metricsGrid}
            >
              {
                rows.map((row) => {
                  const color = getObservabilityScoreColor(row.goodnessPercent);

                  return (
                    <View
                      key={row.key}
                      style={[observabilityScoreCardStyles.body.tile, { backgroundColor: withOpacity(color, 0.06), borderColor: withOpacity(color, 0.18), borderWidth: 1 }]}
                    >
                      <View style={observabilityScoreCardStyles.body.tileValueRow}>
                        <Text style={observabilityScoreCardStyles.body.tileValue}>{row.value}</Text>
                        {
                          row.secondaryValue && (
                            <Text style={observabilityScoreCardStyles.body.tileValueRow.secondary}>{row.secondaryValue}</Text>
                          )
                        }
                      </View>

                      <View style={observabilityScoreCardStyles.body.tileHeader}>
                        <View
                          style={[
                            observabilityScoreCardStyles.body.tileHeader.iconBadge,
                            { backgroundColor: withOpacity(color, 0.18) },
                          ]}
                        >
                          <row.icon size={15} color={color} />
                        </View>
                        <Text style={observabilityScoreCardStyles.body.tileHeader.label}>{row.label}</Text>
                      </View>

                      {
                        row.barPercent !== null && (
                          <View style={observabilityScoreCardStyles.body.tileBarTrack}>
                            <View
                              style={[
                                observabilityScoreCardStyles.body.tileBarTrack.fill,
                                { width: `${row.barPercent}%`, backgroundColor: color },
                              ]}
                            />
                          </View>
                        )
                      }
                    </View>
                  );
                })
              }
            </Animated.View>
          )
        }
      </View>
    </Animated.View>
  );
};

export default ObservabilityScoreCard;
