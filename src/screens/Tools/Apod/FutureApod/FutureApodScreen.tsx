import { ScrollView, Text, useWindowDimensions, View } from "react-native"
import { globalStyles } from "../../../../helpers/globalStyles";
import { spacing, withOpacity } from "../../../../helpers/variables";
import { futureApodScreenStyles } from "./FutureApodScreen.styles";
import { ScreenHeader } from "../../../../components/ScreenHeader/ScreenHeader";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router";
import { Bell, Hourglass } from "lucide-react-native";
import { app_colors, flattenOpacity } from "../../../../helpers/variables";
import dayjs from "dayjs";
import { FutureApod } from "../../../../types/apod/FutureApod";
import { apodScreenStyles } from "../ApodScreen.styles";
import RenderHTML from "@native-html/render";
import InfoCard from "../../../../components/cards/InfoCard/InfoCard";
import SwitchInfoCard from "../../../../components/cards/SwitchInfoCard/SwitchInfoCard";

const FutureApodScreen = () => {

  const { t } = useTranslation("tools/apod");
  const params = useLocalSearchParams<{ nextAsset: string }>().nextAsset;
  const { width } = useWindowDimensions();

  const asset: FutureApod = params ? JSON.parse(params) : null;

  // Largeur dispo pour le HTML rendu : largeur d'écran moins le padding du screen (des deux
  // côtés) et celui du container description (lui aussi des deux côtés).
  const descriptionContentWidth = width - spacing.screen.horizontal * 2 - apodScreenStyles.screen.content.description.padding * 2;

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

          <View style={apodScreenStyles.screen.content.header}>
            <Text style={apodScreenStyles.screen.content.header.date}>{dayjs(asset?.post_date).format("dddd D MMMM YYYY")}</Text>
            <Text style={apodScreenStyles.screen.content.header.title}>{asset?.title}</Text>
            <Text style={apodScreenStyles.screen.content.header.copyright}>{asset?.copyright}</Text>
          </View>

          <View style={apodScreenStyles.screen.content.description}>
            <View style={apodScreenStyles.screen.content.description.header}>
              <Text style={apodScreenStyles.screen.content.description.header.title}>{t('screen.content.description.title')}</Text>
              <View style={apodScreenStyles.screen.content.description.header.translate}>
                {/* <Languages size={12} color={app_colors.accent.main} /> */}
                <Text style={apodScreenStyles.screen.content.description.header.translate.text}>{t('screen.content.description.language')}</Text>
              </View>
            </View>

            {asset?.alt && (
              <RenderHTML
                source={{ html: asset.alt }}
                contentWidth={descriptionContentWidth}
                baseStyle={apodScreenStyles.screen.content.description.text}
                // Les liens (<a>) ouvrent déjà le navigateur système par défaut (comportement
                // natif de la lib) — seul le style visuel est à préciser ici.
                tagsStyles={{ a: { color: app_colors.accent.main, textDecorationLine: "underline" } }}
              />
            )}
          </View>

          {/* TODO : Implement push notification */}
          <SwitchInfoCard
            title={t('upcoming.ping')}
            description={t('upcoming.pingSubtitle', { date: dayjs(asset?.post_date).fromNow() })}
            variant="dark"
            icon={Bell}
            additionnalContainerStyles={{borderWidth: 1, borderColor: withOpacity(app_colors.white, 0.5)}}
            isEnabled={false}
            onToggle={() => {}}
          />
        </View>
      </ScrollView>
    </View>
  )
}

export default FutureApodScreen;