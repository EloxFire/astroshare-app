import { Text, TouchableOpacity, View } from 'react-native'
import { Telescope } from '../../helpers/types/gear/Telescope'
import { Eyepiece } from '../../helpers/types/gear/Eyepiece'
import { Camera } from '../../helpers/types/gear/Camera'
import { app_colors } from '../../helpers/constants'
import { i18n } from '../../helpers/scripts/i18n'

const t = (path: string) => i18n.t(`telescopeSimulator.home.sections.gear.${path}`)

const BARLOW_OPTIONS = [1, 2, 3] as const
export type BarlowFactor = (typeof BARLOW_OPTIONS)[number]
export type InstrumentMode = 'eyepiece' | 'camera'

interface GearSelectorProps {
  telescopes: Telescope[]
  eyepieces: Eyepiece[]
  cameras: Camera[]
  selectedTelescope: Telescope | null
  selectedEyepiece: Eyepiece | null
  selectedCamera: Camera | null
  instrumentMode: InstrumentMode
  barlowFactor: BarlowFactor
  onSelectTelescope: (t: Telescope) => void
  onSelectEyepiece: (e: Eyepiece) => void
  onSelectCamera: (c: Camera) => void
  onSelectBarlow: (b: BarlowFactor) => void
  onInstrumentModeChange: (mode: InstrumentMode) => void
  onGoToGear: () => void
}

const RadioDot = ({ selected }: { selected: boolean }) => (
  <View style={[styles.radio, selected && styles.radioSelected]}>
    {selected && <View style={styles.radioDot} />}
  </View>
)

const GearRow = ({
  label,
  sub,
  selected,
  onPress,
}: {
  label: string
  sub: string
  selected: boolean
  onPress: () => void
}) => (
  <TouchableOpacity onPress={onPress} style={[styles.row, selected && styles.rowSelected]}>
    <View style={{ flex: 1 }}>
      <Text style={[styles.rowLabel, selected && styles.rowLabelSelected]}>{label}</Text>
      <Text style={styles.rowSub}>{sub}</Text>
    </View>
    <RadioDot selected={selected} />
  </TouchableOpacity>
)

export const GearSelector = ({
  telescopes,
  eyepieces,
  cameras,
  selectedTelescope,
  selectedEyepiece,
  selectedCamera,
  instrumentMode,
  barlowFactor,
  onSelectTelescope,
  onSelectEyepiece,
  onSelectCamera,
  onSelectBarlow,
  onInstrumentModeChange,
  onGoToGear,
}: GearSelectorProps) => {
  return (
    <View style={{ gap: 16 }}>

      {/* Telescopes */}
      <View style={{ gap: 6 }}>
        <Text style={styles.sectionLabel}>{t('telescope')}</Text>
        {telescopes.length === 0 ? (
          <TouchableOpacity onPress={onGoToGear}>
            <Text style={styles.emptyText}>{t('noTelescope')} — {t('goToGear')}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.list}>
            {telescopes.map((scope) => (
              <GearRow
                key={scope.id}
                label={scope.name}
                sub={`${scope.focalLength}mm · f/${(scope.focalLength / scope.diameter).toFixed(1)} · Ø${scope.diameter}mm`}
                selected={selectedTelescope?.id === scope.id}
                onPress={() => onSelectTelescope(scope)}
              />
            ))}
          </View>
        )}
      </View>

      {/* Mode toggle: Oculaire / Caméra */}
      <View style={{ gap: 6 }}>
        <Text style={styles.sectionLabel}>Instrument</Text>
        <View style={styles.modeToggle}>
          {(['eyepiece', 'camera'] as InstrumentMode[]).map((mode) => {
            const isActive = instrumentMode === mode
            const label = mode === 'eyepiece' ? t('eyepiece') : 'Caméra'
            return (
              <TouchableOpacity
                key={mode}
                style={[styles.modeBtn, isActive && styles.modeBtnActive]}
                onPress={() => onInstrumentModeChange(mode)}
              >
                <Text style={[styles.modeBtnText, isActive && styles.modeBtnTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      {/* Eyepiece list */}
      {instrumentMode === 'eyepiece' && (
        <View style={{ gap: 6 }}>
          <Text style={styles.sectionLabel}>{t('eyepiece')}</Text>
          {eyepieces.length === 0 ? (
            <TouchableOpacity onPress={onGoToGear}>
              <Text style={styles.emptyText}>{t('noEyepiece')} — {t('goToGear')}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.list}>
              {eyepieces.map((ep) => (
                <GearRow
                  key={ep.id}
                  label={ep.name}
                  sub={`${ep.focalLength}mm · ${ep.apparentFieldOfView}° AFOV`}
                  selected={selectedEyepiece?.id === ep.id}
                  onPress={() => onSelectEyepiece(ep)}
                />
              ))}
            </View>
          )}
        </View>
      )}

      {/* Camera list */}
      {instrumentMode === 'camera' && (
        <View style={{ gap: 6 }}>
          <Text style={styles.sectionLabel}>Caméra</Text>
          {cameras.length === 0 ? (
            <TouchableOpacity onPress={onGoToGear}>
              <Text style={styles.emptyText}>Aucune caméra enregistrée — {t('goToGear')}</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.list}>
              {cameras.map((cam) => (
                <GearRow
                  key={cam.id}
                  label={cam.name}
                  sub={`${cam.sensorSize.width}×${cam.sensorSize.height}mm · ${cam.pixelSize}µm/px`}
                  selected={selectedCamera?.id === cam.id}
                  onPress={() => onSelectCamera(cam)}
                />
              ))}
            </View>
          )}
        </View>
      )}

      {/* Barlow — available in both modes */}
      <View style={{ gap: 6 }}>
        <Text style={styles.sectionLabel}>{t('barlow')}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {BARLOW_OPTIONS.map((factor) => (
            <TouchableOpacity
              key={factor}
              onPress={() => onSelectBarlow(factor)}
              style={[styles.chip, barlowFactor === factor && styles.chipSelected]}
            >
              <Text style={[styles.chipText, barlowFactor === factor && styles.chipTextSelected]}>
                ×{factor}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

    </View>
  )
}

const styles = {
  sectionLabel: {
    color: app_colors.white,
    fontFamily: 'DMMonoRegular',
    fontSize: 10,
    opacity: 0.4,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  emptyText: {
    color: app_colors.white,
    fontFamily: 'GilroyRegular',
    fontSize: 13,
    opacity: 0.35,
  },
  list: {
    borderRadius: 10,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: app_colors.white_no_opacity,
  },
  rowSelected: {
    backgroundColor: app_colors.white_no_opacity,
  },
  rowLabel: {
    color: app_colors.white,
    fontFamily: 'GilroyBold',
    fontSize: 14,
    opacity: 0.55,
  },
  rowLabelSelected: {
    opacity: 1,
  },
  rowSub: {
    color: app_colors.white,
    fontFamily: 'DMMonoRegular',
    fontSize: 10,
    opacity: 0.35,
    marginTop: 1,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: app_colors.white_forty,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  radioSelected: {
    borderColor: app_colors.white,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: app_colors.white,
  },
  modeToggle: {
    flexDirection: 'row' as const,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    borderRadius: 10,
    overflow: 'hidden' as const,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center' as const,
  },
  modeBtnActive: {
    backgroundColor: app_colors.white_no_opacity,
  },
  modeBtnText: {
    color: app_colors.white,
    fontFamily: 'GilroyBold',
    fontSize: 13,
    opacity: 0.4,
  },
  modeBtnTextActive: {
    opacity: 1,
  },
  chip: {
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 7,
  },
  chipSelected: {
    borderColor: app_colors.white_sixty,
    backgroundColor: app_colors.white_no_opacity,
  },
  chipText: {
    color: app_colors.white,
    fontFamily: 'GilroyBold',
    fontSize: 13,
    opacity: 0.45,
  },
  chipTextSelected: {
    opacity: 1,
  },
}
