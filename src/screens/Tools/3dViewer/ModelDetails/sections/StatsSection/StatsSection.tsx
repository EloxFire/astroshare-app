import { View } from "react-native"
import { useTranslation } from "react-i18next"
import { ModelStat } from "../../../../../../helpers/tools/3dviewer"
import ValueCard from "../../../../../../components/cards/ValueCard/ValueCard"
import SectionHeader from "../../../../../../components/SectionHeader/SectionHeader"
import { statsSectionStyles } from "./StatsSection.styles"

interface StatsSectionProps {
  stats: ModelStat[];
  // Valeurs calculées en direct par id de stat, pour celles sans `value` statique — voir
  // ModelStat.value et modelAdapters/*.ts.
  liveStatValues: Record<string, number>;
}

// Décimales max et clé i18n (common:units) par unité — un Record plutôt qu'une chaîne de if :
// TypeScript impose d'y penser pour toute nouvelle valeur ajoutée à ModelStat["unit"].
const STAT_UNIT_DECIMALS: Record<ModelStat["unit"], number> = {
  km: 0,
  m: 0,
  kmh: 0,
  min: 0,
  days: 1,
  mps2: 2,
}
const STAT_UNIT_KEYS: Record<ModelStat["unit"], string> = {
  km: "units.kilometers",
  m: "units.meters",
  kmh: "units.kilometersPerHour",
  min: "units.minutes",
  days: "units.days",
  mps2: "units.gravity",
}

// Formate une valeur de statistique (nombre + unité) en texte localisé, en passant par les
// unités déjà centralisées dans common:units (séparateur de milliers compris).
function formatStatValue(value: number, unit: ModelStat["unit"], language: string, tCommon: ReturnType<typeof useTranslation>["t"]): string {
  const formattedNumber = new Intl.NumberFormat(language, { maximumFractionDigits: STAT_UNIT_DECIMALS[unit] }).format(value)
  return tCommon(STAT_UNIT_KEYS[unit], { value: formattedNumber })
}

const StatsSection = ({ stats, liveStatValues }: StatsSectionProps) => {
  const { t, i18n } = useTranslation("tools/3dviewer")
  const { t: tCommon } = useTranslation("common")

  return (
    <View>
      <SectionHeader title={t("sections.inNumbers")} />

      <View style={statsSectionStyles.grid}>
        {stats.map((stat) => {
          const value = stat.value ?? liveStatValues[stat.id]
          if (value === undefined) return null

          const label = stat.comparisonKey
            ? `${t(stat.labelKey)} · ${t(stat.comparisonKey)}`
            : t(stat.labelKey)

          return (
            <ValueCard
              key={stat.id}
              title={label}
              value={formatStatValue(value, stat.unit, i18n.language, tCommon)}
              containerStyle={statsSectionStyles.tileSize}
            />
          )
        })}
      </View>
    </View>
  )
}

export default StatsSection
