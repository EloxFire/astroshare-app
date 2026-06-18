import { Image, Text, useWindowDimensions, View } from 'react-native'
import Svg, { Circle, ClipPath, Defs, Ellipse, Image as SvgImage, Rect as SvgRect } from 'react-native-svg'
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

type FieldRendererProps =
  | { mode: 'eyepiece'; target: SimulatorTarget | null; tfovDeg: number }
  | { mode: 'camera';   target: SimulatorTarget | null; fovWidthDeg: number; fovHeightDeg: number }

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

const formatAngular = (deg: number): string => {
  if (deg >= 1) return `${deg.toFixed(2)}°`
  const arcmin = deg * 60
  if (arcmin >= 1) return `${arcmin.toFixed(1)}'`
  return `${(arcmin * 60).toFixed(0)}"`
}

// ── Shared object renderer (works for both circular and rectangular fields) ────────

const renderObjectContent = (
  target: SimulatorTarget,
  fieldWidthPx: number,
  fieldHeightPx: number,
  pixelsPerDeg: number,
  clipPathId: string,
) => {
  const cx = fieldWidthPx / 2
  const cy = fieldHeightPx / 2

  switch (target.renderMode) {
    case 'image': {
      const wDeg = target.imageWidthDeg ?? target.angularWidthDeg
      const hDeg = target.imageHeightDeg ?? target.angularHeightDeg
      const w = wDeg * pixelsPerDeg
      const h = hDeg * pixelsPerDeg
      return (
        <Svg width={fieldWidthPx} height={fieldHeightPx} style={{ position: 'absolute' }}>
          <SvgImage
            href={target.imageUri!}
            x={cx - w / 2}
            y={cy - h / 2}
            width={w}
            height={h}
            preserveAspectRatio="xMidYMid meet"
            clipPath={`url(#${clipPathId})`}
          />
        </Svg>
      )
    }

    case 'moon': {
      const moonSizePx = target.angularWidthDeg * pixelsPerDeg
      const moonSrc = target.imageUri ? { uri: target.imageUri } : target.imageSource
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
            fieldSizePx={Math.max(fieldWidthPx, fieldHeightPx)}
            planetName={target.planetName ?? ''}
          />
        </View>
      )

    case 'point':
      return (
        <View
          style={{
            position: 'absolute',
            width: 4, height: 4, borderRadius: 2,
            backgroundColor: app_colors.white,
            top: cy - 2, left: cx - 2,
            shadowColor: app_colors.white, shadowRadius: 4, shadowOpacity: 0.8,
          }}
        />
      )
  }
}

// ── Main export ───────────────────────────────────────────────────────────────────

export const FieldRenderer = (props: FieldRendererProps) => {
  const { width: screenWidth } = useWindowDimensions()
  const PADDING = 24

  // ── Camera mode (rectangular frame) ──────────────────────────────────────────

  if (props.mode === 'camera') {
    const { target, fovWidthDeg, fovHeightDeg } = props
    const frameWidth = screenWidth - PADDING * 2
    const aspectRatio = fovWidthDeg / fovHeightDeg
    const frameHeight = frameWidth / aspectRatio
    const pixelsPerDeg = frameWidth / fovWidthDeg

    const isOversized = target
      ? target.angularWidthDeg > fovWidthDeg || target.angularHeightDeg > fovHeightDeg
      : false

    return (
      <View style={{ alignItems: 'center', gap: 8 }}>
        {/* Camera frame */}
        <View style={{ position: 'relative' }}>
          <View
            style={{
              width: frameWidth,
              height: frameHeight,
              backgroundColor: '#000000',
              overflow: 'hidden',
            }}
          >
            {/* Crosshair */}
            <View style={{ position: 'absolute', top: frameHeight / 2 - 0.5, left: 0, right: 0, height: 1, backgroundColor: app_colors.white_twenty }} />
            <View style={{ position: 'absolute', left: frameWidth / 2 - 0.5, top: 0, bottom: 0, width: 1, backgroundColor: app_colors.white_twenty }} />

            {/* Object */}
            {target && (() => {
              const clipId = 'cameraRectClip'
              return (
                <>
                  {/* SVG for DSO image with rectangular clip */}
                  {target.renderMode === 'image' && (
                    <Svg width={frameWidth} height={frameHeight} style={{ position: 'absolute' }}>
                      <Defs>
                        <ClipPath id={clipId}>
                          <SvgRect x={0} y={0} width={frameWidth} height={frameHeight} />
                        </ClipPath>
                      </Defs>
                      {renderObjectContent(target, frameWidth, frameHeight, pixelsPerDeg, clipId)}
                    </Svg>
                  )}
                  {target.renderMode !== 'image' && renderObjectContent(target, frameWidth, frameHeight, pixelsPerDeg, clipId)}
                </>
              )
            })()}

            {!target && (
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: app_colors.white, fontFamily: 'GilroyRegular', fontSize: 13, opacity: 0.35, textAlign: 'center' }}>
                  {t('noTarget')}
                </Text>
              </View>
            )}
          </View>

          {/* Corner brackets — classic astrophotography frame indicator */}
          {['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map((corner) => (
            <CornerBracket key={corner} corner={corner as any} />
          ))}
        </View>

        {/* Info row */}
        {target && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={infoStyles.name}>{target.name}</Text>
            <Text style={infoStyles.separator}>·</Text>
            <Text style={infoStyles.size}>{formatAngular(target.angularWidthDeg)} × {formatAngular(target.angularHeightDeg)}</Text>
          </View>
        )}
        {isOversized && (
          <View style={infoStyles.warningBanner}>
            <Text style={infoStyles.warningText}>{t('objectTooLarge')}</Text>
          </View>
        )}
        <Text style={infoStyles.scaleLabel}>
          {formatAngular(fovWidthDeg)} × {formatAngular(fovHeightDeg)}
        </Text>
      </View>
    )
  }

  // ── Eyepiece mode (circular field) ────────────────────────────────────────────

  const { target, tfovDeg } = props
  const fieldSizePx = screenWidth - PADDING * 2
  const R = fieldSizePx / 2
  const pixelsPerDeg = fieldSizePx / tfovDeg
  const isOversized = target ? target.angularWidthDeg > tfovDeg : false

  return (
    <View style={{ alignItems: 'center', gap: 8 }}>
      {/* Field circle */}
      <View
        style={{
          width: fieldSizePx, height: fieldSizePx,
          borderRadius: R,
          borderWidth: 1, borderColor: app_colors.white_forty,
          backgroundColor: '#000000',
          overflow: 'hidden', position: 'relative',
        }}
      >
        {/* Crosshair */}
        <View style={{ position: 'absolute', top: R - 0.5, left: 0, right: 0, height: 1, backgroundColor: app_colors.white_twenty }} />
        <View style={{ position: 'absolute', left: R - 0.5, top: 0, bottom: 0, width: 1, backgroundColor: app_colors.white_twenty }} />

        {/* Object */}
        {target && (() => {
          if (target.renderMode === 'image') {
            const wDeg = target.imageWidthDeg ?? target.angularWidthDeg
            const hDeg = target.imageHeightDeg ?? target.angularHeightDeg
            const w = wDeg * pixelsPerDeg
            const h = hDeg * pixelsPerDeg
            return (
              <Svg width={fieldSizePx} height={fieldSizePx} style={{ position: 'absolute' }}>
                <Defs>
                  <ClipPath id="eyepieceClip">
                    <Circle cx={R} cy={R} r={R} />
                  </ClipPath>
                </Defs>
                <SvgImage
                  href={target.imageUri!}
                  x={R - w / 2} y={R - h / 2}
                  width={w} height={h}
                  preserveAspectRatio="xMidYMid meet"
                  clipPath="url(#eyepieceClip)"
                />
              </Svg>
            )
          }
          return renderObjectContent(target, fieldSizePx, fieldSizePx, pixelsPerDeg, 'eyepieceClip')
        })()}

        {!target && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
            <Text style={{ color: app_colors.white, fontFamily: 'GilroyRegular', fontSize: 13, opacity: 0.35, textAlign: 'center' }}>
              {t('noTarget')}
            </Text>
          </View>
        )}
      </View>

      {/* Target info */}
      {target && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={infoStyles.name}>{target.name}</Text>
          <Text style={infoStyles.separator}>·</Text>
          <Text style={infoStyles.size}>{formatAngular(target.angularWidthDeg)}</Text>
        </View>
      )}
      {isOversized && (
        <View style={infoStyles.warningBanner}>
          <Text style={infoStyles.warningText}>{t('objectTooLarge')}</Text>
        </View>
      )}

      {/* Scale bar */}
      <View style={{ alignItems: 'center', gap: 4 }}>
        <View style={{ width: fieldSizePx * 0.3, height: 2, backgroundColor: app_colors.white_forty, borderRadius: 1 }} />
        <Text style={infoStyles.scaleLabel}>{formatAngular(tfovDeg * 0.3)} · TFOV {formatAngular(tfovDeg)}</Text>
      </View>
    </View>
  )
}

// ── Corner bracket indicator for camera frame ──────────────────────────────────────

const BRACKET = 12

const CornerBracket = ({ corner }: { corner: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' }) => {
  const top = corner.startsWith('top')
  const left = corner.endsWith('Left')
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: BRACKET, height: BRACKET,
        top: top ? 0 : undefined,
        bottom: top ? undefined : 0,
        left: left ? 0 : undefined,
        right: left ? undefined : 0,
        borderTopWidth: top ? 1.5 : 0,
        borderBottomWidth: top ? 0 : 1.5,
        borderLeftWidth: left ? 1.5 : 0,
        borderRightWidth: left ? 0 : 1.5,
        borderColor: app_colors.white_sixty,
      }}
    />
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
