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
import { observatoriesAccessTypes, observatoriesEquipments, observatoriesTypes } from "../../../../../helpers/observatories/observatories";
import { ObservatoryEquipment, ObservatoryType } from "../../../../../types/observatory";
import { getBortleMpsas } from "../../../../../helpers/lightPollution/lightPollution";
import { useUserDataStore } from "../../../../../store/userData.store";
import { router } from "expo-router";
import { generateCustomId } from "../../../../../helpers/ids";
// import { pickAndCompressImage, ImagePickerPermissionDeniedError } from "../../../../../helpers/images/imagePicker";



const StepTwo = () => {


  const { t } = useTranslation("settings");
  const addObservatory = useUserDataStore(state => state.addObservatory)
  const { setCurrentFormStep, newObservatory } = useAddObservatoryForm();

  const [displayName, setDisplayName] = useState(newObservatory?.display_name || "");
  const [bortleNumber, setBortleNumber] = useState(newObservatory?.light_pollution?.bortle || 4);
  const [sqm, setSQM] = useState((newObservatory?.light_pollution?.mpsas || getBortleMpsas(bortleNumber)).toString());
  const [observatoryType, setObservatoryType] = useState<ObservatoryType>("home");
  const [observatoryEquipment, setObservatoryEquipment] = useState<ObservatoryEquipment[]>([]);
  const [tags, setTags] = useState<string[]>(newObservatory?.tags || []);
  const [altitude, setAltitude] = useState<number | null>(newObservatory?.elevation ? parseFloat(newObservatory.elevation.toFixed(0)) : null);
  const [isShared, setIsShared] = useState<boolean>(newObservatory?.shared || false);
  const [access, setAccess] = useState<"car" | "foot">(newObservatory?.access || "car");
  const [image, setImage] = useState<string | undefined>(newObservatory?.image);

  // Largeur exacte des boutons de type d'observatoire (2 colonnes), calculée à partir de la
  // largeur réelle mesurée du conteneur — un width en "%" ne peut pas garantir un gap strict en
  // pixels entre les éléments (le gap s'ajoute par-dessus le %, il n'en est jamais déduit).
  const [observatoryChipsContainerWidth, setObservatoryChipsContainerWidth] = useState(0);
  const observatoryTypeButtonGap = 10;
  const observatoryTypeButtonWidth = observatoryChipsContainerWidth > 0
    ? (observatoryChipsContainerWidth - observatoryTypeButtonGap) / 2
    : undefined;

  const handleSetDisplayName = () => {
    if(!newObservatory) return;
    newObservatory.display_name = displayName;
  }

  const handleSetAltitude = () => {
    if(!newObservatory) return;
    newObservatory.elevation = altitude;
  }

  const handleObservatoryEquipmentSelection = (equipment: ObservatoryEquipment) => {
    if(!newObservatory) return;

    const currentEquipment = newObservatory.equipment || [];
    const isSelected = currentEquipment.includes(equipment);

    if(isSelected) {
      // Retirer l'équipement sélectionné
      newObservatory.equipment = currentEquipment.filter((item) => item !== equipment);
    } else {
      // Ajouter l'équipement sélectionné
      newObservatory.equipment = [...currentEquipment, equipment];
    }

    setObservatoryEquipment(newObservatory.equipment);
  }

  const handleManualBortleChange = (newBortle: number) => {
    setBortleNumber(newBortle);
    setSQM(getBortleMpsas(newBortle).toString());
  }

  // const handlePickImage = async () => {
  //   try {
  //     const result = await pickAndCompressImage({ aspectRatio: [4, 3] }); // ou sans aspectRatio pour ne pas forcer de recadrage
  //     if (!result) return; // utilisateur a annulé la sélection
  //     setImage(result.base64);
  //     if (newObservatory) newObservatory.image = result.base64;
  //   } catch (err) {
  //     if (err instanceof ImagePickerPermissionDeniedError) {
  //       // afficher un message du style "Autorise l'accès à tes photos dans les réglages"
  //     }
  //   }
  // };

  const handleSubmitObservatory = () => {
    if(!newObservatory) return;
    newObservatory.id = generateCustomId();
    newObservatory.shared = false; // Par défaut, un nouvel observatoire est privé
    newObservatory.createdAt = new Date().toISOString();
    newObservatory.updatedAt = new Date().toISOString();
    newObservatory.display_name = displayName;
    newObservatory.elevation = altitude;
    newObservatory.access = access;
    newObservatory.light_pollution = {
      bortle: bortleNumber,
      mpsas: parseFloat(sqm),
    };
    newObservatory.type = observatoryType;
    newObservatory.equipment = observatoryEquipment;
    newObservatory.tags = tags;

    console.log("Soumission du nouvel observatoire :", JSON.stringify(newObservatory, null, 2));

    addObservatory(newObservatory);
    router.push("/settings/observatories");
  }



  return (
    <ScrollView>
      <View style={[globalStyles.screen.content, {paddingBottom: 50, gap: 20}]}>

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

        <InputWithIcon
          label={t("addObservatory.stepTwo.elevationLabel")}
          value={altitude !== null ? altitude.toString() : ""}
          action={() => handleSetAltitude()}
          onChangeText={(text) => setAltitude(text ? parseFloat(text) : null)}
          placeholder={t("addObservatory.stepTwo.elevationPlaceholder")}
          keyboardType="numeric"
        />

        <InputWithIcon
          label={t("addObservatory.stepTwo.tagsLabel")}
          value={tags.join(", ")}
          action={() => {}}
          onChangeText={(text) => {
            const newTags = text.split(",").map(tag => tag.trim());
            setTags(newTags);
            if(newObservatory) newObservatory.tags = newTags;
          }}
          placeholder={t("addObservatory.stepTwo.tagsPlaceholder")}
        />

        <View style={{display: "flex", flexDirection: "column", gap: 5}}>
          <Text style={globalStyles.categoryTitle}>{t("addObservatory.stepTwo.skyQuality.title")}</Text>
        </View>

        <View style={{display: "flex", flexDirection: "column", gap: 5}}>
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
                  <TouchableOpacity key={number} onPress={() => handleManualBortleChange(number)} style={[addNewObservatoryStepTwoStyles.skyQualityContainer.bortleScale.numberButton, number === bortleNumber ? addNewObservatoryStepTwoStyles.skyQualityContainer.bortleScale.numberButton.active : {}]}>
                    <Text style={[addNewObservatoryStepTwoStyles.skyQualityContainer.bortleScale.numberButton.text, number === bortleNumber ? addNewObservatoryStepTwoStyles.skyQualityContainer.bortleScale.numberButton.text.active : {}]}>{number}</Text>
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
        </View>

        <View style={{display: "flex", flexDirection: "column", gap: 5}}>
          <Text style={globalStyles.categoryTitle}>{t("addObservatory.stepTwo.observatoryAccess.title")}</Text>

          <View
            style={addNewObservatoryStepTwoStyles.observatoryChipContainer}
            onLayout={(event) => setObservatoryChipsContainerWidth(event.nativeEvent.layout.width)}
          >
            {
              observatoriesAccessTypes.map(({id, label, icon: Icon}) => {
                return (
                  <TouchableOpacity
                    key={id}
                    style={[
                      addNewObservatoryStepTwoStyles.observatoryChipContainer.chipButton,
                      observatoryTypeButtonWidth != null && { width: observatoryTypeButtonWidth },
                      access === id && addNewObservatoryStepTwoStyles.observatoryChipContainer.chipButton.active,
                    ]}
                    onPress={() => {
                      setAccess(id as "car" | "foot");
                      if(newObservatory) newObservatory.access = id as "car" | "foot";
                    }}
                  >
                    <Icon size={20} color={app_colors.primary.main} />
                    <Text style={addNewObservatoryStepTwoStyles.observatoryChipContainer.chipButton.text}>{label}</Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>
        </View>


        <View style={{display: "flex", flexDirection: "column", gap: 5}}>
          <Text style={globalStyles.categoryTitle}>{t("addObservatory.stepTwo.observatoryType.title")}</Text>
          <View
            style={addNewObservatoryStepTwoStyles.observatoryChipContainer}
            onLayout={(event) => setObservatoryChipsContainerWidth(event.nativeEvent.layout.width)}
          >
            {
              observatoriesTypes.map(({id, label, icon: Icon}) => {
                return (
                  <TouchableOpacity
                    key={id}
                    style={[
                      addNewObservatoryStepTwoStyles.observatoryChipContainer.chipButton,
                      observatoryTypeButtonWidth != null && { width: observatoryTypeButtonWidth },
                      observatoryType === id && addNewObservatoryStepTwoStyles.observatoryChipContainer.chipButton.active,
                    ]}
                    onPress={() => setObservatoryType(id as ObservatoryType)}
                  >
                    <Icon size={20} color={app_colors.primary.main} />
                    <Text style={addNewObservatoryStepTwoStyles.observatoryChipContainer.chipButton.text}>{label}</Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>
        </View>

        <View style={{display: "flex", flexDirection: "column", gap: 5}}>
          <Text style={globalStyles.categoryTitle}>{t("addObservatory.stepTwo.equipments.title")}</Text>
          <View
            style={addNewObservatoryStepTwoStyles.observatoryChipContainer}
            onLayout={(event) => setObservatoryChipsContainerWidth(event.nativeEvent.layout.width)}
          >
            {
              observatoriesEquipments.map(({id, label, icon: Icon}) => {
                return (
                  <TouchableOpacity
                    key={id}
                    style={[
                      addNewObservatoryStepTwoStyles.observatoryChipContainer.chipButton,
                      observatoryTypeButtonWidth != null && { width: observatoryTypeButtonWidth },
                      observatoryEquipment.includes(id as ObservatoryEquipment) && addNewObservatoryStepTwoStyles.observatoryChipContainer.chipButton.active,
                    ]}
                    onPress={() => handleObservatoryEquipmentSelection(id as ObservatoryEquipment)}
                  >
                    <Icon size={20} color={app_colors.primary.main} />
                    <Text style={addNewObservatoryStepTwoStyles.observatoryChipContainer.chipButton.text}>{label}</Text>
                  </TouchableOpacity>
                )
              })
            }
          </View>
        </View>

        <TouchableOpacity style={addNewObservatoryScreenStyles.nextButton} onPress={() => handleSubmitObservatory()}>
          <Text style={{color: app_colors.white, fontFamily: 'DMMonoMedium', fontSize: 16}}>{t("addObservatory.saveButton")}</Text>
          <ArrowRight color={app_colors.white} size={20} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default StepTwo