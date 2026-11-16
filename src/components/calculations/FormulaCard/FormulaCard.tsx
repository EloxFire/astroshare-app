import { Text, View } from "react-native";
import MathJax from "react-native-mathjax";
import { app_colors } from "../../../helpers/variables";
import { formulaCardStyles } from "./FormulaCard.styles";

interface FormulaCardProps {
  formulaLatex: string;
  description: string;
}

// Carte "formule" en tête d'une fiche de calcul : rendu LaTeX via react-native-mathjax (déjà
// utilisé ailleurs dans l'app), + une phrase expliquant ce que représente le résultat.
// react-native-mathjax charge MathJax depuis un CDN dans sa WebView interne : la formule ne
// s'affiche pas hors connexion (le calcul lui-même reste utilisable, lui ne dépend que de JS).
const FormulaCard = ({ formulaLatex, description }: FormulaCardProps) => (
  <View style={formulaCardStyles.card}>
    <View style={formulaCardStyles.card.formula}>
      <MathJax
        html={`<div style="color:${app_colors.primary.main};font-size:22px;text-align:center;font-family:sans-serif;">${formulaLatex}</div>`}
        mathJaxOptions={{ messageStyle: "none" }}
        style={{ backgroundColor: "transparent" }}
      />
    </View>
    <Text style={formulaCardStyles.card.description}>{description}</Text>
  </View>
);

export default FormulaCard;
