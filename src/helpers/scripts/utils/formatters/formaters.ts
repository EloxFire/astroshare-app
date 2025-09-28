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

// Create a formatter for short notation and add 'K' for Kelvin manually
export const formatKelvinShort = (kelvin: number, lang: string) => {

  // Use Intl.NumberFormat for compact notation
  const formatter = new Intl.NumberFormat(lang, {
    style: 'decimal', // Default style as 'unit' with 'kelvin' is unsupported
    maximumFractionDigits: 0,
    notation: "compact",
  });

  // Format the number and append 'K' for Kelvin
  return `${formatter.format(kelvin)} K`;
};

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

export const formatDays = (days: number, lang: string) => {
  const formatter = new Intl.NumberFormat(lang, {
    style: 'unit',
    unit: 'day',
    unitDisplay: 'short',
    maximumFractionDigits: 0
  });

  return formatter.format(days);
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

// Create a formater for euro currency
export const formatEuro = (amount: number, lang: string) => {
  const formatter = new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2
  });

  return formatter.format(amount);
}