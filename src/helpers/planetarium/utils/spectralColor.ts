const SPECTRAL_COLORS: Record<string, [number, number, number]> = {
  O: [0.60, 0.80, 1.00],
  B: [0.70, 0.85, 1.00],
  A: [0.90, 0.93, 1.00],
  F: [1.00, 1.00, 0.95],
  G: [1.00, 0.98, 0.80],
  K: [1.00, 0.87, 0.55],
  M: [1.00, 0.65, 0.40],
  C: [1.00, 0.55, 0.30],
  S: [1.00, 0.70, 0.50],
  W: [0.70, 0.95, 1.00],
};

export function getSpectralColor(spectralType: string | null | undefined): [number, number, number] {
  if (!spectralType) return [1.0, 1.0, 1.0];
  const code = spectralType[0]?.toUpperCase();
  return SPECTRAL_COLORS[code] ?? [1.0, 1.0, 1.0];
}
