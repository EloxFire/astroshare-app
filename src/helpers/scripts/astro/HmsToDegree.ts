export const HmsToDegree = (hms: string, type: 'ra' | 'dec') => {
  if (type === 'dec') {
    const [degrees, minutes, seconds] = hms.split(':').map(Number);
    return degrees + (minutes / 60) + (seconds / 3600);
  } else {
    const [hours, minutes, seconds] = hms.split(':').map(Number);
    return (hours + (minutes / 60) + (seconds / 3600)) * 15;
  }
}