import { Image, Text, useWindowDimensions, View } from 'react-native'
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Image as SvgImage } from 'react-native-svg'
import { SimulatorTarget } from '../../helpers/scripts/simulator/getObjectForSimulator'
import { app_colors } from '../../helpers/constants'
import { i18n } from '../../helpers/scripts/i18n'

const t = (path: string) => i18n.t(`telescopeSimulator.home.sections.field.${path}`)

// Planet colors for the procedural disk renderer
const PLANET_COLORS: Record<string, string> = {
  Mercury: '#9b9b9b',
  Venus: '#e8c97e',
  Mars: '#c1440e',
  Jupiter: '#c88b3a',
  Saturn: '#d4b064',
  Uranus: '#7de8e8',
  Neptune: '#4b70dd',
  Sun: '#FDB813',
}

interface FieldRendererProps {
  target: SimulatorTarget | null
  tfovDeg: number
}

// ── Procedural planet disk (SVG) ─────────────────────────────────────────────────

const PlanetDisk = ({
  sizePx,
  fieldSizePx,
  planetName,
}: {
  sizePx: number
  fieldSizePx: number
  planetName: string
}) => {
  const color = PLANET_COLORS[planetName] ?? '#ffffff'
  const cx = fieldSizePx / 2
  const cy = fieldSizePx / 2

  // True scale: no artificial clamp — the size difference between eyepieces
  // must be preserved. 0.5 is only the SVG rendering floor (sub-pixel floor).
  const r = Math.max(sizePx / 2, 0.5)

  return (
    <Svg width={fieldSizePx} height={fieldSizePx}>
      {/* Diffraction/atmospheric halo — proportional to disk size */}
      <Circle cx={cx} cy={cy} r={r * 3.5} fill={color} opacity={0.04} />
      <Circle cx={cx} cy={cy} r={r * 2.0} fill={color} opacity={0.10} />
      {/* Planet disk */}
      <Circle cx={cx} cy={cy} r={r} fill={color} />
      {/* Saturn rings — proportional to disk, minimum visible at high mag */}
      {planetName === 'Saturn' && (
        <Ellipse
          cx={cx}
          cy={cy}
          rx={r * 2.4}
          ry={r * 0.6}
          fill="none"
          stroke={color}
          strokeWidth={Math.max(r * 0.5, 0.5)}
          opacity={0.65}
        />
      )}
    </Svg>
  )
}

// ── Field circle with clipped object ─────────────────────────────────────────────

export const FieldRenderer = ({ target, tfovDeg }: FieldRendererProps) => {
  const { width: screenWidth } = useWindowDimensions()

  const PADDING = 24
  const fieldSizePx = screenWidth - PADDING * 2
  const R = fieldSizePx / 2
  const pixelsPerDeg = fieldSizePx / tfovDeg

  const isOversized = target ? target.angularWidthDeg > tfovDeg : false

  // Angular size label at the bottom of the circle
  const formatAngular = (deg: number): string => {
    if (deg >= 1) return `${deg.toFixed(2)}°`
    const arcmin = deg * 60
    if (arcmin >= 1) return `${arcmin.toFixed(1)}'`
    return `${(arcmin * 60).toFixed(0)}"`
  }

  // How to scale the object inside the field
  const getObjectDimensions = () => {
    if (!target) return { w: 0, h: 0 }
    // For plate-solved DSO images we use the image's own sky footprint
    const wDeg = target.imageWidthDeg ?? target.angularWidthDeg
    const hDeg = target.imageHeightDeg ?? target.angularHeightDeg
    return {
      w: wDeg * pixelsPerDeg,
      h: hDeg * pixelsPerDeg,
    }
  }

  const renderObject = () => {
    if (!target) return null

    const { w, h } = getObjectDimensions()
    const cx = fieldSizePx / 2
    const cy = fieldSizePx / 2

    switch (target.renderMode) {

      case 'image':
        return (
          <Svg
            width={fieldSizePx}
            height={fieldSizePx}
            style={{ position: 'absolute' }}
          >
            <Defs>
              <ClipPath id="fieldClip">
                <Circle cx={R} cy={R} r={R} />
              </ClipPath>
            </Defs>
            <SvgImage
              href={target.imageUri!}
              x={cx - w / 2}
              y={cy - h / 2}
              width={w}
              height={h}
              preserveAspectRatio="xMidYMid meet"
              clipPath="url(#fieldClip)"
            />
          </Svg>
        )

      case 'moon': {
        // True scale — no cap. When moonSizePx > fieldSizePx the image overflows the
        // circle and overflow:hidden clips it, showing only the central portion of the
        // disk. This correctly simulates high-magnification views where the Moon is
        // larger than the eyepiece field.
        const moonSizePx = target.angularWidthDeg * pixelsPerDeg
        const moonSrc = target.imageUri
          ? { uri: target.imageUri }
          : target.imageSource

        if (!moonSrc) return null

        return (
          <Image
            source={moonSrc}
            style={{
              position: 'absolute',
              width: moonSizePx,
              height: moonSizePx,
              top: cy - moonSizePx / 2,
              left: cx - moonSizePx / 2,
            }}
            resizeMode="cover"
          />
        )
      }

      case 'planet':
        return (
          <View style={{ position: 'absolute', top: 0, left: 0 }}>
            <PlanetDisk
              sizePx={target.angularWidthDeg * pixelsPerDeg}
              fieldSizePx={fieldSizePx}
              planetName={target.planetName ?? ''}
            />
          </View>
        )

      case 'point':
        return (
          <View
            style={{
              position: 'absolute',
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: app_colors.white,
              top: cy - 2,
              left: cx - 2,
              shadowColor: app_colors.white,
              shadowRadius: 4,
              shadowOpacity: 0.8,
            }}
          />
        )
    }
  }

  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      {/* Field circle */}
      <View
        style={{
          width: fieldSizePx,
          height: fieldSizePx,
          borderRadius: R,
          borderWidth: 1,
          borderColor: app_colors.white_forty,
          backgroundColor: '#000000',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Crosshair (thin reticle lines) */}
        <View
          style={{
            position: 'absolute',
            top: R - 0.5,
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: app_colors.white_twenty,
          }}
        />
        <View
          style={{
            position: 'absolute',
            left: R - 0.5,
            top: 0,
            bottom: 0,
            width: 1,
            backgroundColor: app_colors.white_twenty,
          }}
        />

        {/* Object rendering */}
        {renderObject()}

        {/* No gear / no target placeholder */}
        {!target && (
          <View
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                color: app_colors.white,
                fontFamily: 'GilroyRegular',
                fontSize: 13,
                opacity: 0.35,
                textAlign: 'center',
              }}
            >
              {t('noTarget')}
            </Text>
          </View>
        )}
      </View>

      {/* Target info row */}
      {target && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={infoStyles.name}>{target.name}</Text>
          <Text style={infoStyles.separator}>·</Text>
          <Text style={infoStyles.size}>{formatAngular(target.angularWidthDeg)}</Text>
        </View>
      )}

      {/* Oversized warning */}
      {isOversized && (
        <View style={infoStyles.warningBanner}>
          <Text style={infoStyles.warningText}>{t('objectTooLarge')}</Text>
        </View>
      )}

      {/* TFOV scale bar */}
      <View style={{ alignItems: 'center', gap: 4 }}>
        <View
          style={{
            width: fieldSizePx * 0.3,
            height: 2,
            backgroundColor: app_colors.white_forty,
            borderRadius: 1,
          }}
        />
        <Text style={infoStyles.scaleLabel}>{formatAngular(tfovDeg * 0.3)} · TFOV {formatAngular(tfovDeg)}</Text>
      </View>
    </View>
  )
}

const infoStyles = {
  name: {
    color: app_colors.white,
    fontFamily: 'GilroyBold',
    fontSize: 14,
  },
  separator: {
    color: app_colors.white,
    opacity: 0.3,
    fontSize: 14,
  },
  size: {
    color: app_colors.white,
    fontFamily: 'DMMonoRegular',
    fontSize: 12,
    opacity: 0.5,
  },
  warningBanner: {
    backgroundColor: app_colors.orange_forty,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  warningText: {
    color: app_colors.orange,
    fontFamily: 'DMMonoRegular',
    fontSize: 10,
  },
  scaleLabel: {
    color: app_colors.white,
    fontFamily: 'DMMonoRegular',
    fontSize: 9,
    opacity: 0.35,
  },
}
