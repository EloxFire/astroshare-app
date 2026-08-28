import { radius } from "../../../../helpers/variables";

export const adddNewObservatoryScreenStyles = {
  mapContainer: {
      borderRadius: radius.heroCard,
      overflow: "hidden" as const,
      height: 250,
  
      map: {
        height: "100%" as const,
        width: "100%" as const,
      }
    },
}