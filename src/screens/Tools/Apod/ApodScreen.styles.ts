import { radius } from "../../../helpers/variables";

export const apodScreenStyles = {
  image: {
    width: "100%" as const,
    height: 200,
    resizeMode: "cover" as const,
    borderRadius: radius.heroCard,
  }
}