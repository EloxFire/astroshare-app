export const getDecAngleDromDecHour = (dec: string) => {
  const decParts = dec.split(':')
  const decDegrees = parseInt(decParts[0])
  const decMinutes = parseInt(decParts[1])
  const decSeconds = parseInt(decParts[2].split('.')[0])
  const decSign = decDegrees > 0 ? 1 : -1

  return decSign * (decDegrees + decMinutes / 60 + decSeconds / 3600)
}