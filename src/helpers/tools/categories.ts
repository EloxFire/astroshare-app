import { AstroshareToolCategory } from "../../types/tools/toolCategory";
import { app_colors } from "../variables";

export const toolCategories: AstroshareToolCategory[] = [
  {
    id: "prepare",
    defaultOrder: 1,
    color: app_colors.accent.light,
  },
  {
    id: "observe",
    defaultOrder: 2,
    color: app_colors.yellow.light,
  },
  {
    id: "follow-up",
    defaultOrder: 3,
    color: app_colors.accent.light,
  },
  {
    id: "learn",
    defaultOrder: 4,
    color: app_colors.yellow.light,
  }
];