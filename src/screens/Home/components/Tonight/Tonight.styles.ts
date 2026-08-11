import { gaps } from "../../../../helpers/variables";

export const tonightStyles = {
  container: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: gaps.sectionSeparator.after,

    header: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
    }
  }
}