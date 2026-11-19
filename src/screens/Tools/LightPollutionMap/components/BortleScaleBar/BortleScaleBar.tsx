import { View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { app_colors, radius } from "../../../../../helpers/variables";
import { bortleScaleBarStyles } from "./BortleScaleBar.styles";

const BORTLE_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

interface BortleScaleBarProps {
  // Hauteur de la barre de dégradé — même échelle de couleurs (app_colors.bortleScale, déjà
  // utilisée dans ObservatoryDetails/StepTwo) sous deux tailles : petite légende statique, grande
  // barre avec la classe du lieu affiché mise en évidence.
  height?: number;
  // Fourni : affiche une rangée de 9 pastilles au-dessus de la barre, celle du niveau courant
  // agrandie — reprend le principe de StepTwo (bortleScale.numberButton), sans interactivité ici
  // (lecture seule). Omis : simple dégradé, utilisé pour la légende de la carte.
  currentBortle?: number;
}

/**
 * <BortleScaleBar /> — légende statique.
 * <BortleScaleBar currentBortle={6} /> — avec le niveau du lieu affiché mis en évidence.
 */
const BortleScaleBar = ({ height = 8, currentBortle }: BortleScaleBarProps) => {
  return (
    <View>
      {currentBortle !== undefined && (
        <View style={bortleScaleBarStyles.dotsRow}>
          {BORTLE_LEVELS.map((level) => (
            <View
              key={level}
              style={[bortleScaleBarStyles.dot, level === currentBortle && bortleScaleBarStyles.dot.active]}
            />
          ))}
        </View>
      )}

      <View style={[bortleScaleBarStyles.bar, { height }]}>
        <Svg width="100%" height="100%">
          <Defs>
            <LinearGradient id="bortleScaleGradient" x1="0" y1="0" x2="1" y2="0">
              {Object.entries(app_colors.bortleScale).map(([level, color], index, entries) => (
                <Stop key={level} offset={index / (entries.length - 1)} stopColor={color} />
              ))}
            </LinearGradient>
          </Defs>
          {/* rx borné à height/2 : au-delà, le rayon horizontal n'est pas clampé par le rendu SVG
              et mange une grosse portion de chaque extrémité de la barre (voir StepTwo). */}
          <Rect width="100%" height="100%" rx={Math.min(radius.badge32, height / 2)} fill="url(#bortleScaleGradient)" />
        </Svg>
      </View>
    </View>
  );
};

export default BortleScaleBar;
