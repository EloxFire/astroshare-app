import { View } from "react-native";
import Svg, { Circle, Line, Polygon } from "react-native-svg";
import { app_colors } from "../../../../../helpers/variables";
import type { BodyTransit } from "../../../../../helpers/satellites/transits";
import { transitDiagramStyles } from "./TransitDiagram.styles";

// Couleur du disque selon le corps visé : jaune pour le Soleil, gris clair pour la Lune (pas de
// vrai rendu, juste de quoi les distinguer d'un coup d'œil dans la liste/la fiche détail).
const BODY_DISC_COLORS = {
  sun: app_colors.yellow.main,
  moon: app_colors.grey,
};

interface TransitDiagramProps {
  transit: BodyTransit;
  size?: number;
  // Couleur du trait/de la flèche/du disque satellite — à adapter au fond sur lequel le schéma est
  // posé (primary.main par défaut, lisible sur une carte claire ; passer une couleur claire type
  // accent.light quand le schéma est posé sur un fond sombre, voir TransitDetailsScreen).
  lineColor?: string;
}

// Écartement du petit triangle qui marque le sens de déplacement réel du satellite.
const ARROW_SPREAD_RAD = (24 * Math.PI) / 180;
// Longueur de la flèche et prolongement du trait au-delà du disque, en proportion du rayon du
// corps visé affiché (et non en pixels fixes) : des valeurs fixes plaçaient la flèche hors du
// canevas SVG dès que `size` devenait petit (ex: 64px dans TransitCard, où un prolongement fixe de
// 14px dépassait largement les 28px de rayon disponibles) — vérifié en direct, c'est ce qui la
// faisait disparaître/mal s'afficher dans la liste des transits.
const ARROW_LENGTH_RATIO = 0.12;
const LINE_EXTENSION_RATIO = 0.14;

const rotate2D = (x: number, y: number, angleRad: number) => ({
  x: x * Math.cos(angleRad) - y * Math.sin(angleRad),
  y: x * Math.sin(angleRad) + y * Math.cos(angleRad),
});

/**
 * Schéma à l'échelle du transit : le corps visé (Soleil ou Lune) est un disque de taille fixe à
 * l'écran, et tout le reste (position/orientation de la trajectoire, taille du satellite) est mis à
 * l'échelle et orienté d'après la vraie géométrie calculée (refineTransitAround) — même principe
 * que FieldOfViewPreview/MoonFieldVisualization ailleurs dans l'app pour la mise à l'échelle.
 * Convention d'orientation : axe X = azimut croissant, axe Y = altitude croissante (inversé à
 * l'écran, qui descend vers le bas) — une simplification assumée (ne tient pas compte de l'angle
 * parallactique réel de l'observateur par rapport au zénith), suffisante pour une vue d'ensemble.
 * Le satellite, bien plus petit que le corps visé (quelques dizaines d'arcsecondes contre ~1900″
 * pour le Soleil, cohérent avec transit-finder.com), apparaît en silhouette sombre (vue à contre-jour).
 */
const TransitDiagram = ({ transit, size = 220, lineColor = app_colors.primary.main }: TransitDiagramProps) => {
  const bodyRadiusPx = size / 2 - 4;
  const centerX = size / 2;
  const centerY = size / 2;
  const pxPerArcmin = bodyRadiusPx / transit.bodyAngularRadiusArcmin;

  // Pied de la perpendiculaire (position du satellite par rapport au centre du corps visé au
  // milieu du transit) — Y inversé : l'altitude croît vers le haut du ciel, l'écran vers le bas.
  const footX = centerX + transit.offsetXArcmin * pxPerArcmin;
  const footY = centerY - transit.offsetYArcmin * pxPerArcmin;

  const pathAngleRad = (transit.pathAngleDeg * Math.PI) / 180;
  const dirX = Math.cos(pathAngleRad);
  const dirY = -Math.sin(pathAngleRad);

  const lineExtensionPx = bodyRadiusPx * LINE_EXTENSION_RATIO;
  const arrowLengthPx = bodyRadiusPx * ARROW_LENGTH_RATIO;

  const offsetMagnitudePx = Math.hypot(footX - centerX, footY - centerY);
  const chordHalfWidthPx = Math.sqrt(Math.max(bodyRadiusPx ** 2 - offsetMagnitudePx ** 2, 0)) + lineExtensionPx;

  const entryX = footX - dirX * chordHalfWidthPx;
  const entryY = footY - dirY * chordHalfWidthPx;
  const exitX = footX + dirX * chordHalfWidthPx;
  const exitY = footY + dirY * chordHalfWidthPx;

  // Petit triangle plein à l'extrémité "sortie" : ses deux autres sommets sont obtenus en faisant
  // pivoter la direction inverse (retour vers l'entrée) de ± ARROW_SPREAD_RAD.
  const wing1 = rotate2D(-dirX, -dirY, ARROW_SPREAD_RAD);
  const wing2 = rotate2D(-dirX, -dirY, -ARROW_SPREAD_RAD);
  const arrowPoint1 = { x: exitX + wing1.x * arrowLengthPx, y: exitY + wing1.y * arrowLengthPx };
  const arrowPoint2 = { x: exitX + wing2.x * arrowLengthPx, y: exitY + wing2.y * arrowLengthPx };

  const satelliteSizeRatio = transit.angularSizeArcsec / (transit.bodyAngularRadiusArcmin * 2 * 60);
  const satelliteRadiusPx = Math.max(satelliteSizeRatio * bodyRadiusPx, 2); // plancher : toujours visible, même si minuscule à l'échelle réelle

  return (
    <View style={transitDiagramStyles.container}>
      <Svg width={size} height={size}>
        <Circle cx={centerX} cy={centerY} r={bodyRadiusPx} fill={BODY_DISC_COLORS[transit.body]} />

        <Line x1={entryX} y1={entryY} x2={exitX} y2={exitY} stroke={lineColor} strokeWidth={2} />
        <Polygon
          points={`${exitX},${exitY} ${arrowPoint1.x},${arrowPoint1.y} ${arrowPoint2.x},${arrowPoint2.y}`}
          fill={lineColor}
        />

        <Circle cx={footX} cy={footY} r={satelliteRadiusPx} fill={lineColor} />
      </Svg>
    </View>
  );
};

export default TransitDiagram;
