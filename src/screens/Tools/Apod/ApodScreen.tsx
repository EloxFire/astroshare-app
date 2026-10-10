import { Image, InteractionManager, ScrollView, View } from "react-native";
import { globalStyles } from "../../../helpers/globalStyles";
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { apodScreenStyles } from "./ApodScreen.styles";
import { getCurrentApod } from "../../../helpers/api/apod/apod";
import { Apod } from "../../../types/apod/Apod";

const ApodScreen = () => {

  const { t } = useTranslation("tools/apod");

  const [asset, setAsset] = useState<Apod | null>(null);

  useFocusEffect(
      useCallback(() => {
        StatusBar.setStyle("dark");
        return () => StatusBar.setStyle("light");
      }, [])
    );

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(async () => {
      // TODO: Load APOD data here
      const apod = await getCurrentApod();
      console.log(apod);
      setAsset(apod);
    });
    return () => task.cancel();
  }, []);

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t('screen.title')} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>

          {
            asset ? (
              <>
                {
                  asset.media_type === "image" && (
                    <Image
                      source={{ uri: asset.url }}
                      style={apodScreenStyles.image}
                    />
                  )
                }
                {
                  // asset.media_type === "video" && (
                  //   <Video
                  // )
                }
              </>
            ) : (
              <Image
                source={require('../../../../assets/images/placeholders/apod-placeholder.png')}
                style={apodScreenStyles.image}
              />
            )
          }

        </View>
      </ScrollView>
    </View>
  );
};

export default ApodScreen;