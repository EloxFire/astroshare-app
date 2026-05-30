import { Text, View } from 'react-native'
import { SimulatorValues } from '../../helpers/scripts/simulator/computeSimulatorValues'
import { app_colors } from '../../helpers/constants'
import { i18n } from '../../helpers/scripts/i18n'

const t = (path: string) => i18n.t(`telescopeSimulator.home.sections.results.${path}`)
const tw = (path: string) => i18n.t(`telescopeSimulator.home.warnings.${path}`)

interface SimulatorResultCardsProps {
  values: SimulatorValues
}

const formatDeg = (deg: number): string => {
  if (deg >= 1) return `${deg.toFixed(2)}°`
  const arcmin = deg * 60
  if (arcmin >= 1) return `${arcmin.toFixed(1)}'`
  return `${(arcmin * 60).toFixed(0)}"`
}

const ResultItem = ({
  label,
  value,
  unit,
  warn,
}: {
  label: string
  value: string
  unit?: string
  warn?: boolean
}) => (
  <View style={styles.item}>
    <Text style={styles.label}>{label}</Text>
    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
      <Text style={[styles.value, warn && styles.valueWarn]}>{value}</Text>
      {unit && <Text style={styles.unit}>{unit}</Text>}
      {warn && <View style={styles.warnDot} />}
    </View>
  </View>
)

export const SimulatorResultCards = ({ values }: SimulatorResultCardsProps) => {
  const { magnification, tfovDeg, exitPupilMm, gMin, gMax } = values

  const exitPupilWarn = exitPupilMm < 0.5 || exitPupilMm > 7
  const magnificationWarn = magnification > gMax || magnification < gMin

  return (
    <View style={styles.strip}>
      <ResultItem
        label={t('magnification')}
        value={magnification.toFixed(0)}
        unit="×"
        warn={magnificationWarn}
      />
      <View style={styles.divider} />
      <ResultItem
        label={t('tfov')}
        value={formatDeg(tfovDeg)}
      />
      <View style={styles.divider} />
      <ResultItem
        label={t('exitPupil')}
        value={exitPupilMm.toFixed(1)}
        unit="mm"
        warn={exitPupilWarn}
      />
    </View>
  )
}

const styles = {
  strip: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: app_colors.white_no_opacity,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    borderRadius: 10,
    paddingVertical: 10,
  },
  item: {
    flex: 1,
    alignItems: 'center' as const,
    gap: 3,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: app_colors.white_twenty,
  },
  label: {
    color: app_colors.white,
    fontFamily: 'DMMonoRegular',
    fontSize: 8,
    opacity: 0.4,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  value: {
    color: app_colors.white,
    fontFamily: 'GilroyBlack',
    fontSize: 16,
  },
  valueWarn: {
    color: app_colors.orange,
  },
  unit: {
    color: app_colors.white,
    fontFamily: 'GilroyRegular',
    fontSize: 11,
    opacity: 0.5,
  },
  warnDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: app_colors.orange,
    marginLeft: 2,
    marginBottom: 4,
  },
}
