export const getSearchedPlanet = (searchString: string): string => {
  switch (searchString.toLowerCase()) {
    case 'mercure':
    case 'mercury':
      return 'Mercury';
    case 'vénus':
    case 'venus':
      return 'Venus';
    case 'terre':
    case 'earth':
      return 'Earth';
    case 'mars':
      return 'Mars';
    case 'jupiter':
      return 'Jupiter';
    case 'saturne':
    case 'saturn':
      return 'Saturn';
    case 'uranus':
      return 'Uranus';
    case 'neptune':
      return 'Neptune';
  }
  return '';
}