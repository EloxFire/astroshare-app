import { Achievement } from "./Achievement";

export interface AchievementCategory {
  id: string;
  title: string;
  items: Achievement[];
}