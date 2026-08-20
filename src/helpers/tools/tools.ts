import { MoonIcon, StarsIcon } from "lucide-react-native";
import { AstroshareTool } from "../../types/tools/astroshareTool";

export const toolsList: AstroshareTool[] = [
  // Moon phases calendar
  {
    toolId: "moon-phases-calendar",
    toolName: "Lune",
    ToolIcon: MoonIcon, // Replace with the actual icon import
    category: "prepare",
  },
  {
    toolId: "polar-align",
    toolName: "Alignement polaire",
    ToolIcon: StarsIcon, // Replace with the actual icon import
    category: "prepare",
  }
]