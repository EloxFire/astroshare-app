export const doesStarHaveName = (starIds: string): boolean => {
  const ids = starIds.split('|');
  const name = ids.find(id => id.includes('NAME') || id.includes('Lodestar') || id.includes('Polaris'));
  return !!name;
}