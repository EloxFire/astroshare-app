export const lightpollution_bortle_colors: { [key: number]: string } = {
  1: '#000000', // Black – Bortle 1
  2: '#4A4A4A', // Dark grey – Bortle 2
  3: '#878787', // Grey – Bortle 3
  4: '#0064FF', // Blue – Bortle 4
  5: '#41A600', // Green – Bortle 5
  6: '#A3C000', // Yellow-green – Bortle 6
  7: '#E6C200', // Yellow – Bortle 7
  8: '#FF5A00', // Orange-red – Bortle 8
  9: '#FF0000', // Red – Bortle 9
  10: '#FFFFFF', // Optional: White highlight at the end of the scale
};

export const lightpollution_bortle_descriptions: { [key: string]: { title: string, description: string, color: string } } = {
  very_low: {
    title: 'Très faible (>21.7)',
    description: 'Ciel parfaitement noir',
    color: '#000000'
  },
  low: {
    title: 'Faible (21.7 - 20.5)',
    description: 'Ciel de campagne',
    color: '#0064FF'
  },
  moderate: {
    title: 'Modérée (20.5 - 19.5)',
    description: 'Ciel suburbain',
    color: '#41A600'
  },
  high: {
    title: 'Élevée (19.5 - 18.5)',
    description: 'Ciel urbain',
    color: '#E6C200'
  },
  very_high: {
    title: 'Très élevée (<18.5)',
    description: 'Centre ville',
    color: '#FF0000'
  }
};