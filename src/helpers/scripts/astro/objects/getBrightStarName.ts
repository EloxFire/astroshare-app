export const getBrightStarName = (starIds: string): string => {
  const ids = starIds.split('|')

  const name = ids.find(id => id.includes('NAME'))

  if (name) {
    return name.split(' ').slice(1).join(' ')
  }

  return ids.find(id => id.includes('*'))!
}