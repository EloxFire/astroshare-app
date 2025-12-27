export const planetariumRenderOrders = {
  background: -80,
  dso: -70,
  planets: -50,
  moon: -40,
  atmosphere: -30,
  stars: -20,
  azGrid: -10,
  eqGrid: -9,
  constellations: -5,
  labels: -2,
  ground: 11,
  selectionCircle: 12,
}

export const meshGroupsNames = {
  background: 'background',
  stars: 'stars',
  planets: 'planets',
  sun: 'sun',
  moon: 'moon',
  dso: 'dso',
  constellations: 'constellations',
  ground: 'ground',
  atmosphere: 'atmosphere',
  selectionCircle: 'selectionCircle',
  azGrid: 'azGrid',
  eqGrid: 'eqGrid',
  compassLabels: 'compassLabels',
  labels: {
    stars: 'starLabels',
    planets: 'planetLabels',
    dso: 'dsoLabels',
  }
}
