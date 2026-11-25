import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Circle, G, Line, Polyline, Text as SvgText, Svg } from "react-native-svg";
import { app_colors } from "../../../../../helpers/variables";
import { useAppUnits } from "../../../../../hooks/useAppUnits";
import type { LunarEclipse, LunarEclipseEventKey } from "../../../../../types/eclipses/Eclipse";
import { moonShadowDiagramStyles as styles } from "./MoonShadowDiagram.styles";

// Même halo de pulsation que MoonPathDiagram/EclipseTypeIcon.
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const BREATH_DURATION_MS = 2400;

const PHASES: { key: LunarEclipseEventKey; label: string }[] = [
  { key: "P1", label: "P1" },
  { key: "U1", label: "U1" },
  { key: "U2", label: "U2" },
  { key: "greatest", label: "M" },
  { key: "U3", label: "U3" },
  { key: "U4", label: "U4" },
  { key: "P2", label: "P2" },
];

// Vérifié en reconstruisant la géométrie à partir de données réelles de l'API : pour U2/U3/greatest,
// l'angle de position renvoyé est mesuré à l'opposé exact (180°) de la convention utilisée pour
// P1/U1/U4/P2 (probablement calculé depuis la Lune plutôt que depuis le centre de l'ombre pour ces
// évènements-là). Sans cette correction, la trajectoire tracée zigzague — même correction que
// astroshare-public-tools/src/components/MoonShadowDiagram.tsx.
const ANGLE_OFFSET_DEG: Partial<Record<LunarEclipseEventKey, number>> = { U2: 180, greatest: 180, U3: 180 };

const PENUMBRA_RADIUS_PX = 65;
const CENTER_X = 110;
const CENTER_Y = 95;

interface MoonShadowDiagramProps {
  // Géocentrique (voir celestialPosition.ts) : la même donnée convient quel que soit le lieu, pas
  // besoin de circonstances locales ici (contrairement à MoonPathDiagram, solaire).
  eclipse: LunarEclipse;
}

/**
 * Trajectoire schématique de la Lune dans l'ombre de la Terre — port de
 * astroshare-public-tools/src/components/MoonShadowDiagram.tsx. Les deux cercles de fond (pénombre/
 * ombre) sont à l'échelle réelle entre eux ; seule la position de la Lune à chaque contact est
 * approximative dans ce rendu schématique.
 */
const MoonShadowDiagram = ({ eclipse }: MoonShadowDiagramProps) => {
  const { t } = useTranslation("tools/eclipses");
  const { formatDate } = useAppUnits();
  const [visible, setVisible] = useState<Record<string, boolean>>({ P1: true, U1: false, U2: true, greatest: true, U3: true, U4: false, P2: true });

  // Respiration lente (0→1→0), déclarée avant les `return` anticipés ci-dessous (règle des Hooks) —
  // anime le marqueur du maximum d'éclipse.
  const breath = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breath, { toValue: 1, duration: BREATH_DURATION_MS, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(breath, { toValue: 0, duration: BREATH_DURATION_MS, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [breath]);

  const available = PHASES.filter(({ key }) => eclipse.events[key]);
  if (available.length === 0 || !eclipse.radius) return null;

  const pxPerUnit = PENUMBRA_RADIUS_PX / eclipse.radius.penumbra;
  const umbraRadiusPx = eclipse.radius.umbra * pxPerUnit;

  const points = available.map(({ key, label }) => {
    const event = eclipse.events[key]!;
    const angleDeg = (event.p ?? 0) + (ANGLE_OFFSET_DEG[key] ?? 0);
    const angleRad = (angleDeg * Math.PI) / 180;
    const separationPx = (event.axis ?? 0) * pxPerUnit;
    const dx = Math.sin(angleRad) * separationPx;
    const dy = -Math.cos(angleRad) * separationPx;

    return {
      key,
      label,
      x: CENTER_X + dx,
      y: CENTER_Y + dy,
      radiusPx: (event.Moon?.radius ?? 0) * pxPerUnit,
      time: formatDate(new Date(`${event.date}Z`)).format("HH:mm:ss"),
    };
  });

  const greatestPoint = points.find((p) => p.key === "greatest");
  const greatestGlowRadius = greatestPoint
    ? breath.interpolate({ inputRange: [0, 1], outputRange: [greatestPoint.radiusPx * 1.2, greatestPoint.radiusPx * 1.6] })
    : undefined;
  const greatestGlowOpacity = breath.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.06] });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("details.diagram.lunar.title")}</Text>
      <Text style={styles.note}>{t("details.diagram.lunar.note")}</Text>

      <View style={styles.svgWrap}>
        <Svg width="100%" height="100%" viewBox="0 0 220 180">
          <Polyline points={points.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={app_colors.primary.medium} strokeWidth={1} strokeDasharray="3,3" />

          <Circle cx={CENTER_X} cy={CENTER_Y} r={PENUMBRA_RADIUS_PX} fill={app_colors.primary.main} fillOpacity={0.08} stroke={app_colors.primary.medium} strokeWidth={1} />
          <Circle cx={CENTER_X} cy={CENTER_Y} r={umbraRadiusPx} fill={app_colors.red.main} fillOpacity={0.18} stroke={app_colors.red.main} strokeWidth={1.5} />

          {greatestPoint && visible.greatest && (
            <AnimatedCircle cx={greatestPoint.x} cy={greatestPoint.y} r={greatestGlowRadius} fill={app_colors.red.main} fillOpacity={greatestGlowOpacity} />
          )}

          {points.filter((p) => visible[p.key]).map((p) => (
            <G key={p.key}>
              <Circle cx={p.x} cy={p.y} r={p.radiusPx} fill={app_colors.primary.main} stroke={app_colors.primary.light} strokeWidth={1} />
              <SvgText x={p.x} y={p.y - p.radiusPx - 6} fontSize={11} fill={app_colors.primary.main} textAnchor="middle">{p.label}</SvgText>
            </G>
          ))}

          <G transform="translate(196, 150)">
            <Line x1="0" y1="0" x2="0" y2="-14" stroke={app_colors.primary.medium} strokeWidth={1} />
            <SvgText x="0" y="-18" fontSize={9} fill={app_colors.primary.medium} textAnchor="middle">N</SvgText>
            <Line x1="0" y1="0" x2="14" y2="0" stroke={app_colors.primary.medium} strokeWidth={1} />
            <SvgText x="18" y="4" fontSize={9} fill={app_colors.primary.medium} textAnchor="middle">E</SvgText>
          </G>
        </Svg>
      </View>

      <View style={styles.chips}>
        {points.map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[styles.chips.chip, visible[p.key] && styles.chips.chip.active]}
            onPress={() => setVisible((v) => ({ ...v, [p.key]: !v[p.key] }))}
          >
            <Text style={[styles.chips.chip.text, visible[p.key] && styles.chips.chip.text.active]}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.legend}>
        {points.map((p) => (
          <Text key={p.key} style={styles.legend.text}>{p.label} {p.time}</Text>
        ))}
      </View>
    </View>
  );
};

export default MoonShadowDiagram;
