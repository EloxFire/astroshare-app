export const getPlanetMagnitude = (planet: string): number => {
  switch (planet) {
    case 'Mercury':
      return -2.4;
    case 'Venus':
      return -4.6;
    case 'Mars':
      return -2.9;
    case 'Jupiter':
      return -2.9;
    case 'Saturn':
      return -0.4;
    case 'Uranus':
      return -5.3;
    case 'Neptune':
      return -7.8;
    default:
      return 0;
  }
}