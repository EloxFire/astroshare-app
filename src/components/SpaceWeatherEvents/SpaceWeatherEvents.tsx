import { Text, View } from "react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { TriangleAlert } from "lucide-react-native";
import { spaceWeatherEventsStyles } from "./SpaceWeatherEvents.styles";
import { useAppUnits, type FormatDate } from "../../hooks/useAppUnits";
import { app_colors } from "../../helpers/variables";
import type { SolarFlaresData } from "../../types/spaceWeather/SolarFlares";
import type { SpaceWeatherAlert, SpaceWeatherAlertsData } from "../../types/spaceWeather/SpaceWeatherAlerts";

interface SpaceWeatherEventsProps {
  alerts: SpaceWeatherAlertsData | null;
  flares: SolarFlaresData | null;
}

const MAX_EVENTS = 3; // liste compacte — "Tout voir" est pour la suite
// Seules les éruptions M/X sont assez notables pour apparaître dans ce flux condensé (C et en
// dessous sont trop fréquentes pour être individuellement "un évènement").
const SIGNIFICANT_FLARE_CATEGORIES = ["M", "X"];
const FLARE_BADGE_COLOR: Record<string, string> = {
  M: app_colors.yellow.main,
  X: app_colors.red.main,
};

interface FlareEvent {
  kind: "flare";
  time: Date;
  flareClass: string;
  category: string;
}

interface AlertEvent {
  kind: "alert";
  time: Date;
  type: string;
  summary: string;
}

type SpaceWeatherEvent = FlareEvent | AlertEvent;

// Les codes produit NOAA ("type") sont une mini-grammaire reconnaissable pour certains préfixes
// connus (ex: K05A = seuil Kp 5 atteint, K05W = seuil Kp 5 attendu) — on reconstruit une phrase FR
// lisible pour ceux-là. Pour tout code non reconnu, on retombe sur `summary` (texte NOAA brut, en
// anglais) plutôt que d'inventer une traduction incertaine.
const formatAlertTitle = (alert: Pick<SpaceWeatherAlert, "type" | "summary">, t: TFunction): string => {
  const kMatch = alert.type.match(/^K(\d{2})([AW])$/);
  if (kMatch) {
    const level = parseInt(kMatch[1], 10);
    return t(kMatch[2] === "A" ? "events.alert.kIndexReached" : "events.alert.kIndexExpected", { level });
  }

  const efMatch = alert.type.match(/^EF\d([AW])$/);
  if (efMatch) {
    return t(efMatch[1] === "A" ? "events.alert.electronFluxReached" : "events.alert.electronFluxExpected");
  }

  return alert.summary;
};

const formatEventTime = (time: Date, now: Date, formatDate: FormatDate, t: TFunction): string => {
  const dayDiff = formatDate(time).startOf("day").diff(formatDate(now).startOf("day"), "day");
  const hhmm = formatDate(time).format("HH:mm");
  if (dayDiff === 0) return t("events.timestamp.today", { time: hhmm });
  if (dayDiff === -1) return t("events.timestamp.yesterday", { time: hhmm });
  return t("events.timestamp.other", { date: formatDate(time).format("DD/MM"), time: hhmm });
};

// Fusionne /flares (l'éruption en cours, si assez significative) et /alerts (jusqu'à 20 alertes
// NOAA) en un seul flux chronologique — la maquette mélange les deux types de carte dans la même
// liste plutôt que deux sections séparées.
const SpaceWeatherEvents = ({ alerts, flares }: SpaceWeatherEventsProps) => {
  const { t } = useTranslation("tools/spaceWeather");
  const { formatDate } = useAppUnits();

  const events = useMemo(() => {
    const flareEvent: FlareEvent[] =
      flares?.current && SIGNIFICANT_FLARE_CATEGORIES.includes(flares.current.category)
        ? [{ kind: "flare", time: new Date(flares.current.time_tag), flareClass: flares.current.class, category: flares.current.category }]
        : [];

    const alertEvents: AlertEvent[] = (alerts?.data ?? []).map((alert) => ({
      kind: "alert",
      time: new Date(alert.issuedAt),
      type: alert.type,
      summary: alert.summary,
    }));

    return [...flareEvent, ...alertEvents]
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, MAX_EVENTS);
  }, [alerts, flares]);

  if (events.length === 0) {
    return <Text style={spaceWeatherEventsStyles.noEvents}>{t("events.noEvents")}</Text>;
  }

  const now = new Date();

  return (
    <View style={spaceWeatherEventsStyles.list}>
      {
        events.map((event: SpaceWeatherEvent, index) => (
          <View key={index} style={spaceWeatherEventsStyles.card}>
            {
              event.kind === "flare" ? (
                <View style={[spaceWeatherEventsStyles.card.badge, { backgroundColor: FLARE_BADGE_COLOR[event.category] ?? app_colors.yellow.main }]}>
                  <Text style={spaceWeatherEventsStyles.card.badge.text}>{event.flareClass}</Text>
                </View>
              ) : (
                <View style={[spaceWeatherEventsStyles.card.badge, spaceWeatherEventsStyles.card.badgeAlert]}>
                  <TriangleAlert size={16} color={app_colors.accent.main} />
                </View>
              )
            }

            <View style={spaceWeatherEventsStyles.card.content}>
              <Text style={spaceWeatherEventsStyles.card.content.title}>
                {event.kind === "flare" ? t("events.flare.significant") : formatAlertTitle(event, t)}
              </Text>
              <Text style={spaceWeatherEventsStyles.card.content.subtitle}>
                {
                  event.kind === "flare"
                    ? `${formatEventTime(event.time, now, formatDate, t)} · ${t(`events.flare.impact.${event.category}`)}`
                    : `${t("events.alert.source")} · ${formatEventTime(event.time, now, formatDate, t)} · ${t("events.alert.code", { type: event.type })}`
                }
              </Text>
            </View>
          </View>
        ))
      }
    </View>
  );
};

export default SpaceWeatherEvents;
