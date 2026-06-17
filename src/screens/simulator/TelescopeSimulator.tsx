import { useEffect, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import { globalStyles } from '../../styles/global'
import PageTitle from '../../components/commons/PageTitle'
import { i18n } from '../../helpers/scripts/i18n'
import { useAuth } from '../../contexts/AuthContext'
import { useSettings } from '../../contexts/AppSettingsContext'
import { sendAnalyticsEvent } from '../../helpers/scripts/analytics'
import { eventTypes } from '../../helpers/constants/analytics'
import { useTranslation } from '../../hooks/useTranslation'
import { useAstroGear } from '../../contexts/GearContext'
import { useSolarSystem } from '../../contexts/SolarSystemContext'
import { useDsoCatalog } from '../../contexts/DSOContext'
import { routes } from '../../helpers/routes'
import { app_colors } from '../../helpers/constants'
import { getTelescopes } from '../../helpers/scripts/gear/telescopes'
import { getEyepieces } from '../../helpers/scripts/gear/eyepieces'
import { getCameras } from '../../helpers/scripts/gear/cameras'
import { Telescope } from '../../helpers/types/gear/Telescope'
import { Eyepiece } from '../../helpers/types/gear/Eyepiece'
import { Camera } from '../../helpers/types/gear/Camera'
import { DSO } from '../../helpers/types/DSO'
import { GlobalPlanet } from '../../helpers/types/GlobalPlanet'
import { SpecialSkyObject } from '../../helpers/types/SpecialSkyObject'
import {
  computeSimulatorValues,
  computeCameraValues,
} from '../../helpers/scripts/simulator/computeSimulatorValues'
import {
  getDSOTarget,
  getPlanetTarget,
  getSpecialObjectTarget,
  SimulatorTarget,
} from '../../helpers/scripts/simulator/getObjectForSimulator'
import { GearSelector, BarlowFactor, InstrumentMode } from '../../components/simulator/GearSelector'
import { ObjectPickerModal } from '../../components/simulator/ObjectPickerModal'
import { SimulatorResultCards } from '../../components/simulator/SimulatorResultCards'
import { FieldRenderer } from '../../components/simulator/FieldRenderer'

const t = (path: string) => i18n.t(`telescopeSimulator.home.${path}`)

export const TelescopeSimulator = ({ navigation }: any) => {

  const { currentUser } = useAuth()
  const { currentUserLocation } = useSettings()
  const { currentLocale } = useTranslation()
  const { currentGear } = useAstroGear()
  const { planets, moonCoords } = useSolarSystem()
  const { dsoCatalog, dsoCatalogLoading } = useDsoCatalog()
  const isFocused = useIsFocused()

  // Gear lists
  const [telescopes, setTelescopes] = useState<Telescope[]>([])
  const [eyepieces, setEyepieces] = useState<Eyepiece[]>([])
  const [cameras, setCameras] = useState<Camera[]>([])

  // Selection
  const [selectedTelescope, setSelectedTelescope] = useState<Telescope | null>(null)
  const [selectedEyepiece, setSelectedEyepiece] = useState<Eyepiece | null>(null)
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null)
  const [barlowFactor, setBarlowFactor] = useState<BarlowFactor>(1)
  const [instrumentMode, setInstrumentMode] = useState<InstrumentMode>('eyepiece')

  // Target object
  const [target, setTarget] = useState<SimulatorTarget | null>(null)
  const [pickerVisible, setPickerVisible] = useState(false)

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'telescope_simulator_screen_view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, [])

  // Load gear from storage on focus
  useEffect(() => {
    if (!isFocused || !currentUser?.uid) return
    ;(async () => {
      const [loadedScopes, loadedEyepieces, loadedCameras] = await Promise.all([
        getTelescopes(currentUser.uid),
        getEyepieces(currentUser.uid),
        getCameras(currentUser.uid),
      ])
      setTelescopes(loadedScopes)
      setEyepieces(loadedEyepieces)
      setCameras(loadedCameras)

      // Pre-select active telescope
      const activeTelescope = currentGear?.telescope
        ? loadedScopes.find((s) => s.id === currentGear.telescope)
        : loadedScopes[0] ?? null
      if (activeTelescope) setSelectedTelescope(activeTelescope)

      // Pre-select active eyepiece
      const activeEyepiece = currentGear?.eyepiece
        ? loadedEyepieces.find((e) => e.id === currentGear.eyepiece)
        : loadedEyepieces[0] ?? null
      if (activeEyepiece) setSelectedEyepiece(activeEyepiece)

      // Pre-select active camera
      const activeCamera = currentGear?.camera
        ? loadedCameras.find((c) => c.id === currentGear.camera)
        : loadedCameras[0] ?? null
      if (activeCamera) setSelectedCamera(activeCamera)
    })()
  }, [isFocused, currentUser?.uid])

  // ── Computed values ──────────────────────────────────────────────────────────────

  const eyepieceValues =
    instrumentMode === 'eyepiece' && selectedTelescope && selectedEyepiece
      ? computeSimulatorValues(
          selectedTelescope.focalLength,
          selectedTelescope.diameter,
          selectedEyepiece.focalLength,
          selectedEyepiece.apparentFieldOfView,
          barlowFactor,
        )
      : null

  const cameraValues =
    instrumentMode === 'camera' && selectedTelescope && selectedCamera
      ? computeCameraValues(
          selectedTelescope.focalLength,
          selectedCamera.sensorSize.width,
          selectedCamera.sensorSize.height,
          selectedCamera.pixelSize,
          barlowFactor,
        )
      : null

  const hasValidSetup =
    selectedTelescope !== null &&
    (instrumentMode === 'eyepiece' ? selectedEyepiece !== null : selectedCamera !== null)

  // ── Target selection ──────────────────────────────────────────────────────────────

  const handleSelectDSO = (dso: DSO) => {
    setTarget(getDSOTarget(dso))
    sendAnalyticsEvent(currentUser, currentUserLocation, 'simulator_dso_selected', eventTypes.BUTTON_CLICK, { dso: dso.name }, currentLocale)
  }

  const handleSelectPlanet = (planet: GlobalPlanet | SpecialSkyObject) => {
    if ('family' in planet) {
      setTarget(getSpecialObjectTarget(planet, currentUserLocation, moonCoords?.currentIconUrl))
    } else {
      setTarget(getPlanetTarget(planet as GlobalPlanet, currentUserLocation))
    }
    sendAnalyticsEvent(currentUser, currentUserLocation, 'simulator_planet_selected', eventTypes.BUTTON_CLICK, { planet: planet.name }, currentLocale)
  }

  // ── Render ────────────────────────────────────────────────────────────────────────

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title={t('title')} subtitle={t('subtitle')} />
      <View style={globalStyles.screens.separator} />

      <ScrollView contentContainerStyle={{ gap: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* ── Gear ─────────────────────────────────────────────────────────────── */}
        <View style={sectionCard}>
          <Text style={sectionTitle}>{t('sections.gear.title')}</Text>
          <GearSelector
            telescopes={telescopes}
            eyepieces={eyepieces}
            cameras={cameras}
            selectedTelescope={selectedTelescope}
            selectedEyepiece={selectedEyepiece}
            selectedCamera={selectedCamera}
            instrumentMode={instrumentMode}
            barlowFactor={barlowFactor}
            onSelectTelescope={(scope) => { setSelectedTelescope(scope); sendAnalyticsEvent(currentUser, currentUserLocation, 'simulator_telescope_selected', eventTypes.BUTTON_CLICK, { telescope: scope?.name }, currentLocale) }}
            onSelectEyepiece={(ep) => { setSelectedEyepiece(ep); sendAnalyticsEvent(currentUser, currentUserLocation, 'simulator_eyepiece_selected', eventTypes.BUTTON_CLICK, { eyepiece: ep?.name }, currentLocale) }}
            onSelectCamera={(cam) => { setSelectedCamera(cam); sendAnalyticsEvent(currentUser, currentUserLocation, 'simulator_camera_selected', eventTypes.BUTTON_CLICK, { camera: cam?.name }, currentLocale) }}
            onSelectBarlow={(factor) => { setBarlowFactor(factor); sendAnalyticsEvent(currentUser, currentUserLocation, 'simulator_barlow_selected', eventTypes.BUTTON_CLICK, { factor }, currentLocale) }}
            onInstrumentModeChange={(mode) => { setInstrumentMode(mode); sendAnalyticsEvent(currentUser, currentUserLocation, 'simulator_instrument_mode_changed', eventTypes.BUTTON_CLICK, { mode }, currentLocale) }}
            onGoToGear={() => { navigation.navigate(routes.auth.profile.astroGearManagement.home.path); sendAnalyticsEvent(currentUser, currentUserLocation, 'simulator_go_to_gear_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale) }}
          />
        </View>

        {/* ── Target ───────────────────────────────────────────────────────────── */}
        <View style={sectionCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={sectionTitle}>{t('sections.target.title')}</Text>
            <TouchableOpacity style={changeButton} onPress={() => { setPickerVisible(true); sendAnalyticsEvent(currentUser, currentUserLocation, 'simulator_change_target_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale) }}>
              <Text style={changeButtonText}>{t('sections.target.changeButton')}</Text>
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

        {/* ── Results ──────────────────────────────────────────────────────────── */}
        {eyepieceValues && (
          <View style={sectionCard}>
            <Text style={sectionTitle}>{t('sections.results.title')}</Text>
            <SimulatorResultCards mode="eyepiece" values={eyepieceValues} />
          </View>
        )}
        {cameraValues && (
          <View style={sectionCard}>
            <Text style={sectionTitle}>{t('sections.results.title')}</Text>
            <SimulatorResultCards mode="camera" values={cameraValues} />
          </View>
        )}

        {/* ── Field ────────────────────────────────────────────────────────────── */}
        <View style={{ gap: 8 }}>
          <Text style={sectionTitle}>{t('sections.field.title')}</Text>
          {!hasValidSetup ? (
            <Text style={emptyText}>{t('sections.field.noGear')}</Text>
          ) : instrumentMode === 'eyepiece' && eyepieceValues ? (
            <FieldRenderer
              mode="eyepiece"
              target={target}
              tfovDeg={eyepieceValues.tfovDeg}
            />
          ) : instrumentMode === 'camera' && cameraValues ? (
            <FieldRenderer
              mode="camera"
              target={target}
              fovWidthDeg={cameraValues.fovWidthDeg}
              fovHeightDeg={cameraValues.fovHeightDeg}
            />
          ) : null}
        </View>

      </ScrollView>

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

// ── Styles ────────────────────────────────────────────────────────────────────────

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
