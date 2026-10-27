import { useEffect, useMemo, useState } from "react";
import { InteractionManager, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Moon, MoonStar, Sun, type LucideIcon } from "lucide-react-native";
import { getLunarEquatorialCoordinate, getSolarEquatorialCoordinate, type EquatorialCoordinate } from "@observerly/astrometry";
import { usefulNightCardStyles } from "./UsefulNightCard.styles";
import Badge from "../Badges/Badge/Badge";
import { globalStyles } from "../../helpers/globalStyles";
import { app_colors, withOpacity } from "../../helpers/variables";
import { useAppUnits } from "../../hooks/useAppUnits";
import { useLocation } from "../../context/LocationContext";
import { getAstronomicalNightWindow, getVisibilityWindow, type AstronomicalNightWindow } from "../../helpers/astrometry/night/nightWindow";
import { findNextHorizonCrossing, findPreviousHorizonCrossing } from "../../helpers/astrometry/altitude/altitudeCurve";
import { getVisibilitySegments, type VisibilitySegment } from "../../helpers/astrometry/night/visibilitySegments";

const ASTRONOMICAL_NIGHT_THRESHOLD = -18;
const AXIS_LABELS_HOURS = [0, 6, 12, 18, 24];
const REFRESH_INTERVAL_MS = 60 * 1000; // le repère "maintenant" doit avancer sur la piste minute par minute

// Corps additionnel à tracer sur la piste, de la même façon que le Soleil/la Lune (ex: une planète)
// — fourni par l'écran appelant, qui sait quelle fonction de position utiliser. Exemple pour Mars :
// `{ key: "mars", icon: Sparkles, color: "#C1440E", getEquatorialCoordinate: (at) =>
// convertEclipticToEquatorial(at, getPlanetaryGeocentricEclipticCoordinate(at, mars)) }`
// (convertEclipticToEquatorial et mars viennent de @observerly/astrometry).
export interface UsefulNightCardBody {
  key: string;
  icon: LucideIcon;
  color: string;
  getEquatorialCoordinate: (at: Date) => EquatorialCoordinate;
  thresholdAltitude?: number; // défaut 0° (au-dessus de l'horizon)
}

interface UsefulNightCardProps {
  planets?: UsefulNightCardBody[];
}

interface TrackRow {
  key: string;
  icon: LucideIcon;
  color: string;
  segments: VisibilitySegment[];
}

interface UsefulNightData {
  night: AstronomicalNightWindow | null; // null si pas de nuit astronomique ce jour (été/haute latitude) — n'empêche pas d'afficher les pistes
  now: Date;
  dayStart: Date;
  dayEnd: Date;
  rows: TrackRow[];
  sun: { start: Date; end: Date } | null; // coucher avant la nuit -> lever après
  moon: { start: Date; end: Date } | null;
}

// Carte "nuit utile" autonome : calcule elle-même sa position (useLocation) et son astronomie
// (@observerly/astrometry), sans dépendre de données fournies par l'écran parent — pensée pour être
// posée telle quelle sur n'importe quel écran. Affiche la PROCHAINE nuit astronomique s'il fait
// jour, ou la nuit EN COURS s'il fait déjà nuit (voir getAstronomicalNightWindow) dans les gros
// chiffres d'en-tête, et une piste 00h-24h en dessous avec une ligne par corps (nuit noire, Soleil,
// Lune, + d'éventuelles planètes via `planets`) montrant quand chacun est au-dessus de l'horizon.
const UsefulNightCard = ({ planets = [] }: UsefulNightCardProps) => {
  const { t } = useTranslation("common");
  const { formatDate } = useAppUnits();
  const { location } = useLocation();

  const [data, setData] = useState<UsefulNightData | null>(null);
  const [computed, setComputed] = useState(false);

  useEffect(() => {
    const compute = () => {
      const observer = {
        latitude: location?.latitude ?? 0,
        longitude: location?.longitude ?? 0,
        altitude: location?.elevation ?? 0,
      };
      const now = new Date();
      // Jour civil (00h-24h) selon le réglage d'heure de l'utilisateur (UTC/fuseau choisi/appareil,
      // voir useAppUnits) — `.add(1, "day")` plutôt qu'un `+ 24h` en millisecondes, pour rester
      // correct un jour de changement d'heure (23h ou 25h réelles, pas 24h).
      const dayStart = formatDate(now).startOf("day").toDate();
      const dayEnd = formatDate(now).startOf("day").add(1, "day").toDate();

      const night = getAstronomicalNightWindow(now, observer);

      const sunset = night ? findPreviousHorizonCrossing(night.start, observer, getSolarEquatorialCoordinate, "set", 0) : undefined;
      const sunrise = night ? findNextHorizonCrossing(night.end, observer, getSolarEquatorialCoordinate, "rise", 0) : undefined;
      const sun = sunset && sunrise ? { start: sunset, end: sunrise } : null;

      // Lune : fenêtre de visibilité évaluée au DÉBUT de la nuit (pas "maintenant"), pour rester
      // cohérent avec "la nuit en question" plutôt qu'avec l'instant présent. Repli sur `now` si pas
      // de nuit astronomique ce jour.
      const moonWindow = getVisibilityWindow(night?.start ?? now, observer, getLunarEquatorialCoordinate, 0);
      const moon = moonWindow ? { start: moonWindow.start, end: moonWindow.end } : null;

      const bodies: UsefulNightCardBody[] = [
        { key: "night", icon: MoonStar, color: app_colors.primary.main, getEquatorialCoordinate: getSolarEquatorialCoordinate, thresholdAltitude: ASTRONOMICAL_NIGHT_THRESHOLD },
        { key: "sun", icon: Sun, color: app_colors.yellow.main, getEquatorialCoordinate: getSolarEquatorialCoordinate },
        { key: "moon", icon: Moon, color: app_colors.accent.main, getEquatorialCoordinate: getLunarEquatorialCoordinate },
        ...planets,
      ];

      const rows: TrackRow[] = bodies.map((body) => ({
        key: body.key,
        icon: body.icon,
        color: body.color,
        segments: getVisibilitySegments(
          dayStart,
          dayEnd,
          observer,
          body.getEquatorialCoordinate,
          body.key === "night"
            ? (altitude) => altitude < ASTRONOMICAL_NIGHT_THRESHOLD
            : (altitude) => altitude >= (body.thresholdAltitude ?? 0)
        ),
      }));

      setData({ night, now, dayStart, dayEnd, rows, sun, moon });
      setComputed(true);
    };

    // Premier calcul différé après les interactions/transitions en cours (coûteux : plusieurs
    // dizaines d'échantillons d'altitude par corps) ; les recalculs minute par minute qui suivent
    // n'ont pas cette contrainte (pas de transition d'écran en cours), un appel direct suffit.
    const task = InteractionManager.runAfterInteractions(compute);
    const interval = setInterval(compute, REFRESH_INTERVAL_MS);

    return () => {
      task.cancel();
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `planets` est un tableau recréé à
    // chaque render côté appelant (valeur par défaut `[]`, ou littéral inline) ; dépendre de sa
    // référence relancerait l'effet en boucle. On dépend de ses clés à la place (stable tant que la
    // liste de corps affichés ne change pas réellement), et `formatDate` pour la même raison que
    // dans AltitudeChart.tsx (nouvelle closure à chaque render, non mémoïsée par useAppUnits).
  }, [location, planets.map((planet) => planet.key).join(",")]);

  const nowPercent = useMemo(() => {
    if (!data) return null;
    const totalMs = data.dayEnd.getTime() - data.dayStart.getTime();
    return Math.min(Math.max(((data.now.getTime() - data.dayStart.getTime()) / totalMs) * 100, 0), 100);
  }, [data]);

  const durationLabel = useMemo(() => {
    if (!data?.night) return null;
    const totalMinutes = Math.round((data.night.end.getTime() - data.night.start.getTime()) / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return t("usefulNightCard.duration", { hours, minutes: minutes.toString().padStart(2, "0") });
  }, [data, t]);

  return (
    <View style={globalStyles.defaultCard}>
      <Text style={usefulNightCardStyles.title}>
        {t(data?.night?.isCurrentlyNight ? "usefulNightCard.title.inProgress" : "usefulNightCard.title.upcoming")}
      </Text>

      {
        !computed ? null : (
          <>
            {
              data?.night ? (
                <View style={usefulNightCardStyles.header}>
                  <Text style={usefulNightCardStyles.header.duration}>{durationLabel}</Text>
                  <Text style={usefulNightCardStyles.header.range}>
                    {formatDate(data.night.start).format("HH:mm")} → {formatDate(data.night.end).format("HH:mm")}
                  </Text>
                </View>
              ) : (
                <Text style={usefulNightCardStyles.unavailable}>{t("usefulNightCard.unavailable")}</Text>
              )
            }

            {
              data && (
                <>
                  <View style={usefulNightCardStyles.tracks}>
                    <View style={usefulNightCardStyles.tracks.rows}>
                      {
                        data.rows.map((row) => (
                          <View key={row.key} style={usefulNightCardStyles.tracks.row}>
                            <View style={[usefulNightCardStyles.tracks.row.icon, { backgroundColor: withOpacity(row.color, 0.18) }]}>
                              <row.icon size={10} color={row.color} />
                            </View>

                            <View style={usefulNightCardStyles.tracks.row.track}>
                              {
                                row.segments.map((segment, index) => (
                                  <View
                                    key={index}
                                    style={[
                                      usefulNightCardStyles.tracks.row.track.segment,
                                      { left: `${segment.startPercent}%`, width: `${segment.endPercent - segment.startPercent}%`, backgroundColor: row.color },
                                    ]}
                                  />
                                ))
                              }
                            </View>
                          </View>
                        ))
                      }
                    </View>

                    {
                      nowPercent !== null && (
                        <View style={usefulNightCardStyles.tracks.overlay} pointerEvents="none">
                          <View style={[usefulNightCardStyles.tracks.overlay.now, { left: `${nowPercent}%` }]}>
                            <Text style={usefulNightCardStyles.tracks.overlay.now.label}>{formatDate(data.now).format("HH:mm")}</Text>
                            <View style={usefulNightCardStyles.tracks.overlay.now.marker} />
                          </View>
                        </View>
                      )
                    }
                  </View>

                  <View style={usefulNightCardStyles.axis}>
                    {
                      AXIS_LABELS_HOURS.map((hour) => (
                        <Text key={hour} style={usefulNightCardStyles.axis.label}>{hour.toString().padStart(2, "0")}H</Text>
                      ))
                    }
                  </View>
                </>
              )
            }

            {
              (data?.sun || data?.moon) && (
                <View style={usefulNightCardStyles.pills}>
                  {
                    data.sun && (
                      <View style={usefulNightCardStyles.pills.pill}>
                        <Badge
                          text={`${formatDate(data.sun.start).format("HH:mm")} → ${formatDate(data.sun.end).format("HH:mm")}`}
                          icon={Sun}
                          backgroundColor={app_colors.yellow.light}
                          foregroundColor={app_colors.primary.main}
                        />
                      </View>
                    )
                  }
                  {
                    data.moon && (
                      <View style={usefulNightCardStyles.pills.pill}>
                        <Badge
                          text={`${formatDate(data.moon.start).format("HH:mm")} → ${formatDate(data.moon.end).format("HH:mm")}`}
                          icon={Moon}
                          backgroundColor={app_colors.accent.light}
                          foregroundColor={app_colors.accent.main}
                        />
                      </View>
                    )
                  }
                </View>
              )
            }
          </>
        )
      }
    </View>
  );
};

export default UsefulNightCard;
