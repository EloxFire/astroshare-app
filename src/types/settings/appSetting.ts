import { LucideIcon } from "lucide-react-native";
import { AppSettingCategory } from "./settingCategory";

export type AppSetting = {
  id: string;
  name: string;
  description: string;
  route: string;
  category: AppSettingCategory["id"];
  icon: LucideIcon;
}