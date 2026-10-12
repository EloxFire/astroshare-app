import { ScrollView, Text, View } from "react-native"
import { globalStyles } from "../../../../helpers/globalStyles";
import { futureApodScreenStyles } from "./FutureApodScreen.styles";
import { ScreenHeader } from "../../../../components/ScreenHeader/ScreenHeader";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router";
import { Hourglass } from "lucide-react-native";
import { app_colors, flattenOpacity } from "../../../../helpers/variables";
import dayjs from "dayjs";
import { FutureApod } from "../../../../types/apod/FutureApod";

const FutureApodScreen = () => {

  const { t } = useTranslation("tools/apod");
  const params = useLocalSearchParams<{ nextAsset: string }>().nextAsset;

  const asset: FutureApod = params ? JSON.parse(params) : null;

  return (
    <View style={[globalStyles.screen, futureApodScreenStyles.screen]}>
      <ScreenHeader title={t('screen.title')} main={false} noBackground={true} />

      <ScrollView>
        <View style={globalStyles.content}>
          <View style={futureApodScreenStyles.screen.countdown}>
            <Hourglass size={50} color={flattenOpacity(app_colors.white, 0.5, app_colors.primary.main)} />
            <Text style={futureApodScreenStyles.screen.countdown.subtitle}>{t('upcoming.publish')}</Text>
            <Text style={futureApodScreenStyles.screen.countdown.time}>{dayjs(asset?.post_date).fromNow(true)}</Text>
                <Text style={futureApodScreenStyles.screen.countdown.date}>{dayjs(asset?.post_date).format('ddd D MMM - HH:mm')}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default FutureApodScreen;