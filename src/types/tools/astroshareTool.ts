import { LucideIcon } from "lucide-react-native";

export type AstroshareTool = {
  id: string;
  icon: LucideIcon;
  access: "free" | "premium" | "partner" | "freemium";
  route: string;
  category?: string;
}