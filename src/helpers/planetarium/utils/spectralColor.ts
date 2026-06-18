// How much of the original color's distance from white to keep.
// 1.0 = fully saturated (vivid), 0.0 = pure white for all types.
// 0.40 gives a subtle tint that reads as a stellar class cue without
// making the sky look like a box of crayons.
const SAT = 0.40;

// Blend an RGB triple toward white by (1 - SAT).
function tint(r: number, g: number, b: number): [number, number, number] {
  return [
    1.0 + (r - 1.0) * SAT,
    1.0 + (g - 1.0) * SAT,
    1.0 + (b - 1.0) * SAT,
  ];
}

// Full-saturation anchor colors per Harvard spectral class.
// These are blended toward white via tint() above.
const SPECTRAL_COLORS: Record<string, [number, number, number]> = {
  O: tint(0.60, 0.80, 1.00), // blue-white
  B: tint(0.70, 0.85, 1.00), // blue-white
  A: tint(0.90, 0.93, 1.00), // white with cool hint
  F: tint(1.00, 1.00, 0.95), // warm white
  G: tint(1.00, 0.98, 0.80), // yellow-white (sun-like)
  K: tint(1.00, 0.87, 0.55), // orange
  M: tint(1.00, 0.65, 0.40), // red-orange
  C: tint(1.00, 0.55, 0.30), // carbon star red
  S: tint(1.00, 0.70, 0.50), // reddish
  W: tint(0.70, 0.95, 1.00), // Wolf-Rayet blue-green
};

export function getSpectralColor(spectralType: string | null | undefined): [number, number, number] {
  if (!spectralType) return [1.0, 1.0, 1.0];
  const code = spectralType[0]?.toUpperCase();
  return SPECTRAL_COLORS[code] ?? [1.0, 1.0, 1.0];
}
