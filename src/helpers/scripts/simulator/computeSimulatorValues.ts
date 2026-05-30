
export type SimulatorValues = {
  magnification: number
  tfovDeg: number
  exitPupilMm: number
  gMin: number
  gMax: number
}

export const computeMagnification = (
  fScopeMm: number,
  fEyeMm: number,
  barlowFactor: number,
): number => (fScopeMm * barlowFactor) / fEyeMm

// TFOV = AFOV / G — the industry-standard formula used by Stellarium and telescope
// manufacturers. AFOV is defined empirically by makers, making this ratio exact in
// practice. The arctan correction only applies when AFOV is defined via a specific
// optical projection model (not the case for commercial eyepiece specs).
export const computeTFOV = (afovDeg: number, magnification: number): number =>
  afovDeg / magnification

export const computeExitPupil = (diameterMm: number, magnification: number): number =>
  diameterMm / magnification

export const computeGMin = (diameterMm: number): number => diameterMm / 7

export const computeGMax = (diameterMm: number): number => diameterMm * 2

export const computeSimulatorValues = (
  fScopeMm: number,
  diameterMm: number,
  fEyeMm: number,
  afovDeg: number,
  barlowFactor: number,
): SimulatorValues => {
  const magnification = computeMagnification(fScopeMm, fEyeMm, barlowFactor)
  return {
    magnification,
    tfovDeg: computeTFOV(afovDeg, magnification),
    exitPupilMm: computeExitPupil(diameterMm, magnification),
    gMin: computeGMin(diameterMm),
    gMax: computeGMax(diameterMm),
  }
}
