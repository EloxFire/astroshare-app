import {APODPicture} from "../../types/APODPicture";
import {Image, Text, View} from "react-native";
import {computeContainAspect, MAX_MEDIA_WIDTH} from "./computeAspectRation";
import {apodStyles} from "../../../styles/screens/apod";
import {extractYouTubeId} from "./extractYoutubeId";
import YoutubePlayer from "react-native-youtube-iframe";
import {i18n} from "../i18n";
import { ReactNode } from "react";
import SimpleButton from "../../../components/commons/buttons/SimpleButton";
import * as Linking from 'expo-linking';
import { app_colors } from "../../constants";

export const renderApodMedia = async (apod: APODPicture, currentLocale: string) => {


  switch (apod.media_type) {
    case "image": {
      const imageExtensions = ['.png', '.jpg', '.jpeg'];
      const url = imageExtensions.some(ext => apod.hdurl.toLowerCase().endsWith(ext)) ? apod.hdurl : apod.url;
      const imageSize = await Image.getSize(url)
      const containAspect = computeContainAspect(imageSize.width, imageSize.height);

      console.log("Image URL selected:", url);
      console.log("Image aspect ratio:", containAspect.aspectRatio);
      
      return (
        <Image source={{uri: url}} style={[apodStyles.content.image, { width: MAX_MEDIA_WIDTH, aspectRatio: containAspect.aspectRatio }]} />
      )
    }
    case "video": {
      const videoId = extractYouTubeId(apod.url);
      if (!videoId) {
        console.log("Invalid Youtube ID");
        
        return (
          <View style={apodStyles.content.errorContainer}>
            <View style={apodStyles.content.errorBox}>
              <Text style={apodStyles.content.loadingText}>
                {i18n.t('apod.errors.invalidVideoUrl', { url: apod.url })}
              </Text>
            </View>

            <SimpleButton
              text={i18n.t('apod.errors.redirectUrl', { url: apod.url })}
              onPress={() => {
                Linking.openURL(apod.url);
              }}
              backgroundColor={app_colors.white_twenty}
              textColor={app_colors.white}
              icon={require('../../../../assets/icons/FiPlay.png')}
            />
          </View>
        )
      }
      return (
        <YoutubePlayer
          height={300}
          width={MAX_MEDIA_WIDTH}
          play={false}
          videoId={videoId}
          webViewStyle={{ opacity: 0.99 }}
          onError={(e: unknown) => console.error("YouTube Player Error:", e)}
        />
      )
    }
    case "other": {
      return (
        <View style={apodStyles.content.errorBox}>
          <Text style={apodStyles.content.loadingText}>
            {i18n.t('apod.errors.unsupportedMediaType')}
          </Text>
        </View>
      )
    }
  }
}