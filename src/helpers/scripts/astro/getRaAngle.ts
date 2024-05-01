export const getRaAngleFromRaHour = (ra: string) => {
  const raParts = ra.split(':')
  const raHours = parseInt(raParts[0])
  const raMinutes = parseInt(raParts[1])
  const raSeconds = parseInt(raParts[2].split('.')[0])

  return (raHours + raMinutes / 60 + raSeconds / 3600) * 15
}