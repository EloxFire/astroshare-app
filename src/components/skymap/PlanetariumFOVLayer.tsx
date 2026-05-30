import { useEffect, useMemo, useState } from 'react'
import { Modal, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import Constants from 'expo-constants'
import { useAuth } from '../../contexts/AuthContext'
import { useAstroGear } from '../../contexts/GearContext'
import { app_colors } from '../../helpers/constants'
import { getTelescopes } from '../../helpers/scripts/gear/telescopes'
import { getEyepieces } from '../../helpers/scripts/gear/eyepieces'
import { getCameras } from '../../helpers/scripts/gear/cameras'
import { Telescope } from '../../helpers/types/gear/Telescope'
import { Eyepiece } from '../../helpers/types/gear/Eyepiece'
import { Camera } from '../../helpers/types/gear/Camera'
import {
  computeMagnification,
  computeTFOV,
  computeCameraValues,
} from '../../helpers/scripts/simulator/computeSimulatorValues'
import { GearSelector, BarlowFactor, InstrumentMode } from '../simulator/GearSelector'
import { routes } from '../../helpers/routes'

// ── Perspective projection helper ─────────────────────────────────────────────────
// Returns the size in pixels for an angular diameter `angleDeg`, given the
// camera's vertical FOV and the screen height.
const perspectivePx = (angleDeg: number, cameraFovDeg: number, screenH: number): number => {
  const tanAngle = Math.tan((angleDeg / 2) * Math.PI / 180)
  const tanCamera = Math.tan((cameraFovDeg / 2) * Math.PI / 180)
  return screenH * tanAngle / tanCamera
}

const formatAngle = (deg: number): string => {
  if (deg >= 1) return `${deg.toFixed(2)}°`
  const arcmin = deg * 60
  if (arcmin >= 1) return `${arcmin.toFixed(1)}'`
  return `${(arcmin * 60).toFixed(0)}"`
}

// ── FOV circle (eyepiece) ──────────────────────────────────────────────────────────

const EyepieceOverlay = ({ diameter }: { diameter: number }) => (
  <View
    pointerEvents="none"
    style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      alignItems: 'center', justifyContent: 'center',
    }}
  >
    <View
      style={{
        width: diameter,
        height: diameter,
        borderRadius: diameter / 2,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.55)',
      }}
    />
  </View>
)

// ── FOV rectangle (camera) ────────────────────────────────────────────────────────

const BRACKET = 14

const CameraOverlay = ({ widthPx, heightPx }: { widthPx: number; heightPx: number }) => (
  <View
    pointerEvents="none"
    style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      alignItems: 'center', justifyContent: 'center',
    }}
  >
    <View style={{ width: widthPx, height: heightPx }}>
      {/* Main border */}
      <View style={{ flex: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.55)' }} />
      {/* Corner brackets */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((c) => (
        <View
          key={c}
          style={{
            position: 'absolute',
            width: BRACKET, height: BRACKET,
            top: c[0] === 't' ? -1 : undefined,
            bottom: c[0] === 'b' ? -1 : undefined,
            left: c[1] === 'l' ? -1 : undefined,
            right: c[1] === 'r' ? -1 : undefined,
            borderTopWidth: c[0] === 't' ? 2.5 : 0,
            borderBottomWidth: c[0] === 'b' ? 2.5 : 0,
            borderLeftWidth: c[1] === 'l' ? 2.5 : 0,
            borderRightWidth: c[1] === 'r' ? 2.5 : 0,
            borderColor: 'rgba(255,255,255,0.85)',
          }}
        />
      ))}
    </View>
  </View>
)

// ── Gear picker modal ─────────────────────────────────────────────────────────────

interface GearPickerModalProps {
  visible: boolean
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
  onInstrumentModeChange: (m: InstrumentMode) => void
  onSelectBarlow: (b: BarlowFactor) => void
  onClose: () => void
  navigation: any
}

const GearPickerModal = (props: GearPickerModalProps) => (
  <Modal
    visible={props.visible}
    transparent
    animationType="slide"
    onRequestClose={props.onClose}
  >
    <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <View style={pickerStyles.sheet}>
        <View style={pickerStyles.header}>
          <Text style={pickerStyles.title}>Champ de vue</Text>
          <TouchableOpacity onPress={props.onClose}>
            <Text style={pickerStyles.closeBtn}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <GearSelector
            telescopes={props.telescopes}
            eyepieces={props.eyepieces}
            cameras={props.cameras}
            selectedTelescope={props.selectedTelescope}
            selectedEyepiece={props.selectedEyepiece}
            selectedCamera={props.selectedCamera}
            instrumentMode={props.instrumentMode}
            barlowFactor={props.barlowFactor}
            onSelectTelescope={props.onSelectTelescope}
            onSelectEyepiece={props.onSelectEyepiece}
            onSelectCamera={props.onSelectCamera}
            onInstrumentModeChange={props.onInstrumentModeChange}
            onSelectBarlow={props.onSelectBarlow}
            onGoToGear={() => {
              props.onClose()
              props.navigation.navigate(routes.auth.profile.astroGearManagement.home.path)
            }}
          />
          <View style={{ height: 30 }} />
        </ScrollView>
      </View>
    </View>
  </Modal>
)

// ── Main component ─────────────────────────────────────────────────────────────────

interface PlanetariumFOVLayerProps {
  cameraFovDeg: number
  navigation: any
}

export const PlanetariumFOVLayer = ({ cameraFovDeg, navigation }: PlanetariumFOVLayerProps) => {
  const { width: W, height: H } = useWindowDimensions()
  const { currentUser } = useAuth()
  const { currentGear } = useAstroGear()

  const [telescopes, setTelescopes] = useState<Telescope[]>([])
  const [eyepieces, setEyepieces] = useState<Eyepiece[]>([])
  const [cameras, setCameras] = useState<Camera[]>([])

  const [selectedTelescope, setSelectedTelescope] = useState<Telescope | null>(null)
  const [selectedEyepiece, setSelectedEyepiece] = useState<Eyepiece | null>(null)
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null)
  const [instrumentMode, setInstrumentMode] = useState<InstrumentMode>('eyepiece')
  const [barlowFactor, setBarlowFactor] = useState<BarlowFactor>(1)

  const [overlayVisible, setOverlayVisible] = useState(false)
  const [pickerVisible, setPickerVisible] = useState(false)

  useEffect(() => {
    if (!currentUser?.uid) return
    ;(async () => {
      const [scopes, eps, cams] = await Promise.all([
        getTelescopes(currentUser.uid),
        getEyepieces(currentUser.uid),
        getCameras(currentUser.uid),
      ])
      setTelescopes(scopes)
      setEyepieces(eps)
      setCameras(cams)

      const activeScope = currentGear?.telescope
        ? scopes.find((s) => s.id === currentGear.telescope)
        : scopes[0] ?? null
      if (activeScope) setSelectedTelescope(activeScope)

      const activeEp = currentGear?.eyepiece
        ? eps.find((e) => e.id === currentGear.eyepiece)
        : eps[0] ?? null
      if (activeEp) setSelectedEyepiece(activeEp)

      const activeCam = currentGear?.camera
        ? cams.find((c) => c.id === currentGear.camera)
        : cams[0] ?? null
      if (activeCam) setSelectedCamera(activeCam)
    })()
  }, [currentUser?.uid])

  // ── Compute overlay dimensions ─────────────────────────────────────────────────

  const overlay = useMemo(() => {
    if (!selectedTelescope) return null

    if (instrumentMode === 'eyepiece' && selectedEyepiece) {
      const G = computeMagnification(selectedTelescope.focalLength, selectedEyepiece.focalLength, barlowFactor)
      const tfov = computeTFOV(selectedEyepiece.apparentFieldOfView, G)
      const diameter = perspectivePx(tfov, cameraFovDeg, H)
      return { kind: 'eyepiece' as const, diameter, tfov }
    }

    if (instrumentMode === 'camera' && selectedCamera) {
      const cv = computeCameraValues(
        selectedTelescope.focalLength,
        selectedCamera.sensorSize.width,
        selectedCamera.sensorSize.height,
        selectedCamera.pixelSize,
        barlowFactor,
      )
      return {
        kind: 'camera' as const,
        widthPx: perspectivePx(cv.fovWidthDeg, cameraFovDeg, H),
        heightPx: perspectivePx(cv.fovHeightDeg, cameraFovDeg, H),
        fovWidth: cv.fovWidthDeg,
        fovHeight: cv.fovHeightDeg,
      }
    }

    return null
  }, [selectedTelescope, selectedEyepiece, selectedCamera, instrumentMode, barlowFactor, cameraFovDeg, H])

  // ── Render ────────────────────────────────────────────────────────────────────

  const hasGear = selectedTelescope !== null &&
    (instrumentMode === 'eyepiece' ? selectedEyepiece !== null : selectedCamera !== null)

  const TOP = Constants.statusBarHeight ? Constants.statusBarHeight + 20 : 40

  return (
    <View
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 11 }}
      pointerEvents="box-none"
    >
      {/* FOV overlay circle or rectangle */}
      {overlayVisible && overlay && (
        overlay.kind === 'eyepiece'
          ? <EyepieceOverlay diameter={overlay.diameter} />
          : <CameraOverlay widthPx={overlay.widthPx} heightPx={overlay.heightPx} />
      )}

      {/* FOV label at bottom of overlay */}
      {overlayVisible && overlay && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: H / 2 + (overlay.kind === 'eyepiece' ? overlay.diameter / 2 : overlay.heightPx / 2) + 6,
            left: 0, right: 0,
            alignItems: 'center',
          }}
        >
          <Text style={labelStyle}>
            {overlay.kind === 'eyepiece'
              ? formatAngle(overlay.tfov)
              : `${formatAngle(overlay.fovWidth)} × ${formatAngle(overlay.fovHeight)}`
            }
          </Text>
        </View>
      )}

      {/* Control buttons — bottom-right */}
      <View
        style={{
          position: 'absolute',
          bottom: 100,
          right: 10,
          gap: 8,
          alignItems: 'center',
        }}
        pointerEvents="box-none"
      >
        {/* Gear picker button */}
        <TouchableOpacity
          style={[btn, !hasGear && btnDim]}
          onPress={() => setPickerVisible(true)}
        >
          <Text style={btnIcon}>⌖</Text>
        </TouchableOpacity>

        {/* Toggle overlay on/off */}
        {hasGear && (
          <TouchableOpacity
            style={[btn, overlayVisible && btnActive]}
            onPress={() => setOverlayVisible((v) => !v)}
          >
            <Text style={[btnIcon, overlayVisible && btnIconActive]}>◎</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Gear picker modal */}
      <GearPickerModal
        visible={pickerVisible}
        telescopes={telescopes}
        eyepieces={eyepieces}
        cameras={cameras}
        selectedTelescope={selectedTelescope}
        selectedEyepiece={selectedEyepiece}
        selectedCamera={selectedCamera}
        instrumentMode={instrumentMode}
        barlowFactor={barlowFactor}
        onSelectTelescope={setSelectedTelescope}
        onSelectEyepiece={setSelectedEyepiece}
        onSelectCamera={setSelectedCamera}
        onInstrumentModeChange={setInstrumentMode}
        onSelectBarlow={setBarlowFactor}
        onClose={() => setPickerVisible(false)}
        navigation={navigation}
      />
    </View>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────────

const btn = {
  width: 44,
  height: 44,
  borderRadius: 10,
  backgroundColor: 'rgba(0,0,0,0.55)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.2)',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
}

const btnActive = {
  backgroundColor: 'rgba(255,255,255,0.15)',
  borderColor: 'rgba(255,255,255,0.6)',
}

const btnDim = {
  opacity: 0.5,
}

const btnIcon = {
  color: 'rgba(255,255,255,0.7)',
  fontSize: 22,
}

const btnIconActive = {
  color: app_colors.white,
}

const labelStyle = {
  color: 'rgba(255,255,255,0.6)',
  fontFamily: 'DMMonoRegular',
  fontSize: 10,
  backgroundColor: 'rgba(0,0,0,0.4)',
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 4,
}

const pickerStyles = {
  sheet: {
    backgroundColor: '#0d0d0d',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    maxHeight: '80%' as const,
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  title: {
    color: app_colors.white,
    fontFamily: 'GilroyBlack',
    fontSize: 18,
  },
  closeBtn: {
    color: app_colors.white,
    fontFamily: 'GilroyRegular',
    fontSize: 18,
    opacity: 0.6,
  },
}
