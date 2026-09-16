import { radius } from "../../helpers/variables";

export const toastStyles = {
  toast: {
    position: "absolute" as const,
    bottom: 50,
    left: 20,
    right: 20,
    padding: 10,
    borderRadius: radius.heroCard,
    zIndex: 1000,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  }
}