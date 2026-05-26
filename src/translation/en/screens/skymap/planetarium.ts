const loadingStepsTranslations = {
  scene: {
    WAIT:  { title: 'Scene bootstrap',         detail: 'Waiting for the WebGL context' },
    LIVE:  { title: 'Scene bootstrap',         detail: 'Creating 3D scene, camera and renderer' },
    DONE:  { title: 'Scene bootstrap',         detail: '3D scene, camera and renderer ready' },
    ERROR: { title: 'Scene bootstrap',         detail: 'Failed during 3D scene initialisation' },
  },
  background: {
    WAIT:  { title: 'Background dome',         detail: 'Milky Way texture loading not started yet' },
    LIVE:  { title: 'Background dome',         detail: 'Loading and preparing the Milky Way texture' },
    DONE:  { title: 'Background dome',         detail: 'Milky Way texture applied to the sky dome' },
    ERROR: { title: 'Background dome',         detail: 'Failed to load or prepare the Milky Way texture' },
  },
  ground: {
    WAIT:  { title: 'Horizon mask',            detail: 'Local ground dome not generated yet' },
    LIVE:  { title: 'Horizon mask',            detail: "Computing local horizon from observer's position" },
    DONE:  { title: 'Horizon mask',            detail: 'Local horizon aligned with zenith and north' },
    ERROR: { title: 'Horizon mask',            detail: 'Failed to build or align the horizon mask' },
  },
  atmosphere: {
    WAIT:  { title: 'Atmosphere shader',       detail: 'Atmospheric sky preparation not started yet' },
    LIVE:  { title: 'Atmosphere shader',       detail: 'Computing solar uniforms and creating atmosphere dome' },
    DONE:  { title: 'Atmosphere shader',       detail: 'Atmosphere initialised with sky colours and opacity' },
    ERROR: { title: 'Atmosphere shader',       detail: 'Failed to initialise the atmosphere shader or dome' },
  },
  constellations: {
    WAIT:  { title: 'Constellation overlays',  detail: 'Constellation lines and labels not prepared yet' },
    LIVE:  { title: 'Constellation overlays',  detail: 'Generating lines and loading constellation labels' },
    DONE:  { title: 'Constellation overlays',  detail: 'Constellation lines and labels ready' },
    ERROR: { title: 'Constellation overlays',  detail: 'Failed to load constellation lines or labels' },
  },
  compass: {
    WAIT:  { title: 'Compass labels',          detail: 'Cardinal markers not loaded yet' },
    LIVE:  { title: 'Compass labels',          detail: 'Loading and positioning N, E, S and W markers' },
    DONE:  { title: 'Compass labels',          detail: 'Cardinal markers positioned on the horizon' },
    ERROR: { title: 'Compass labels',          detail: 'Failed to load or position compass markers' },
  },
  stars: {
    WAIT:  { title: 'Star field',              detail: 'Star catalog not projected yet' },
    LIVE:  { title: 'Star field',              detail: 'Projecting stars and creating GPU buffers' },
    DONE:  { title: 'Star field',              detail: 'Star cloud generated and shader ready' },
    ERROR: { title: 'Star field',              detail: 'Failed to create the star field' },
  },
  planets: {
    WAIT:  { title: 'Planets',                 detail: 'Planet meshes not created yet' },
    LIVE:  { title: 'Planets',                 detail: 'Creating planet meshes and textures' },
    DONE:  { title: 'Planets',                 detail: 'Planet meshes ready' },
    ERROR: { title: 'Planets',                 detail: 'Failed to create planet meshes' },
  },
  moon: {
    WAIT:  { title: 'Moon',                    detail: 'Moon mesh not prepared yet' },
    LIVE:  { title: 'Moon',                    detail: 'Creating moon mesh and loading textures' },
    DONE:  { title: 'Moon',                    detail: 'Moon mesh and normal map ready' },
    ERROR: { title: 'Moon',                    detail: 'Failed to create the Moon' },
  },
  sun: {
    WAIT:  { title: 'Sun',                     detail: 'Sun mesh not prepared yet' },
    LIVE:  { title: 'Sun',                     detail: 'Creating solar disk and glow' },
    DONE:  { title: 'Sun',                     detail: 'Sun and luminous halo initialised' },
    ERROR: { title: 'Sun',                     detail: 'Failed to create the Sun or its halo' },
  },
  dso: {
    WAIT:  { title: 'Deep-sky objects',        detail: 'DSO textures and meshes not prepared yet' },
    LIVE:  { title: 'Deep-sky objects',        detail: 'Creating DSO billboards and queuing remote textures' },
    DONE:  { title: 'Deep-sky objects',        detail: 'Deep-sky object group ready' },
    ERROR: { title: 'Deep-sky objects',        detail: 'Failed to create deep-sky objects' },
  },
  grids: {
    WAIT:  { title: 'Coordinate grids',        detail: 'Azimuthal and equatorial grids not generated yet' },
    LIVE:  { title: 'Coordinate grids',        detail: 'Generating azimuthal and equatorial grids' },
    DONE:  { title: 'Coordinate grids',        detail: 'Coordinate grids ready' },
    ERROR: { title: 'Coordinate grids',        detail: 'Failed to generate coordinate grids' },
  },
  finalize: {
    WAIT:  { title: 'Final assembly',          detail: 'Scene not assembled yet' },
    LIVE:  { title: 'Final assembly',          detail: 'Assembling scene graph and preparing first render' },
    DONE:  { title: 'Final assembly',          detail: 'Scene ready for first interactive display' },
    ERROR: { title: 'Final assembly',          detail: 'Failed during final scene assembly' },
  },
} as const;

export const planetariumTranslations = {
  title: '3D Interactive Planetarium',
  subTitle: '// Explore the sky interactively!',
  loading: {
    title: 'Loading planetarium',
    subtitle: 'Preparing, please wait…',
    progressMeta: 'Progress: {{progress}}%',
    completedSteps: 'Completed steps: {{completed}} / {{total}}',
    detailedSteps: 'Step details',
    liveActivity: 'Live activity',
    failedTitle: 'Planetarium initialisation failed',
    badges: {
      WAIT:  'WAIT',
      LIVE:  'LIVE',
      DONE:  'DONE',
      ERROR: 'ERROR',
    },
    steps: loadingStepsTranslations,
  },
};
