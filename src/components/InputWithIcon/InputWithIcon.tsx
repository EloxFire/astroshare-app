import { Text, TextInput, TextInputProps, TextStyle, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Eye, EyeOff, LucideIcon } from "lucide-react-native";
import { app_colors, flattenOpacity } from "../../helpers/variables";
import { inputWithIconStyles } from "./InputWithIcon.styles";

interface InputWithIconProps extends TextInputProps {
  action: () => void;
  icon?: LucideIcon;
  suggestions?: string[];
  onSuggestionPress?: (suggestion: string) => void;
  label?: string;
  // Astérisque rouge accolée au label (ex: "Nom *") — purement visuel, ne bloque pas la saisie.
  required?: boolean;
  // Pour surcharger la couleur/le style du label au cas par cas (ex: fond sombre) — le style par
  // défaut (globalStyles.categoryTitle, voir InputWithIcon.styles.ts) n'est lisible que sur fond
  // clair, car primary.medium n'est qu'une version à 50% d'opacité de primary.main : posé sur un
  // fond déjà primary.main, le texte se fond avec son propre arrière-plan.
  labelStyle?: TextStyle;
  // false (défaut) : largeur pleine (100% du parent), autonome quel que soit le contexte de
  // layout (colonne, seul, etc.) — n'utilise pas flex:1, qui se comporte différemment selon le
  // flexDirection du parent (axe horizontal en ligne, vertical en colonne) et peut entrer en
  // compétition avec d'autres éléments flex:1 pour l'espace vertical restant de l'écran.
  // true : flex:1 — à activer uniquement quand ce composant est placé à côté d'un autre élément
  // dans une View flexDirection:"row" (ex: à côté d'un bouton), pour se partager la largeur.
  fill?: boolean;
  keyboardType?: TextInputProps["keyboardType"];
  additionnalInputStyles?: TextInputProps["style"];
  // Affiche un oeil (lucide-react-native) à droite du champ pour basculer entre texte masqué
  // (par défaut) et en clair — remplace secureTextEntry, à ne pas passer en plus de ce prop.
  password?: boolean;
}

export const InputWithIcon = ({
  icon: Icon,
  style,
  action,
  suggestions,
  onSuggestionPress,
  label,
  labelStyle,
  additionnalInputStyles,
  onFocus,
  onBlur,
  onChangeText,
  fill = false,
  password = false,
  required = false,
  ...props
}: InputWithIconProps) => {

  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // Liste masquée après un choix, jusqu'à la prochaine frappe. Un état à part plutôt que de forcer
  // isFocused à false : le champ garde le focus (clavier ouvert), et isFocused doit rester le reflet
  // exact du vrai focus, sinon les suggestions ne réapparaissaient plus en retapant.
  const [suggestionsDismissed, setSuggestionsDismissed] = useState(false);

  const showSuggestions = Boolean(suggestions && suggestions.length > 0) && isFocused && !suggestionsDismissed;

  const handleSuggestionPress = (suggestion: string) => {
    onSuggestionPress?.(suggestion);
    setSuggestionsDismissed(true);
  }

  return (
    // fill/width doivent être sur cette View extérieure : c'est elle que le parent appelant
    // voit et dimensionne (ex: à côté d'un bouton dans une ligne) — les mettre plus bas, sur la
    // ligne icône+input, ne servait plus à rien depuis l'ajout du label, qui a introduit ce
    // wrapper en colonne au-dessus.
    <View style={{display: 'flex', flexDirection: 'column', gap: 5, ...(fill ? { flex: 1 } : { width: '100%' })}}>
      {label && (
        <Text style={[inputWithIconStyles.label, labelStyle]}>
          {label}{required && <Text style={inputWithIconStyles.label.required}> *</Text>}
        </Text>
      )}
      {/* Champ + suggestions collées dessous (dans leur propre View, sans le gap du wrapper). */}
      <View>
        <View style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
          <View style={[inputWithIconStyles.container, showSuggestions && inputWithIconStyles.container.withSuggestions]}>
            {Icon && <Icon color={flattenOpacity(app_colors.primary.main, 0.8, app_colors.white)} size={16} />}
            <TextInput
              // Handlers de l'appelant appelés en plus des nôtres (et non à leur place via le spread
              // de props) : isFocused doit toujours suivre le vrai focus.
              onFocus={(event) => { setIsFocused(true); onFocus?.(event); }}
              onBlur={(event) => { setIsFocused(false); onBlur?.(event); }}
              onChangeText={(text) => { setSuggestionsDismissed(false); onChangeText?.(text); }}
              style={[inputWithIconStyles.input, style, additionnalInputStyles]}
              placeholderTextColor={app_colors.primary.medium}
              returnKeyType={props.multiline ? "default" : "done"}
              submitBehavior={props.multiline ? "newline" : "submit"}
              onSubmitEditing={action}
              keyboardType={props.keyboardType || "default"}
              multiline={props.multiline || false}
              // "sentences" (comportement par défaut de TextInput) n'a de sens que pour du texte
              // libre multiligne — sur un champ simple (email, tag, coordonnées...), ça majuscule
              // la première lettre sans que ce soit voulu.
              autoCapitalize={props.multiline ? "sentences" : "none"}
              secureTextEntry={password && !isPasswordVisible}
              {...props}
            />
            {password && (
              <TouchableOpacity onPress={() => setIsPasswordVisible((visible) => !visible)} hitSlop={10}>
                {isPasswordVisible
                  ? <EyeOff color={flattenOpacity(app_colors.primary.main, 0.8, app_colors.white)} size={16} />
                  : <Eye color={flattenOpacity(app_colors.primary.main, 0.8, app_colors.white)} size={16} />
                }
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* Dans le flux, sous le champ, et non en position absolute par-dessus la suite de l'écran :
            les éléments affichés après le champ passaient au-dessus de la liste (son zIndex ne joue
            qu'entre éléments voisins) et recevaient les appuis à sa place. Le contenu en dessous est
            poussé le temps que la liste est ouverte.
            Si le champ est dans un ScrollView, celui-ci doit avoir keyboardShouldPersistTaps="handled" :
            sinon, clavier ouvert, le premier appui sur une suggestion ne fait que fermer le clavier. */}
        {showSuggestions && suggestions && (
          <View style={inputWithIconStyles.suggestionsContainer}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity onPress={() => handleSuggestionPress(suggestion)} key={`${index}-${suggestion}`} style={[inputWithIconStyles.suggestion, index < suggestions.length - 1 && inputWithIconStyles.suggestion.withBorder]}>
                <Text style={inputWithIconStyles.suggestion.text}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};
