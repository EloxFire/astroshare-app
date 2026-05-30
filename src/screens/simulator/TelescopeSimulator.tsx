import { useEffect, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { globalStyles } from '../../styles/global'
import PageTitle from '../../components/commons/PageTitle'
import { i18n } from '../../helpers/scripts/i18n'
import { useAuth } from '../../contexts/AuthContext'
import { useSettings } from '../../contexts/AppSettingsContext'
import { useAstroGear } from '../../contexts/GearContext'
import { useSolarSystem } from '../../contexts/SolarSystemContext'
import { useDsoCatalog } from '../../contexts/DSOContext'
import { routes } from '../../helpers/routes'
import { app_colors } from '../../helpers/constants'
import { getTelescopes } from '../../helpers/scripts/gear/telescopes'
import { getEyepieces } from '../../helpers/scripts/gear/eyepieces'
import { Telescope } from '../../helpers/types/gear/Telescope'
import { Eyepiece } from '../../helpers/types/gear/Eyepiece'
import { DSO } from '../../helpers/types/DSO'
import { GlobalPlanet } from '../../helpers/types/GlobalPlanet'
import { SpecialSkyObject } from '../../helpers/types/SpecialSkyObject'
import { computeSimulatorValues } from '../../helpers/scripts/simulator/computeSimulatorValues'
import {
  getDSOTarget,
  getPlanetTarget,
  getSpecialObjectTarget,
  SimulatorTarget,
} from '../../helpers/scripts/simulator/getObjectForSimulator'
import { GearSelector, BarlowFactor } from '../../components/simulator/GearSelector'
import { ObjectPickerModal } from '../../components/simulator/ObjectPickerModal'
import { SimulatorResultCards } from '../../components/simulator/SimulatorResultCards'
import { FieldRenderer } from '../../components/simulator/FieldRenderer'

const t = (path: string) => i18n.t(`telescopeSimulator.home.${path}`)

export const TelescopeSimulator = ({ navigation }: any) => {

  const { currentUser } = useAuth()
  const { currentUserLocation } = useSettings()
  const { currentGear } = useAstroGear()
  const { planets, moonCoords } = useSolarSystem()
  const { dsoCatalog, dsoCatalogLoading } = useDsoCatalog()
  const isFocused = useIsFocused()

  // Gear lists
  const [telescopes, setTelescopes] = useState<Telescope[]>([])
  const [eyepieces, setEyepieces] = useState<Eyepiece[]>([])

  // Current selection
  const [selectedTelescope, setSelectedTelescope] = useState<Telescope | null>(null)
  const [selectedEyepiece, setSelectedEyepiece] = useState<Eyepiece | null>(null)
  const [barlowFactor, setBarlowFactor] = useState<BarlowFactor>(1)

  // Target object
  const [target, setTarget] = useState<SimulatorTarget | null>(null)
  const [pickerVisible, setPickerVisible] = useState(false)

  // Load gear from storage on focus
  useEffect(() => {
    if (!isFocused || !currentUser?.uid) return
    ;(async () => {
      const loadedScopes = await getTelescopes(currentUser.uid)
      const loadedEyepieces = await getEyepieces(currentUser.uid)
      setTelescopes(loadedScopes)
      setEyepieces(loadedEyepieces)

      // Pre-select active gear from context
      if (currentGear?.telescope) {
        const active = loadedScopes.find((s) => s.id === currentGear.telescope)
        if (active) setSelectedTelescope(active)
      } else if (loadedScopes.length > 0) {
        setSelectedTelescope(loadedScopes[0])
      }

      if (currentGear?.eyepiece) {
        const active = loadedEyepieces.find((e) => e.id === currentGear.eyepiece)
        if (active) setSelectedEyepiece(active)
      } else if (loadedEyepieces.length > 0) {
        setSelectedEyepiece(loadedEyepieces[0])
      }
    })()
  }, [isFocused, currentUser?.uid])

  // Computed values (only when both telescope and eyepiece are selected)
  const simulatorValues =
    selectedTelescope && selectedEyepiece
      ? computeSimulatorValues(
          selectedTelescope.focalLength,
          selectedTelescope.diameter,
          selectedEyepiece.focalLength,
          selectedEyepiece.apparentFieldOfView,
          barlowFactor,
        )
      : null

  // Build SimulatorTarget when user picks from modal
  const handleSelectDSO = (dso: DSO) => setTarget(getDSOTarget(dso))

  const handleSelectPlanet = (planet: GlobalPlanet | SpecialSkyObject) => {
    if ('family' in planet) {
      setTarget(
        getSpecialObjectTarget(planet, currentUserLocation, moonCoords?.currentIconUrl),
      )
    } else {
      setTarget(getPlanetTarget(planet as GlobalPlanet, currentUserLocation))
    }
  }

  const hasGear = selectedTelescope !== null && selectedEyepiece !== null

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={t('title')}
        subtitle={t('subtitle')}
      />
      <View style={globalStyles.screens.separator} />

      <ScrollView
        contentContainerStyle={{ gap: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Gear section ─────────────────────────────────────────────────────── */}
        <View style={sectionCard}>
          <Text style={sectionTitle}>{t('sections.gear.title')}</Text>
          <GearSelector
            telescopes={telescopes}
            eyepieces={eyepieces}
            selectedTelescope={selectedTelescope}
            selectedEyepiece={selectedEyepiece}
            barlowFactor={barlowFactor}
            onSelectTelescope={setSelectedTelescope}
            onSelectEyepiece={setSelectedEyepiece}
            onSelectBarlow={setBarlowFactor}
            onGoToGear={() =>
              navigation.navigate(routes.auth.profile.astroGearManagement.home.path)
            }
          />
        </View>

        {/* ── Object target section ─────────────────────────────────────────────── */}
        <View style={sectionCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={sectionTitle}>{t('sections.target.title')}</Text>
            <TouchableOpacity
              style={changeButton}
              onPress={() => setPickerVisible(true)}
            >
              <Text style={changeButtonText}>
                {target ? t('sections.target.changeButton') : t('sections.target.changeButton')}
              </Text>
            </TouchableOpacity>
          </View>

          {target ? (
            <View style={{ gap: 2, marginTop: 6 }}>
              <Text style={targetName}>{target.name}</Text>
              <Text style={targetSub}>
                {t('sections.target.objectSize')} :{' '}
                {formatAngular(target.angularWidthDeg)}
                {target.angularHeightDeg !== target.angularWidthDeg
                  ? ` × ${formatAngular(target.angularHeightDeg)}`
                  : ''}
              </Text>
            </View>
          ) : (
            <Text style={emptyText}>{t('sections.target.noTarget')}</Text>
          )}
        </View>

        {/* ── Result cards ─────────────────────────────────────────────────────── */}
        {simulatorValues && (
          <View style={sectionCard}>
            <Text style={sectionTitle}>{t('sections.results.title')}</Text>
            <SimulatorResultCards values={simulatorValues} />
          </View>
        )}

        {/* ── Field renderer ────────────────────────────────────────────────────── */}
        <View style={{ gap: 8 }}>
          <Text style={sectionTitle}>{t('sections.field.title')}</Text>
          {!hasGear ? (
            <Text style={emptyText}>{t('sections.field.noGear')}</Text>
          ) : (
            <FieldRenderer
              target={target}
              tfovDeg={simulatorValues?.tfovDeg ?? 1}
            />
          )}
        </View>

      </ScrollView>

      {/* Object picker modal */}
      <ObjectPickerModal
        visible={pickerVisible}
        planets={planets}
        dsoCatalog={dsoCatalog}
        dsoCatalogLoading={dsoCatalogLoading}
        onClose={() => setPickerVisible(false)}
        onSelectDSO={handleSelectDSO}
        onSelectPlanet={handleSelectPlanet}
      />
    </View>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────────

const formatAngular = (deg: number): string => {
  if (deg >= 1) return `${deg.toFixed(2)}°`
  const arcmin = deg * 60
  if (arcmin >= 1) return `${arcmin.toFixed(1)}'`
  return `${(arcmin * 60).toFixed(0)}"`
}

// ── Inline styles ─────────────────────────────────────────────────────────────────

const sectionCard = {
  backgroundColor: app_colors.white_no_opacity,
  borderWidth: 1,
  borderColor: app_colors.white_twenty,
  borderRadius: 12,
  padding: 14,
  gap: 12,
}

const sectionTitle = {
  color: app_colors.white,
  fontFamily: 'GilroyBlack',
  fontSize: 14,
  textTransform: 'uppercase' as const,
  letterSpacing: 1,
  opacity: 0.7,
}

const changeButton = {
  backgroundColor: app_colors.white_no_opacity,
  borderWidth: 1,
  borderColor: app_colors.white_twenty,
  borderRadius: 8,
  paddingHorizontal: 12,
  paddingVertical: 6,
}

const changeButtonText = {
  color: app_colors.white,
  fontFamily: 'GilroyBold',
  fontSize: 12,
}

const targetName = {
  color: app_colors.white,
  fontFamily: 'GilroyBold',
  fontSize: 18,
}

const targetSub = {
  color: app_colors.white,
  fontFamily: 'DMMonoRegular',
  fontSize: 11,
  opacity: 0.5,
}

const emptyText = {
  color: app_colors.white,
  fontFamily: 'GilroyRegular',
  fontSize: 13,
  opacity: 0.35,
}
