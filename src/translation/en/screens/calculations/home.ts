export const calculationHomeTranslation = {
  title: "Calculations",
  subtitle: "Astronomical calculators",
  intro: "Enter the data you have. The calculator takes care of the rest !",
  units: {
    mm: "mm",
    inch: "inch",
  },
  actions: {
    compute: "Compute",
    reset: "Clear",
    missingValues: "Please provide at least two values",
  },
  sections: {
    instrument: {
      title: "Instrument",
      subtitle: "Focal length, aperture and unit",
      focalLabel: "Telescope focal length",
      focalPlaceholder: "Enter in {{unit}}",
      diameterLabel: "Telescope diameter",
      unitLabel: "Unit",
    },
    eyepiece: {
      title: "Eyepiece & field",
      subtitle: "Visual parameters",
      focalLabel: "Eyepiece focal length",
      focalPlaceholder: "Focal length (mm)",
      fieldLabel: "Eyepiece field",
      fieldPlaceholder: "Field (°)",
    },
    camera: {
      title: "Camera & comfort",
      subtitle: "Pixel size and exit pupil",
      pixelLabel: "Camera pixel size",
      pixelPlaceholder: "µm",
      exitPupilLabel: "Exit pupil for min. magnification",
    },
    results: {
      title: "Results",
      subtitle: "Detailed formulas and numeric values",
      cards: {
        focalRatio: {
          title: "Focal ratio",
          description: "Instrument f/D ratio.",
          fallbackNote: "F = instrument focal length and D = instrument diameter",
        },
        magnification: {
          title: "Magnification",
          description: "Magnification with the selected eyepiece.",
          fallbackNote: "F = instrument focal length and f = eyepiece focal length",
        },
        minMagnification: {
          title: "Minimum magnification",
          description: "Magnification tied to the chosen exit pupil.",
          fallbackNote: "D = instrument diameter and {{pupil}} mm = chosen exit pupil",
        },
        sampling: {
          title: "Sampling",
          description: "Arcseconds per pixel.",
          fallbackNote: "p = camera pixel size (µm) and F = instrument focal length (mm)",
        },
        fov: {
          title: "True field",
          description: "Resulting field of view (arcminutes).",
          fallbackNote: "C = eyepiece field (°) and G = magnification",
        },
        exitPupil: {
          title: "Exit pupil",
          description: "Exit pupil diameter (mm).",
          fallbackNote: "D = instrument diameter (mm) and G = magnification",
        },
        resolvingPower: {
          title: "Resolving power",
          description: "Ability to separate close targets (arcseconds).",
          fallbackNote: "D = instrument diameter (mm)",
        }
      }
    }
  }
};
