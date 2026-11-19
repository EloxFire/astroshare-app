import { Camera } from "../../types/gear/Camera";
import { Eyepiece } from "../../types/gear/Eyepiece";
import { Setup } from "../../types/gear/Setup";
import { Telescope } from "../../types/gear/Telescope";
import { gearName } from "../gear/gearName";

export type FieldSimulatorCombo = {
  // Stable tant que les pièces de matériel qui le composent gardent leur id (ids de Setup +
  // oculaire/caméra concaténés) — pas un uuid dédié, pas besoin de persister ces combinaisons.
  id: string;
  setupId: string;
  setupName: string;
  scope: Telescope;
} & (
  | { kind: "eyepiece"; eyepiece: Eyepiece }
  | { kind: "camera"; camera: Camera }
);

// Un Setup enregistré n'est pas "un télescope + un oculaire OU une caméra" : il peut porter
// plusieurs oculaires ET plusieurs caméras à la fois (voir Setup.ts). Le simulateur de champ a
// besoin d'une combinaison instrument+oculaire ou instrument+caméra précise pour calculer un champ,
// donc chaque Setup est d'abord mis à plat en une entrée par oculaire et par caméra — un Setup à 3
// oculaires donne 3 combinaisons. Les Setup sans télescope renseigné sont ignorés : aucun calcul de
// champ n'est possible sans sa focale.
export const getFieldSimulatorCombos = (setups: Setup[]): FieldSimulatorCombo[] =>
  setups.flatMap((setup): FieldSimulatorCombo[] => {
    if (!setup.scope) return [];

    const eyepieceCombos: FieldSimulatorCombo[] = setup.eyepieces.map((eyepiece) => ({
      id: `${setup.id}:eyepiece:${eyepiece.id}`,
      setupId: setup.id,
      setupName: setup.name,
      scope: setup.scope as Telescope,
      kind: "eyepiece",
      eyepiece,
    }));

    const cameraCombos: FieldSimulatorCombo[] = setup.cameras.map((camera) => ({
      id: `${setup.id}:camera:${camera.id}`,
      setupId: setup.id,
      setupName: setup.name,
      scope: setup.scope as Telescope,
      kind: "camera",
      camera,
    }));

    return [...eyepieceCombos, ...cameraCombos];
  });

// "Lunette 80/560 + 25 mm" ou "Lunette 80/560 + ASI533MC" — même construction que la maquette.
// Fallbacks traduits passés par l'appelant (composant), jamais résolus ici (voir gearName).
export const getComboLabel = (combo: FieldSimulatorCombo, scopeFallback: string, eyepieceFallback: string, cameraFallback: string): string => {
  const scopeName = gearName(combo.scope.name, combo.scope.brand, combo.scope.model, scopeFallback);
  return combo.kind === "eyepiece"
    ? `${scopeName} + ${combo.eyepiece.focalLength} mm`
    : `${scopeName} + ${gearName(combo.camera.name, combo.camera.brand, combo.camera.model, cameraFallback)}`;
};
