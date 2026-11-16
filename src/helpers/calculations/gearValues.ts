import { Telescope } from "../../types/gear/Telescope";
import { Eyepiece } from "../../types/gear/Eyepiece";
import { Camera } from "../../types/gear/Camera";
import { CalculationValues } from "../../types/calculations/Calculation";

export interface SelectedGear {
  telescope: Telescope | null;
  eyepiece: Eyepiece | null;
  camera: Camera | null;
}

// Traduit le matériel sélectionné ("Mon matériel") en valeurs de variables de calcul. Une seule
// fiche par type d'instrument (pas de multi-setup) : si rien n'est choisi pour un type donné, les
// clés correspondantes sont simplement absentes (l'utilisateur les complète à la main).
export const resolveGearValues = ({ telescope, eyepiece, camera }: SelectedGear): CalculationValues => ({
  ...(telescope ? { aperture: telescope.aperture, instrumentFocalLength: telescope.focalLength } : {}),
  ...(eyepiece ? { eyepieceFocalLength: eyepiece.focalLength, apparentField: eyepiece.afov } : {}),
  ...(camera ? { pixelSize: camera.pixelSize, sensorWidth: camera.sensorSize.width, sensorHeight: camera.sensorSize.height } : {}),
});
