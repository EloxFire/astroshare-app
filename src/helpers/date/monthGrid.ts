export const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
export const addMonths = (date: Date, delta: number) => new Date(date.getFullYear(), date.getMonth() + delta, 1);
export const dateKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
export const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export type MonthGridDay = { date: Date; inCurrentMonth: boolean };

// Grille Lundi→Dimanche couvrant le mois, complétée par les jours adjacents (hors mois, à griser
// côté affichage) pour remplir des semaines entières. Extrait de MonthView (calendrier lunaire) —
// réutilisé par le calendrier des lancements spatiaux.
export const buildMonthGrid = (monthStart: Date): MonthGridDay[] => {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (monthStart.getDay() + 6) % 7; // Lundi = 0 (getDay() renvoie Dimanche = 0)
  const lastWeekday = (new Date(year, month, daysInMonth).getDay() + 6) % 7;

  const days: MonthGridDay[] = [];
  for (let i = firstWeekday; i > 0; i--) days.push({ date: new Date(year, month, 1 - i), inCurrentMonth: false });
  for (let d = 1; d <= daysInMonth; d++) days.push({ date: new Date(year, month, d), inCurrentMonth: true });
  for (let i = 1; i <= 6 - lastWeekday; i++) days.push({ date: new Date(year, month, daysInMonth + i), inCurrentMonth: false });

  return days;
}

export const buildMonthWeeks = (monthStart: Date): MonthGridDay[][] => {
  const cells = buildMonthGrid(monthStart);
  const rows: MonthGridDay[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}
