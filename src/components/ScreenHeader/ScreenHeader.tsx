import { Image, Text, TouchableOpacity, View } from "react-native";
import { router, usePathname } from "expo-router";
import { ChevronLeft, User, UserCircle, UserCircle2 } from "lucide-react-native";
import { app_colors } from "../../helpers/variables";
import { screenHeaderStyles } from "./ScreenHeader.styles";
import { SafeAreaView } from "react-native-safe-area-context";
import AstroshareFullLogo from "../../../assets/logos/astroshare_full_no_slogan.svg";

interface ScreenHeaderProps {
  title: string;
}

export const ScreenHeader = ({ title }: ScreenHeaderProps) => {
  const canGoBack = router.canGoBack();
  const pathname = usePathname();

  const isHomeScreen = pathname === "/";

  return (
      <SafeAreaView style={screenHeaderStyles.container}>
        {
          isHomeScreen && (
            <View style={screenHeaderStyles.container.homeHeader}>
              <AstroshareFullLogo width={120} height={30} />
              
              <TouchableOpacity onPress={() => router.push("/profile")}>
                <UserCircle color={app_colors.white} size={24} />
              </TouchableOpacity>
            </View>
          )
        }

        <View style={screenHeaderStyles.container.titleContainer}>
          {canGoBack && (
            <TouchableOpacity style={screenHeaderStyles.backButton} onPress={() => router.back()}>
              <ChevronLeft color={app_colors.white} size={24} />
            </TouchableOpacity>
          )}
          <View >
            <Text style={screenHeaderStyles.container.titleContainer.title}>{title}</Text>
          </View>
        </View>
      </SafeAreaView>
    );
};
