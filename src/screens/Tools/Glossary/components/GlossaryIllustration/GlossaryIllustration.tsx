import { Image } from "react-native";
import type { GlossaryIllustration as GlossaryIllustrationConfig } from "../../../../../types/glossary/GlossaryEntry";
import { glossaryIllustrationStyles as styles } from "./GlossaryIllustration.styles";

interface GlossaryIllustrationProps {
  illustration: GlossaryIllustrationConfig;
}

/**
 * Rend l'une des 3 formes d'illustration possibles d'une entrée du glossaire (voir
 * types/glossary/GlossaryEntry.ts) dans l'encart sombre partagé — appelant (GlossaryEntryRow,
 * WordOfTheDayCard) fournit juste la config, ce composant choisit le bon rendu.
 */
const GlossaryIllustration = ({ illustration }: GlossaryIllustrationProps) => {
  if (illustration.kind === "component") {
    const { Component } = illustration;
    return <Component />;
  }

  // "image" et "gif" se rendent à l'identique : <Image> de React Native anime nativement un GIF,
  // aucun code spécifique à ajouter pour ce cas.
  return (
    <Image
      source={illustration.source}
      style={[styles.image, illustration.aspectRatio ? { aspectRatio: illustration.aspectRatio } : null]}
      resizeMode="contain"
    />
  );
};

export default GlossaryIllustration;
