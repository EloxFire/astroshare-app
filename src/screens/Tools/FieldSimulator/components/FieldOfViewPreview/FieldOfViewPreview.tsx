import { useId } from "react";
import { View } from "react-native";
import Svg, { Circle, ClipPath, Defs, Ellipse, G, RadialGradient, Rect, Stop } from "react-native-svg";
import { app_colors } from "../../../../../helpers/variables";
import { FieldOfView } from "../../../../../helpers/fieldSimulator/fieldOfView";
import { ObjectAngularSize } from "../../../../../helpers/fieldSimulator/objectAngularSize";
import { fieldOfViewPreviewStyles, MAX_HEIGHT_RATIO, MIN_HEIGHT_RATIO, STAR_POSITIONS } from "./FieldOfViewPreview.styles";

interface FieldOfViewPreviewProps {
  fieldOfView: FieldOfView;
  angularSize: ObjectAngularSize | null;
  size?: number;
}

/**
 * Champ vu à l'oculaire (cercle) ou sur le capteur (rectangle), à l'échelle : l'objet est dessiné à
 * l'intérieur en respectant le rapport taille apparente / taille du champ, comme
 * MoonFieldVisualization/CameraFieldVisualization (voir ces composants côté Calculs astronomiques),
 * mais avec une silhouette d'objet du ciel profond (ellipse à halo, pas de rendu 3D) plutôt que la
 * Lune. Le halo (RadialGradient) et le semis d'étoiles sont purement décoratifs : l'app n'a pas
 * d'imagerie réelle par objet (content.images est toujours vide côté API à ce jour).
 */
const FieldOfViewPreview = ({ fieldOfView, angularSize, size = 220 }: FieldOfViewPreviewProps) => {
  // react-native-svg résout id/url(#id) côté natif, pas via le DOM : le ":" que React.useId()
  // ajoute normalement (ex: ":r3:") n'a rien d'invalide ici, mais on l'enlève par prudence pour
  // rester sur des caractères d'id SVG sans ambiguïté possible.
  const idPrefix = useId().replace(/:/g, "");
  const glowId = `${idPrefix}-glow`;
  const clipId = `${idPrefix}-clip`;

  const isCircle = fieldOfView.shape === "circle";
  const width = size;
  const height = isCircle
    ? size
    : Math.min(Math.max(size * (fieldOfView.heightDegrees / fieldOfView.widthDegrees), size * MIN_HEIGHT_RATIO), size * MAX_HEIGHT_RATIO);

  const fovWidthDegrees = isCircle ? fieldOfView.diameterDegrees : fieldOfView.widthDegrees;
  const fovHeightDegrees = isCircle ? fieldOfView.diameterDegrees : fieldOfView.heightDegrees;

  const cx = width / 2;
  const cy = height / 2;
  const circleRadius = Math.min(width, height) / 2;

  // Rayons (pas diamètres) de l'ellipse de l'objet, à l'échelle du champ affiché.
  const objectRx = angularSize ? (width * (angularSize.majorDegrees / fovWidthDegrees)) / 2 : 0;
  const objectRy = angularSize ? (height * (angularSize.minorDegrees / fovHeightDegrees)) / 2 : 0;

  return (
    <View style={[fieldOfViewPreviewStyles.container, { width, height }]}>
      <Svg width={width} height={height}>
        <Defs>
          <RadialGradient id={glowId} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={app_colors.yellow.main} stopOpacity={0.9} />
            <Stop offset="0.4" stopColor={app_colors.accent.main} stopOpacity={0.7} />
            <Stop offset="1" stopColor={app_colors.accent.main} stopOpacity={0} />
          </RadialGradient>
          <ClipPath id={clipId}>
            {
              isCircle
                ? <Circle cx={cx} cy={cy} r={circleRadius} />
                : <Rect x={0} y={0} width={width} height={height} rx={12} />
            }
          </ClipPath>
        </Defs>

        {/* Fond + étoiles + silhouette de l'objet, limités au champ visible (cercle ou rectangle) :
            un objet plus grand que le champ doit être coupé net par son bord, comme à l'oculaire. */}
        <G clipPath={`url(#${clipId})`}>
          <Rect x={0} y={0} width={width} height={height} fill={fieldOfViewPreviewStyles.background} />
          {STAR_POSITIONS.map((star, index) => (
            <Circle key={index} cx={star.x * width} cy={star.y * height} r={1.2} fill={app_colors.white} opacity={0.5} />
          ))}
          {
            angularSize && objectRx > 0 && (
              <Ellipse
                cx={cx}
                cy={cy}
                rx={objectRx}
                ry={objectRy}
                fill={`url(#${glowId})`}
                rotation={angularSize.positionAngleDegrees}
                origin={`${cx}, ${cy}`}
              />
            )
          }
        </G>

        {/* Bord du champ, par-dessus le clip (sinon la moitié du trait serait coupée avec le fond). */}
        {
          isCircle ? (
            <Circle cx={cx} cy={cy} r={circleRadius - 1} stroke={fieldOfViewPreviewStyles.border} strokeWidth={1.5} strokeDasharray="4,4" fill="none" />
          ) : (
            <Rect x={1} y={1} width={width - 2} height={height - 2} rx={12} stroke={fieldOfViewPreviewStyles.border} strokeWidth={1.5} strokeDasharray="4,4" fill="none" />
          )
        }
      </Svg>
    </View>
  );
};

export default FieldOfViewPreview;
