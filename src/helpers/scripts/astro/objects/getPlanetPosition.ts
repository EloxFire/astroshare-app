export const getPlanetPosition = (planet: string) => {
  switch (planet) {
    case 'Mercury':
      return 1;
    case 'Venus':
      return 2;
    case 'Mars':
      return 4;
    case 'Jupiter':
      return 5;
    case 'Saturn':
      return 6;
    case 'Uranus':
      return 7;
    case 'Neptune':
      return 8;
    default:
      return 0;
  }
}