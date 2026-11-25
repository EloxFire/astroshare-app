import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Circle, G, Line, Polyline, Text as SvgText, Svg } from "react-native-svg";
import { app_colors } from "../../../../../helpers/variables";
import { useAppUnits } from "../../../../../hooks/useAppUnits";
import TabSwitch from "../../../../../components/inputs/TabSwitch/TabSwitch";
import type { SolarEclipse, SolarEclipseEventKey } from "../../../../../types/eclipses/Eclipse";
import { moonPathDiagramStyles as styles } from "./MoonPathDiagram.styles";

type ContactType = "external" | "internal" | "greatest";

const PHASES: { key: SolarEclipseEventKey; label: string; contact: ContactType }[] = [
  { key: "P1", label: "P1", contact: "external" },
  { key: "U1", label: "U1", contact: "internal" },
  { key: "greatest", label: "M", contact: "greatest" },
  { key: "U4", label: "U4", contact: "internal" },
  { key: "P4", label: "P4", contact: "external" },
];

const SUN_RADIUS_PX = 50;
const CENTER_X = 110;
const CENTER_Y = 95;
const ARC_MINUTE_STEPS = [1, 2, 5, 10, 15, 20, 30, 45, 60];

// Même halo de pulsation que EclipseTypeIcon/SatelliteGroundTrackMap : Animated (RN core) piloté en
// JS, seule option pour animer des attributs SVG plutôt qu'un style de View.
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const BREATH_DURATION_MS = 2400;

interface MoonPathDiagramProps {
  // Circonstances LOCALES (per-observer, voir getLocalSolarEclipse) — contrairement à
  // MoonShadowDiagram (lunaire, géocentrique), `p`/`zenith` dépendent ici du lieu choisi.
  eclipse: SolarEclipse;
}

/**
 * Trajectoire schématique de la Lune devant le Soleil — port de
 * astroshare-public-tools/src/components/MoonPathDiagram.tsx. Les tailles/positions sont
 * approximatives (échelle en minutes d'arc, pas l'échelle réelle Soleil/Lune) ; seul le repère
 * "local" a un sens de boussole (le "céleste" est orienté par rapport au pôle céleste, pas au zénith).
 */
const MoonPathDiagram = ({ eclipse }: MoonPathDiagramProps) => {
  const { t } = useTranslation("tools/eclipses");
  const { formatDate } = useAppUnits();
  const [frame, setFrame] = useState<"celestial" | "local">("local");
  const [visible, setVisible] = useState<Record<string, boolean>>({ P1: true, U1: false, greatest: true, U4: false, P4: true });

  // Respiration lente (0→1→0), déclarée avant les `return` anticipés ci-dessous (règle des Hooks) —
  // anime le halo du Soleil et le marqueur du maximum d'éclipse.
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
  if (available.length === 0) return null;

  const referenceEvent = eclipse.events.P1 ?? eclipse.events.greatest ?? eclipse.events[available[0].key];
  const sunRadiusDeg = referenceEvent?.Sun?.radius;
  if (!sunRadiusDeg) return null;
  const pxPerDeg = SUN_RADIUS_PX / sunRadiusDeg;

  const points = available.map(({ key, label, contact }) => {
    const event = eclipse.events[key]!;
    const sunR = event.Sun?.radius ?? sunRadiusDeg;
    const moonR = event.Moon?.radius ?? sunRadiusDeg;

    let separation: number;
    if (contact === "external") {
      separation = sunR + moonR;
    } else if (contact === "internal") {
      separation = Math.abs(sunR - moonR);
    } else {
      const raw = sunR + moonR - 2 * eclipse.magnitude * sunR;
      separation = Math.max(0, Math.min(sunR + moonR, raw));
    }

    const angleDeg = (frame === "celestial" ? event.p : event.zenith) ?? 0;
    const angleRad = (angleDeg * Math.PI) / 180;
    const dx = Math.sin(angleRad) * separation * pxPerDeg;
    const dy = -Math.cos(angleRad) * separation * pxPerDeg;

    return {
      key,
      label,
      x: CENTER_X + dx,
      y: CENTER_Y + dy,
      radiusPx: moonR * pxPerDeg,
      time: formatDate(new Date(`${event.date}Z`)).format("HH:mm:ss"),
    };
  });

  const scale =
    ARC_MINUTE_STEPS.map((arcmin) => ({ arcmin, px: pxPerDeg * (arcmin / 60) })).find(({ px }) => px >= 32 && px <= 85) ??
    { arcmin: 60, px: pxPerDeg };

  const greatestPoint = points.find((p) => p.key === "greatest");
  const sunHaloRadius = breath.interpolate({ inputRange: [0, 1], outputRange: [SUN_RADIUS_PX * 1.02, SUN_RADIUS_PX * 1.12] });
  const sunHaloOpacity = breath.interpolate({ inputRange: [0, 1], outputRange: [0.22, 0.08] });
  const greatestGlowRadius = greatestPoint
    ? breath.interpolate({ inputRange: [0, 1], outputRange: [greatestPoint.radiusPx * 1.2, greatestPoint.radiusPx * 1.6] })
    : undefined;
  const greatestGlowOpacity = breath.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.06] });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("details.diagram.solar.title")}</Text>
      <Text style={styles.note}>{t("details.diagram.solar.note")}</Text>

      <TabSwitch
        fitContent
        tabs={[{ text: t("details.diagram.frame.local") }, { text: t("details.diagram.frame.celestial") }]}
        activeTab={frame === "local" ? 0 : 1}
        onTabPress={(index) => setFrame(index === 0 ? "local" : "celestial")}
      />

      <View style={styles.svgWrap}>
        <Svg width="100%" height="100%" viewBox="0 0 220 180">
          <Polyline points={points.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke={app_colors.primary.medium} strokeWidth={1} strokeDasharray="3,3" />

          <AnimatedCircle cx={CENTER_X} cy={CENTER_Y} r={sunHaloRadius} fill={app_colors.sun.main} fillOpacity={sunHaloOpacity} />
          <Circle cx={CENTER_X} cy={CENTER_Y} r={SUN_RADIUS_PX} fill={app_colors.sun.main} fillOpacity={0.3} stroke={app_colors.sun.main} strokeWidth={1.5} />

          {greatestPoint && visible.greatest && (
            <AnimatedCircle cx={greatestPoint.x} cy={greatestPoint.y} r={greatestGlowRadius} fill={app_colors.sun.main} fillOpacity={greatestGlowOpacity} />
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

          <G transform="translate(14, 164)">
            <Line x1="0" y1="0" x2={scale.px} y2="0" stroke={app_colors.primary.medium} strokeWidth={1} />
            <Line x1="0" y1="-3" x2="0" y2="3" stroke={app_colors.primary.medium} strokeWidth={1} />
            <Line x1={scale.px} y1="-3" x2={scale.px} y2="3" stroke={app_colors.primary.medium} strokeWidth={1} />
            <SvgText x={scale.px / 2} y="13" fontSize={9} fill={app_colors.primary.medium} textAnchor="middle">{`${scale.arcmin}'`}</SvgText>
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

export default MoonPathDiagram;
