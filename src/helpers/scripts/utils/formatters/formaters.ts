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

// NOT WORKING
export const formatOrdinal = (number: number, lang: string) => {
  const formatter = new Intl.NumberFormat(lang, {
    style: 'unit',
    unit: 'ordinal',
    unitDisplay: 'short',
    maximumFractionDigits: 0
  });
  
  return formatter.format(number);
}