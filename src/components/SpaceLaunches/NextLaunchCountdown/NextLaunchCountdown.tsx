import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Rocket } from "lucide-react-native";
import { app_colors } from "../../../helpers/variables";
import { useAppUnits } from "../../../hooks/useAppUnits";
import { useCountdown } from "../../../hooks/useCountdown";
import { getLaunchOutcomeVisual, isTerminalLaunchStatus } from "../../../helpers/spaceLaunches/launchStatus";
import { Launch } from "../../../types/spaceLaunches/Launch";
import { nextLaunchCountdownStyles } from "./NextLaunchCountdown.styles";

// Fenêtre couverte par la frise (jours avant le décollage) : juste un repère visuel, pas une vraie
// mesure — au-delà, la frise reste simplement à 0%, le chiffre réel continue d'être exact dans le
// J-N et le compte HH:MM:SS au-dessus.
const TIMELINE_WINDOW_DAYS = 7;

interface NextLaunchCountdownProps {
  launch: Launch;
  // "card" (défaut) : carte blanche autonome, utilisée telle quelle sur la fiche détail.
  // "inline" : posé directement sur le hero sombre de NextLaunchCard, sans sa propre carte.
  variant?: "card" | "inline";
}

// Compteur seul (pas de nom/statut/image — voir NextLaunchCard pour la carte complète). Trois cas :
// - avant le décollage (net dans le futur) : J-N + compte à rebours HH:MM:SS, frise jusqu'au décollage.
// - après, tant que l'issue n'est pas connue ("Go", "Hold", "In Flight"...) : J+N + temps écoulé
//   depuis le décollage (vol en cours, durée indéterminée — orbital, interplanétaire...), sans frise.
// - issue connue (Success/Failure/Partial Failure) : plus rien à compter, juste le statut final.
const NextLaunchCountdown = ({ launch, variant = "card" }: NextLaunchCountdownProps) => {
  const { t } = useTranslation("tools/spaceLaunches");
  const { formatDate } = useAppUnits();
  const terminal = isTerminalLaunchStatus(launch.status.abbrev);
  const countdown = useCountdown(new Date(launch.net), terminal);
  const secondsPulse = useRef(new Animated.Value(1)).current;
  const isInline = variant === "inline";

  // Petit coup d'oeil "vivant" sur le chiffre des secondes à chaque tick, plutôt qu'un simple texte
  // statique qui se contente de changer de valeur.
  useEffect(() => {
    if (terminal) return;
    secondsPulse.setValue(1.2);
    Animated.timing(secondsPulse, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, [countdown.seconds, terminal]);

  // Au-delà de la fenêtre de la frise, on la laisse à 0% plutôt que de l'extrapoler sans fin.
  // Une fois l'issue connue, la frise reste affichée mais pleine (le décollage a bien eu lieu).
  const windowMs = TIMELINE_WINDOW_DAYS * 24 * 60 * 60 * 1000;
  const remainingMs = new Date(launch.net).getTime() - Date.now();
  const progress = terminal ? 1 : Math.min(Math.max(1 - remainingMs / windowMs, 0), 1);

  const outcome = terminal ? getLaunchOutcomeVisual(launch.status.abbrev) : null;
  const topLabel = terminal
    ? t("countdown.outcome")
    : t(countdown.isPast ? "countdown.elapsed" : "countdown.until");

  return (
    <View style={[nextLaunchCountdownStyles.container, isInline && nextLaunchCountdownStyles.inline.container]}>
      <View style={nextLaunchCountdownStyles.container.topRow}>
        <Text style={[nextLaunchCountdownStyles.container.topRow.label, isInline && nextLaunchCountdownStyles.inline.mutedText]}>
          {formatDate(launch.net).format("dddd D MMMM - HH:mm")}
        </Text>
      </View>

      <View style={nextLaunchCountdownStyles.container.readoutRow}>
        {outcome ? (
          <Text style={[nextLaunchCountdownStyles.container.readoutRow.time.outcomeLabel, { color: outcome.color }]}>
            {t(`status.${launch.status.abbrev}`, { defaultValue: launch.status.name })}
          </Text>
        ) : (
          <>
            <View style={nextLaunchCountdownStyles.container.readoutRow.dayChip}>
              <Text style={nextLaunchCountdownStyles.container.readoutRow.dayChip.text}>
                {t(countdown.isPast ? "countdown.daysAfter" : "countdown.daysBefore", { days: countdown.days })}
              </Text>
            </View>

            <View style={nextLaunchCountdownStyles.container.readoutRow.time}>
              <Text style={nextLaunchCountdownStyles.container.readoutRow.time.hours}>
                {String(countdown.hours).padStart(2, "0")}
              </Text>
              <Text
                style={[
                  nextLaunchCountdownStyles.container.readoutRow.time.rest,
                  isInline && nextLaunchCountdownStyles.inline.restText,
                ]}
              >
                :{String(countdown.minutes).padStart(2, "0")}:
              </Text>
              <Animated.Text
                style={[
                  nextLaunchCountdownStyles.container.readoutRow.time.rest,
                  isInline && nextLaunchCountdownStyles.inline.restText,
                  { transform: [{ scale: secondsPulse }] },
                ]}
              >
                {String(countdown.seconds).padStart(2, "0")}
              </Animated.Text>
            </View>
          </>
        )}
      </View>

      {(terminal || !countdown.isPast) && (
        <View style={nextLaunchCountdownStyles.container.timeline}>
          <View style={[nextLaunchCountdownStyles.container.timeline.track, isInline && nextLaunchCountdownStyles.inline.track]}>
            <View
              style={[
                nextLaunchCountdownStyles.container.timeline.track.fill,
                { width: `${progress * 100}%`, backgroundColor: outcome?.color ?? app_colors.accent.main },
              ]}
            />
            <View
              style={[
                nextLaunchCountdownStyles.container.timeline.track.marker,
                { left: `${progress * 100}%`, backgroundColor: outcome?.color ?? app_colors.accent.main },
              ]}
            >
              {outcome ? <outcome.icon size={13} color={app_colors.white} /> : <Rocket size={13} color={app_colors.white} />}
            </View>
          </View>
          <View style={nextLaunchCountdownStyles.container.timeline.labels}>
            <Text
              style={[nextLaunchCountdownStyles.container.timeline.labels.text, isInline && nextLaunchCountdownStyles.inline.mutedText]}
            >
              {t("countdown.daysBefore", { days: TIMELINE_WINDOW_DAYS })}
            </Text>
            <Text
              style={[nextLaunchCountdownStyles.container.timeline.labels.text, isInline && nextLaunchCountdownStyles.inline.mutedText]}
            >
              {t("countdown.liftoff")}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default NextLaunchCountdown;
