export const formatKm = (km: number, lang: string) => {
  const formatter = new Intl.NumberFormat(lang, {
    style: 'unit',
    unit: 'kilometer',
    unitDisplay: 'short',
    maximumFractionDigits: 0
  });
  
  return formatter.format(km);
}

export const formatCelsius = (degree: number, lang: string) => {
  const formatter = new Intl.NumberFormat(lang, {
    style: 'unit',
    unit: 'celsius',
    unitDisplay: 'short',
    maximumFractionDigits: 0
  });
  
  return formatter.format(degree);
}

// Create a formater to display seconds in minutes
export const formatMinutes = (seconds: number, lang: string) => {
  const formatter = new Intl.NumberFormat(lang, {
    style: 'unit',
    unit: 'minute',
    unitDisplay: 'short',
    maximumFractionDigits: 0
  });
  
  return formatter.format(seconds / 60);
}

// Create a formater to display years. Based on the numeric value, the formater will display "year", "years", "million years" or "billion years"
export const formatYears = (years: number | string, lang: string) => {

  if(typeof years === 'string') {
    return "N/A";
  }

  const formatter = new Intl.NumberFormat(lang, {
    style: 'unit',
    unit: 'year',
    unitDisplay: 'short',
    maximumFractionDigits: 0,
    notation: "compact"
  });

  return formatter.format(years);
}