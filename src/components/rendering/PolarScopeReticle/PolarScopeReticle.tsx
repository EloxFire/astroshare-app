import NorthPolarScopeReticle from "./NorthPolarScopeReticle";
import SouthPolarScopeReticle from "./SouthPolarScopeReticle";

interface PolarScopeReticleProps {
  size: number;
  hemisphere: "north" | "south";
  // Angle horaire actuel (0° = haut, sens horaire) de l'étoile/astérisme de référence pour cet
  // hémisphère — Polaris au nord, σ Octantis au sud.
  referenceStarAngleDegrees: number;
  // Utilisé uniquement au sud (nom de constellation affiché à côté de l'astérisme).
  southConstellationLabel?: string;
}

const PolarScopeReticle = ({ size, hemisphere, referenceStarAngleDegrees, southConstellationLabel }: PolarScopeReticleProps) => {
  if (hemisphere === "south") {
    return (
      <SouthPolarScopeReticle
        size={size}
        sigmaOctantisAngleDegrees={referenceStarAngleDegrees}
        constellationLabel={southConstellationLabel ?? ""}
      />
    );
  }

  return <NorthPolarScopeReticle size={size} polarisHourAngleDegrees={referenceStarAngleDegrees} />;
};

export default PolarScopeReticle;
