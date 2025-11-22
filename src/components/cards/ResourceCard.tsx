import { Text, TouchableOpacity, View } from "react-native"
import { Resource } from "../../helpers/types/resources/Resource"
import { ImageBackground } from "expo-image";
import { app_colors } from "../../helpers/constants";
import { resourceCardStyles } from "../../styles/components/cards/resourceCard";
import { LinearGradient } from "expo-linear-gradient";
import { generateResourceLevelText } from "../../helpers/scripts/resources/generateResourceLevelText";
import { readingTime } from 'reading-time-estimator'
import { useTranslation } from "../../hooks/useTranslation";
import { fr } from 'reading-time-estimator/i18n/fr'
import { useEffect, useState } from "react";
import { routes } from "../../helpers/routes";

interface ResourceCardProps {
  resource: Resource;
  navigation: any
}

export const ResourceCard = ({ resource, navigation }: ResourceCardProps) => {

  const { currentLocale } = useTranslation();
  const [readTime, setReadTime] = useState<string>("");

  useEffect(() => {
    if (currentLocale === "fr") {
      const frenchResult = readingTime(resource.content || "", {language: 'fr', translations: {fr}}).text;
      setReadTime(frenchResult);
    } else {
      const result = readingTime(resource.content || "").text;
      setReadTime(result);
    }
  }, [currentLocale])

  return (
    <TouchableOpacity
      style={{ marginBottom: 15, borderWidth: 1, borderColor: app_colors.white_twenty, borderRadius: 10, overflow: "hidden" }}
      onPress={() => navigation.navigate(routes.resources.details.path, { resource })}
    >
      <ImageBackground source={{ uri: resource.illustrationUrl }} style={resourceCardStyles.card} imageStyle={resourceCardStyles.card.image}>
        <LinearGradient colors={['transparent', app_colors.black]} locations={[0, 0.7]} style={resourceCardStyles.card.gradientContainer}>
          <Text style={resourceCardStyles.card.title}>{resource.title}</Text>
          <Text style={resourceCardStyles.card.description}>{resource.description}</Text>
          <View style={resourceCardStyles.card.level}>
            {generateResourceLevelText(resource.level)}
          </View>
          <View style={resourceCardStyles.card.timeToRead}>
            <Text style={resourceCardStyles.card.level.text}>{readTime}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  )
}
