import { SuggestionCard } from "../../../types/suggestions/suggestionCard";

export const moonCalendarSuggestionsList: SuggestionCard[] = [
  {
    id: "formation",
    link: "/tools/moon-formation"
  }
];


export const getRandomMoonCalendarSuggestion = (): SuggestionCard => {
  const randomIndex = Math.floor(Math.random() * moonCalendarSuggestionsList.length);
  return moonCalendarSuggestionsList[randomIndex];
};