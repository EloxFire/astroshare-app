
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

export type CameraValues = {
  fovWidthDeg: number
  fovHeightDeg: number
  pixelScaleArcSec: number
  effectiveFocalLengthMm: number
}

// Camera FOV uses the exact arctan formula — sensorSize is a physical measurement,
// not an empirically-defined apparent angle like eyepiece AFOV.
export const computeCameraValues = (
  fScopeMm: number,
  sensorWidthMm: number,
  sensorHeightMm: number,
  pixelSizeUm: number,
  barlowFactor: number,
): CameraValues => {
  const fl = fScopeMm * barlowFactor
  return {
    fovWidthDeg: 2 * Math.atan(sensorWidthMm / (2 * fl)) * (180 / Math.PI),
    fovHeightDeg: 2 * Math.atan(sensorHeightMm / (2 * fl)) * (180 / Math.PI),
    pixelScaleArcSec: (pixelSizeUm / fl) * 206.265,
    effectiveFocalLengthMm: fl,
  }
}

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
