import { useCallback, useEffect } from "react"
import { ScrollView, Text, View } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router, useFocusEffect, useLocalSearchParams } from "expo-router"
import { useTranslation } from "react-i18next"
import { ScreenHeader } from "../../../../components/ScreenHeader/ScreenHeader"
import { globalStyles } from "../../../../helpers/globalStyles"
import { threeDModelsDetails, threeDModelsList } from "../../../../helpers/tools/3dviewer"
import { modelDetailsAdapters } from "./modelAdapters"
import { modelDetailsStyles } from "./ModelDetails.styles"
import ViewerSection from "./sections/ViewerSection/ViewerSection"
import TagsSection from "./sections/TagsSection/TagsSection"
import StatsSection from "./sections/StatsSection/StatsSection"
import DescriptionSection from "./sections/DescriptionSection/DescriptionSection"
import FunFactSection from "./sections/FunFactSection/FunFactSection"
import PointsOfInterestSection from "./sections/PointsOfInterestSection/PointsOfInterestSection"
import RelatedModelsSection from "./sections/RelatedModelsSection/RelatedModelsSection"
import SourceFooter from "./sections/SourceFooter/SourceFooter"

// Orchestrateur : récupère le modèle et ses détails, puis assemble les sections. Chaque section
// gère son propre contenu (styles, i18n, logique) — voir ./sections. Les comportements propres à
// un modèle précis (stats en direct, carte additionnelle) viennent de ./modelAdapters, jamais
// d'un if/else ici : ajouter un modèle spécial = ajouter un adaptateur, pas modifier ce fichier.
const ModelDetails = () => {

  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle("dark");
      return () => StatusBar.setStyle("light");
    }, [])
  );

  const { t } = useTranslation("tools/3dviewer");

  const modelId = useLocalSearchParams().index as string;
  const model = threeDModelsList.find((item) => item.id === modelId);
  const details = model ? threeDModelsDetails[model.id] : undefined;
  const adapter = model ? modelDetailsAdapters[model.id] : undefined;

  // Modèle introuvable (id invalide) : retour à la liste plutôt qu'un écran cassé. Pas dans le
  // corps du rendu directement : ça déclencherait une navigation pendant le rendu de ce composant.
  useEffect(() => {
    if (!model) {
      router.push("/tools/3d-viewer");
    }
  }, [model]);

  if (!model) {
    return null;
  }

  const now = new Date();
  const liveStatValues = adapter?.resolveLiveStats?.(now) ?? {};

  const relatedModels = (details?.relatedModelIds ?? [])
    .map((id) => threeDModelsList.find((item) => item.id === id))
    .filter((item) => item !== undefined);

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader
        title={t(`modelNames.${model.id}`)}
        subtitle={`${t("title")} · ${t(`modelCategories.${model.category}`)}`}
        main={false}
      />

      <ScrollView>
        <View style={[globalStyles.content, { gap: 20 }]}>

          <View>
            <ViewerSection model={model} />

            <View>
              <Text style={modelDetailsStyles.name}>{t(`modelNames.${model.id}`)}</Text>
              <Text style={modelDetailsStyles.shortDescription}>{t(`modelDescriptions.${model.id}`)}</Text>
            </View>

            {details && details.tagKeys.length > 0 && (
              <TagsSection tagKeys={details.tagKeys} />
            )}
          </View>

          {adapter?.ExtraContent && <adapter.ExtraContent now={now} />}

          {details && details.stats.length > 0 && (
            <StatsSection stats={details.stats} liveStatValues={liveStatValues} />
          )}

          <DescriptionSection modelId={model.id} />

          {details?.hasFunFact && (
            <FunFactSection modelId={model.id} />
          )}

          {details && details.pointsOfInterest && details.pointsOfInterest.length > 0 && (
            <PointsOfInterestSection pointsOfInterest={details.pointsOfInterest} />
          )}

          {relatedModels.length > 0 && (
            <RelatedModelsSection relatedModels={relatedModels} />
          )}

          {model.source && (
            <SourceFooter source={model.source} />
          )}

        </View>
      </ScrollView>
    </View>
  )
}

export default ModelDetails
