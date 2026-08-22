import { LucideIcon } from "lucide-react-native";

export type AstroshareTool = {
  toolId: string;
  toolName: string;
  ToolIcon: LucideIcon;
  access: "free" | "premium" | "partner" | "freemium";
  category?: string;
}