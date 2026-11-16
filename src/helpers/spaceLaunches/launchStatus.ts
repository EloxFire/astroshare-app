import { CheckCircle2, XCircle, type LucideIcon } from "lucide-react-native";
import { app_colors } from "../variables";

export type LaunchStatusColors = { background: string; text: string };

// Couleurs par abréviation de statut LL2 (status.abbrev). "Go"/"Success" en accent (positif),
// "Failure" en rouge, le reste (TBD, Hold, In Flight...) dans une teinte neutre d'attente.
const LAUNCH_STATUS_COLORS: Record<string, LaunchStatusColors> = {
  "Go": { background: app_colors.accent.main, text: app_colors.white },
  "Success": { background: app_colors.accent.main, text: app_colors.white },
  "Failure": { background: app_colors.red.main, text: app_colors.white },
  "Partial Failure": { background: app_colors.red.main, text: app_colors.white },
  "In Flight": { background: app_colors.accent.main, text: app_colors.white },
}

export const getLaunchStatusColors = (statusAbbrev: string): LaunchStatusColors =>
  LAUNCH_STATUS_COLORS[statusAbbrev] ?? { background: app_colors.yellow.light, text: app_colors.primary.main };

// Statuts définitifs : l'issue de la mission est connue, il n'y a plus rien à compter. Tout le
// reste ("Go", "Hold", "TBD", "In Flight"...) est encore en cours, avant ou après le décollage.
const TERMINAL_LAUNCH_STATUSES = ["Success", "Failure", "Partial Failure"];

export const isTerminalLaunchStatus = (statusAbbrev: string): boolean =>
  TERMINAL_LAUNCH_STATUSES.includes(statusAbbrev);

export type LaunchOutcomeVisual = { icon: LucideIcon; background: string; color: string };

// Icône + couleurs pour le bandeau de résultat final (NextLaunchCountdown, état terminal) : vert
// pour un succès, rouge pour un échec (total ou partiel).
const LAUNCH_OUTCOME_VISUALS: Record<string, LaunchOutcomeVisual> = {
  "Success": { icon: CheckCircle2, background: app_colors.green.light, color: app_colors.green.main },
  "Failure": { icon: XCircle, background: app_colors.red.light, color: app_colors.red.main },
  "Partial Failure": { icon: XCircle, background: app_colors.red.light, color: app_colors.red.main },
}

export const getLaunchOutcomeVisual = (statusAbbrev: string): LaunchOutcomeVisual =>
  LAUNCH_OUTCOME_VISUALS[statusAbbrev] ?? { icon: CheckCircle2, background: app_colors.accent.light, color: app_colors.primary.main };

// LL2 renvoie -1 (jamais null) quand la probabilité météo n'est pas encore calculée — à traiter
// comme une absence de donnée, pas comme "0% de chances".
export const getLaunchProbability = (probability?: number | null): number | null =>
  probability == null || probability < 0 ? null : probability;
