import { ArrowRight, MapPin, TextAlignCenter } from "lucide-react-native"
import { useTranslation } from "react-i18next"
import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useAddObservatoryForm } from "../AddObservatoryFormContext";
import { globalStyles } from "../../../../../helpers/globalStyles"
import { app_colors, radius } from "../../../../../helpers/variables"
import { addNewObservatoryScreenStyles } from "../addNewObservatoryScreen.styles"
import { infoCardStyles } from "../../../../../components/cards/InfoCard/InfoCard.styles";
import { convertDecimalLatitudeToDMS } from "../../../../../helpers/location/convert";
import { InputWithIcon } from "../../../../../components/InputWithIcon/InputWithIcon";
import { useState } from "react";
import { addNewObservatoryStepTwoStyles } from "./StepTwo.styles";
import { getLightPollutionIndicatorDescription, getLightPollutionIndicatorLabel } from "../../../../../helpers/api/geocoding/geocoding";
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

const StepTwo = () => {

  const { t } = useTranslation("settings");
  const { setCurrentFormStep, newObservatory } = useAddObservatoryForm();

  const [displayName, setDisplayName] = useState(newObservatory?.display_name || "");
  const [bortleNumber, setBortleNumber] = useState(newObservatory?.light_pollution?.bortle || 4);
  const [sqm, setSQM] = useState(newObservatory?.light_pollution?.mpsas || 20.10);

  const handleSetDisplayName = () => {
    if(!newObservatory) return;
    newObservatory.display_name = displayName;
  }

  return (
    <ScrollView>
      <View style={[globalStyles.screen.content, {paddingBottom: 50}]}>

        <View style={[infoCardStyles.card, {backgroundColor: app_colors.accent.light, marginBottom: 20}]}>
          <MapPin size={24} color={app_colors.accent.main} />
          <View style={infoCardStyles.card.infos}>
            <Text style={[infoCardStyles.card.infos.title, {color: app_colors.primary.main}]}>{newObservatory!.name}</Text>
            <Text style={[infoCardStyles.card.infos.description, {color: app_colors.primary.main, fontFamily: "DMMonoRegular", fontSize: 10}]}>Bortle {newObservatory!.light_pollution?.bortle} - {convertDecimalLatitudeToDMS(newObservatory!.latitude)} - {convertDecimalLatitudeToDMS(newObservatory!.longitude)}</Text>
          </View>
          <TouchableOpacity onPress={() => setCurrentFormStep(1)}>
            <Text style={addNewObservatoryScreenStyles.editButton}>{t('addObservatory.stepTwo.stepOneSummary.edit')}</Text>
          </TouchableOpacity>
        </View>

        <InputWithIcon
          label={t("addObservatory.stepTwo.displayNameLabel")}
          value={displayName}
          action={() => handleSetDisplayName()}
          onChangeText={setDisplayName}
          placeholder={t("addObservatory.stepTwo.displayNamePlaceholder")}
        />

        <Text style={globalStyles.categoryTitle}>{t("addObservatory.stepTwo.skyQuality.title")}</Text>
        <View style={addNewObservatoryStepTwoStyles.skyQualityContainer}>
          <View style={addNewObservatoryStepTwoStyles.skyQualityContainer.header}>
            <Text style={addNewObservatoryStepTwoStyles.skyQualityContainer.header.bortleNumber}>{bortleNumber}</Text>
            <View style={{display: "flex", flexDirection: "column", justifyContent: "center", flex: 1}}>
              <Text style={addNewObservatoryStepTwoStyles.skyQualityContainer.header.bortleIndicator}>{getLightPollutionIndicatorLabel(bortleNumber)}</Text>
              <Text style={addNewObservatoryStepTwoStyles.skyQualityContainer.header.bortleDescription}>{getLightPollutionIndicatorDescription(bortleNumber)}</Text>
            </View>
          </View>

          <View style={addNewObservatoryStepTwoStyles.skyQualityContainer.bortleScale}>
            {
              [1,2,3,4,5,6,7,8,9].map((number) => (
                <TouchableOpacity key={number} onPress={() => setBortleNumber(number)} style={addNewObservatoryStepTwoStyles.skyQualityContainer.bortleScale.numberButton}>
                  <Text style={[addNewObservatoryStepTwoStyles.skyQualityContainer.bortleScale.numberButton.text, {color: number === bortleNumber ? app_colors.accent.main : app_colors.black}]}>{number}</Text>
                </TouchableOpacity>
              ))
            }
          </View>
          <View style={addNewObservatoryStepTwoStyles.skyQualityContainer.bortleScale.colorLine}>
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id="bortleGradient" x1="0" y1="0" x2="1" y2="0">
                  {Object.entries(app_colors.bortleScale).map(([level, color], index, entries) => (
                    <Stop key={level} offset={index / (entries.length - 1)} stopColor={color} />
                  ))}
                </LinearGradient>
              </Defs>
              {/* rx dessine les coins arrondis directement dans le SVG plutôt que de compter
                  sur un clip du conteneur (colorLine n'a pas overflow:"hidden"). Borné à la
                  moitié de la hauteur de la barre : au-delà, le rendu SVG clampe quand même le
                  rayon vertical mais garde le rayon horizontal tel quel, ce qui "mange" une
                  grosse portion de chaque extrémité de la barre au lieu d'un simple coin rond. */}
              <Rect
                width="100%"
                height="100%"
                rx={Math.min(radius.badge32, addNewObservatoryStepTwoStyles.skyQualityContainer.bortleScale.colorLine.height / 2)}
                fill="url(#bortleGradient)"
              />
            </Svg>
          </View>

          <View style={addNewObservatoryStepTwoStyles.skyQualityContainer.bortleScale.scaleExtremes}>
            <Text style={addNewObservatoryStepTwoStyles.skyQualityContainer.bortleScale.scaleExtremes.text}>{t("addObservatory.stepTwo.skyQuality.scaleExtremes.low")}</Text>
            <Text style={addNewObservatoryStepTwoStyles.skyQualityContainer.bortleScale.scaleExtremes.text}>{t("addObservatory.stepTwo.skyQuality.scaleExtremes.high")}</Text>
          </View>

          <View style={globalStyles.separator}/>

          <View style={addNewObservatoryStepTwoStyles.skyQualityContainer.bortleScale.sqmContainer}>
            <Text style={addNewObservatoryStepTwoStyles.skyQualityContainer.bortleScale.sqmContainer.text}>{t("addObservatory.stepTwo.skyQuality.sqm.label")}</Text>
            <Text style={addNewObservatoryStepTwoStyles.skyQualityContainer.bortleScale.sqmContainer.value}>{t("addObservatory.stepTwo.skyQuality.sqm.value", {sqm: sqm})}</Text>
          </View>
        </View>


        <Text style={globalStyles.categoryTitle}>{t("addObservatory.stepTwo.observatoryType.title")}</Text>
        <View style={addNewObservatoryStepTwoStyles.observatoryTypeContainer}>
        </View>


        <TouchableOpacity style={addNewObservatoryScreenStyles.nextButton}>
          <Text style={{color: app_colors.white, fontFamily: 'DMMonoMedium', fontSize: 16}}>{t("addObservatory.saveButton")}</Text>
          <ArrowRight color={app_colors.white} size={20} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default StepTwo