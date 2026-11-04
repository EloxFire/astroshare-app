import { getLunarDistance } from "@observerly/astrometry";
import { ModelDetailsAdapter } from "../types";
import MoonTonightCard from "./MoonTonightCard";

export const moonAdapter: ModelDetailsAdapter = {
  // getLunarDistance renvoie des mètres, d'où le /1000 (la stat "distance" est en km).
  resolveLiveStats: (now) => ({ distance: getLunarDistance(now) / 1000 }),
  ExtraContent: MoonTonightCard,
};
