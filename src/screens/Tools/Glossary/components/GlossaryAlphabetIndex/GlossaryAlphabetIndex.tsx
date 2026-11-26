import { Text, TouchableOpacity, View } from "react-native";
import { ALPHABET } from "../../../../../helpers/glossary/search";
import { glossaryAlphabetIndexStyles as styles } from "./GlossaryAlphabetIndex.styles";

interface GlossaryAlphabetIndexProps {
  // Lettres ayant au moins une entrée dans la liste COURANTE (filtrée par catégorie/recherche) —
  // les autres restent affichées mais grisées/non cliquables plutôt que masquées, pour garder une
  // colonne A-Z stable visuellement.
  availableLetters: Set<string>;
  // Lettre de la section actuellement visible en haut de la liste (voir GlossaryScreen) — `null`
  // tant qu'on n'a pas encore défilé jusqu'à la liste (ex: pendant qu'on lit le mot du jour).
  currentLetter: string | null;
  onPressLetter: (letter: string) => void;
}

/**
 * Index alphabétique fixe (overlay en superposition de la liste, voir GlossaryScreen) : une colonne
 * A-Z, les lettres sans entrée grisées, les autres colorées et tactiles pour sauter à la section
 * correspondante. Ne suit pas la position de défilement courante (pas de lettre "active" en plus de
 * "disponible/non disponible") — simplification volontaire, un vrai suivi demanderait de mesurer la
 * position de chaque section en continu.
 */
const GlossaryAlphabetIndex = ({ availableLetters, currentLetter, onPressLetter }: GlossaryAlphabetIndexProps) => (
  <View style={styles.container} pointerEvents="box-none">
    {ALPHABET.map((letter) => {
      const available = availableLetters.has(letter);
      const isCurrent = available && letter === currentLetter;
      return (
        <TouchableOpacity key={letter} disabled={!available} onPress={() => onPressLetter(letter)} hitSlop={2}>
          <Text
            style={[
              styles.letter,
              available && styles.letter.active,
              isCurrent && styles.letter.current,
              !available && styles.letter.disabled,
            ]}
          >
            {letter}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

export default GlossaryAlphabetIndex;
