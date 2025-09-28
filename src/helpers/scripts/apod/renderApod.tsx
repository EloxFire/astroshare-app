import {APODPicture} from "../../types/APODPicture";
import {Image, Text, View} from "react-native";
import {computeContainAspect, MAX_MEDIA_WIDTH} from "./computeAspectRation";
import {apodStyles} from "../../../styles/screens/apod";
import {extractYouTubeId} from "./extractYoutubeId";
import YoutubePlayer from "react-native-youtube-iframe";
import {i18n} from "../i18n";

export const renderApodMedia = async (apod: APODPicture, currentLocale: string) => {
  switch (apod.media_type) {
    case "image": {
      const imageSize = await Image.getSize(apod.hdurl)
      const containAspect = computeContainAspect(imageSize.width, imageSize.height);
      return (
        <Image source={{uri: apod.hdurl}} style={[apodStyles.content.image, { width: MAX_MEDIA_WIDTH, aspectRatio: containAspect.aspectRatio }]} />
      )
    }
    case "video": {
      const videoId = extractYouTubeId(apod.url);
      if (!videoId) {
        throw new Error("Invalid YouTube URL");
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