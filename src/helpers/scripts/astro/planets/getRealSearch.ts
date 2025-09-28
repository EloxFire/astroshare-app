const polarisRegex = /\b([ÉE]toile [Pp]olaire|[Pp]olaris)\b/

export const getRealSearch = (searchString: string): string => {
  switch (searchString.toLowerCase()) {
    // Planets
    case 'mercure':
      return 'Mercury';
    case 'mercury':
      return 'Mercury';
    case 'vénus':
      return 'Venus';
    case 'venus':
      return 'Venus';
    case 'terre':
      return 'Earth';
    case 'earth':
      return 'Earth';
    case 'mars':
      return 'Mars';
    case 'jupiter':
      return 'Jupiter';
    case 'saturne':
      return 'Saturn';
    case 'saturn':
      return 'Saturn';
    case 'uranus':
      return 'Uranus';
    case 'neptune':
      return 'Neptune';
  }

  // if(polarisRegex.test(searchString)) { return 'TIC 303256075'; }

  // If the search string does not match any case, return the original search string
  return searchString;
}