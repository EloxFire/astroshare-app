export const shortDmsCoord = (coord: string): string => {
  const shorten = `${coord.split(' ')[0]}${coord.split(' ')[1]} ${coord.split(' ')[3]}`;
  return shorten;
}