import { useTranslation } from "react-i18next"
import { Moon } from "lucide-react-native"
import { getLunarIllumination, getLunarPhase } from "@observerly/astrometry"
import { getLunarPhaseLabel } from "../../../../../../helpers/astrometry/moon/moonHelpers"
import InfoCard from "../../../../../../components/cards/InfoCard/InfoCard"

// Carte "Ce soir" : phase et illumination lunaires du jour, calculées en direct (même logique que
// TonightView). Propre à la Lune, d'où sa place dans l'adaptateur plutôt que dans ModelDetails.tsx.
const MoonTonightCard = ({ now }: { now: Date }) => {
  const { t } = useTranslation("tools/3dviewer")

  const illuminationPercent = Math.round(getLunarIllumination(now))
  const phaseLabel = getLunarPhaseLabel(getLunarPhase(now))

  return (
    <InfoCard
      icon={Moon}
      variant="light"
      title={t("today.value", { percent: illuminationPercent, phase: phaseLabel })}
      description={t("today.label")}
      internalLink="/tools/moon-calendar"
    />
  )
}

export default MoonTonightCard
