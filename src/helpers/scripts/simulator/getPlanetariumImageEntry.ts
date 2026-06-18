import planetariumImages from '../../planetarium_images.json'

export type PlanetariumImageEntry = {
  imageUrl: string
  imageWidthDeg: number
  imageHeightDeg: number
}

// Finds the plate-solved image entry for a given Messier number.
// Angular dimensions are derived from the worldCoords corners stored in the JSON.
export const getPlanetariumImageEntry = (
  messierNumber: number | string,
): PlanetariumImageEntry | null => {
  const target = `m${messierNumber}.png`
  const entry = (planetariumImages as any).images.find((img: any) =>
    (img.imageUrl as string).includes(target),
  )
  if (!entry) return null

  const corners = entry.worldCoords[0] as [number, number][]
  // corners: [TL, TR, BR, BL] as [RA, Dec]
  const decCenterDeg = (corners[0][1] + corners[2][1]) / 2
  const imageWidthDeg =
    Math.abs(corners[1][0] - corners[0][0]) * Math.cos((decCenterDeg * Math.PI) / 180)
  const imageHeightDeg = Math.abs(corners[2][1] - corners[0][1])

  return {
    imageUrl: entry.imageUrl,
    imageWidthDeg,
    imageHeightDeg,
  }
}
