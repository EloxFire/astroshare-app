import { Search, LocateFixedIcon, DraftingCompass, Lightbulb, ArrowRight, X } from "lucide-react-native"
import { Trans, useTranslation } from "react-i18next"
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import MapView, { PROVIDER_GOOGLE } from "react-native-maps"
import MapTargetMarker from "../../../../../components/MapTargetMarker/MapTargetMarker"
import InfoCard from "../../../../../components/cards/InfoCard/InfoCard"
import { infoCardStyles } from "../../../../../components/cards/InfoCard/InfoCard.styles"
import ListCard from "../../../../../components/cards/ListCard/ListCard"
import { InputWithIcon } from "../../../../../components/inputs/InputWithIcon/InputWithIcon"
import { getLightPollutionIndicatorLabel } from "../../../../../helpers/api/geocoding/geocoding"
import { globalStyles } from "../../../../../helpers/globalStyles"
import { convertDecimalLatitudeToDMS, convertDecimalLongitudeToDMS } from "../../../../../helpers/location/convert"
import { app_colors } from "../../../../../helpers/variables"
import TabSwitch from "../../../../../components/inputs/TabSwitch/TabSwitch"
import { addNewObservatoryScreenStyles } from "../addNewObservatoryScreen.styles"
import { useAddObservatoryForm } from "../AddObservatoryFormContext"
import { useEffect, useRef, useState } from "react"
import { useLocation } from "../../../../../context/LocationContext"
import { SelectInput } from "../../../../../components/inputs/SelectInput/SelectInput"
import { observatoriesAccessTypes, observatoriesEquipments, observatoriesTypes } from "../../../../../helpers/observatories/observatories"
import SwitchButton from "../../../../../components/inputs/SwitchButton/SwitchButton"
import { Observatory, ObservatoryAccess, ObservatoryEquipment, ObservatoryType } from "../../../../../types/observatory"
import Badge from "../../../../../components/Badges/Badge/Badge"
import { TagsInput } from "../../../../../components/inputs/TagsInput/TagsInput"
import { ImagePickerPermissionDeniedError, pickAndCompressImage, PickedImage } from "../../../../../helpers/images/imagePicker"
import { addNewObservatoryStepTwoStyles } from "../StepTwo/StepTwo.styles"
import { useUserDataStore } from "../../../../../store/userData.store"
import { router, useLocalSearchParams } from "expo-router"
import { generateCustomId } from "../../../../../helpers/ids"
import Button from "../../../../../components/buttons/Button/Button"

const StepOne = () => {

  const { t } = useTranslation("settings/addObservatory");
  const { fetchGpsLocation, gpsLocation, fetchLocation, gpsLoading, searchLoading } = useLocation();
  const { newObservatory, setNewObservatory, setCurrentFormStep } = useAddObservatoryForm();
  const { id: editedObservatoryId } = useLocalSearchParams<{ id?: string }>();
  const observatories = useUserDataStore((state) => state.observatories);
  const addObservatory = useUserDataStore((state) => state.addObservatory);
  const updateObservatory = useUserDataStore((state) => state.updateObservatory);
  const mapRef = useRef<MapView>(null);

  // Présent seulement en modification (voir AddNewObservatoryScreen.tsx) : sert à la fois à
  // préremplir les champs ci-dessous et à décider, dans handleAddObservatory, si on crée une
  // nouvelle fiche ou si on met à jour celle-ci (id/createdAt/shared conservés).
  const editedObservatory = editedObservatoryId ? observatories.find(obs => obs.id === editedObservatoryId) : undefined;

  const [observatoryName, setObservatoryName] = useState<string>(editedObservatory?.display_name ?? "");
  const [observatoryElevation, setObservatoryElevation] = useState<string>(editedObservatory?.elevation != null ? editedObservatory.elevation.toString() : "");
  const [observatoryType, setObservatoryType] = useState<ObservatoryType | null>(editedObservatory?.type ?? null);
  const [observatoryAccessType, setObservatoryAccessType] = useState<ObservatoryAccess>(editedObservatory?.access ?? "car");
  const [observatoryEquipments, setObservatoryEquipments] = useState<ObservatoryEquipment[]>(editedObservatory?.equipment ?? []);
  const [observatoryTags, setObservatoryTags] = useState<string[]>(editedObservatory?.tags ?? []);
  const [observatoryNotes, setObservatoryNotes] = useState<string>(editedObservatory?.notes ?? "");
  const [observatoryImage, setObservatoryImage] = useState<string | null>(editedObservatory?.image ?? null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchLatitude, setSearchLatitude] = useState<string>(editedObservatory ? editedObservatory.latitude.toFixed(5).toString() : "");
  const [searchLongitude, setSearchLongitude] = useState<string>(editedObservatory ? editedObservatory.longitude.toFixed(5).toString() : "");

  // `newObservatory` vit dans le Provider (partagé avec le reste du flux), donc pas initialisable
  // en lazy useState comme les champs ci-dessus : il faut un effet, déclenché une seule fois dès
  // que la fiche éditée est disponible (elle peut arriver après le premier rendu, le store se
  // réhydrate de façon asynchrone).
  useEffect(() => {
    if (editedObservatory && !newObservatory) {
      setNewObservatory(editedObservatory);
      // `initialRegion` de MapView n'agit qu'au tout premier rendu : si le store se réhydrate
      // après coup (AsyncStorage), la carte resterait centrée sur le point par défaut sans ça.
      mapRef.current?.animateToRegion({
        latitude: editedObservatory.latitude,
        longitude: editedObservatory.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  }, [editedObservatory]);


  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const locData = await fetchLocation(`${latitude}::${longitude}`);
    // newObservatory n'est encore qu'une position GPS à ce stade (id/shared/... complétés plus tard
    // dans handleAddObservatory) — cast assumé, cohérent avec le reste de ce fichier.
    setNewObservatory(locData as Observatory | null);

    setSearchLatitude(latitude.toFixed(5).toString());
    setSearchLongitude(longitude.toFixed(5).toString());
  }

  const handleFetchCurrentLocation = async () => {
    const loc = await fetchGpsLocation();

    if(loc){
      setNewObservatory(loc as Observatory);
      mapRef.current?.animateToRegion({
        latitude: loc.latitude,
        longitude: loc.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  }

  const handlePickImage = async () => {
    try {
      const result = await pickAndCompressImage({ aspectRatio: [4, 3] }); // ou sans aspectRatio pour ne pas forcer de recadrage
      if (!result) return; // utilisateur a annulé la sélection
      setObservatoryImage(result.base64);
      if (newObservatory) newObservatory.image = result.base64;
    } catch (err) {
      if (err instanceof ImagePickerPermissionDeniedError) {
        // afficher un message du style "Autorise l'accès à tes photos dans les réglages"
      }
    }
  };

  const handleRemoveImage = () => {
    setObservatoryImage(null);
    if (newObservatory) newObservatory.image = undefined;
  }

  const handleSelectType = (type: ObservatoryType) => {
    setObservatoryType(type);
    if (!newObservatory) return;
    setNewObservatory({ ...newObservatory, type });
  }

  const handleSelectEquipment = (equipmentId: ObservatoryEquipment) => {
    if(observatoryEquipments.includes(equipmentId)){
      setObservatoryEquipments(observatoryEquipments.filter((id) => id !== equipmentId));
    } else {
      setObservatoryEquipments([...observatoryEquipments, equipmentId]);
    }
  }

  const handleSearchLocation = async (query: string) => {
    if(!query || query.trim() === "") return;

    const locData = await fetchLocation(query);
    if(locData){
      setNewObservatory(locData as Observatory);
      mapRef.current?.animateToRegion({
        latitude: locData.latitude,
        longitude: locData.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);

      setSearchLatitude(locData.latitude.toFixed(5).toString());
      setSearchLongitude(locData.longitude.toFixed(5).toString());
    }
  }

  const handleAddObservatory = () => {

    if(!newObservatory) return;

    if (editedObservatory) {
      // id/createdAt/shared conservés : seule une vraie suppression+recréation changerait ces
      // identités, pas une modification.
      newObservatory.id = editedObservatory.id;
      newObservatory.createdAt = editedObservatory.createdAt;
      newObservatory.shared = editedObservatory.shared;
    } else {
      newObservatory.id = generateCustomId();
      newObservatory.shared = false; // Par défaut, un nouvel observatoire est privé
      newObservatory.createdAt = new Date().toISOString();
    }
    newObservatory.updatedAt = new Date().toISOString();
    newObservatory.elevation = observatoryElevation ? parseFloat(observatoryElevation) : null;
    newObservatory.type = observatoryType || undefined;
    newObservatory.access = observatoryAccessType;
    newObservatory.equipment = observatoryEquipments;
    newObservatory.tags = observatoryTags;
    newObservatory.notes = observatoryNotes;
    newObservatory.image = observatoryImage || undefined;
    newObservatory.display_name = observatoryName.trim() !== "" ? observatoryName : newObservatory.name!;

    if (editedObservatory) {
      updateObservatory(editedObservatory.id, newObservatory);
      // back (et non replace) : on revient à la fiche qu'on vient de modifier, comme pour le
      // matériel (AddTelescope, AddMount, ...) plutôt que de retomber sur la liste.
      router.back();
      return;
    }

    addObservatory(newObservatory);
    // replace (et non push) : le formulaire d'ajout est retiré de l'historique de navigation,
    // impossible d'y revenir avec le bouton retour une fois l'observatoire enregistré.
    router.replace("/settings/observatories");
  }

  return (
    <ScrollView>
      <View style={[globalStyles.screen.content, {paddingBottom: 50}]}>

        <InputWithIcon
          fill
          label={t('stepOne.form.name.label')}
          // icon={Search}
          // Le nom du lieu (GPS/recherche) n'est qu'une suggestion visuelle tant que l'utilisateur
          // n'a rien tapé — jamais écrit dans observatoryName, sinon on ne peut plus distinguer
          // "champ vide" d'un "nom personnalisé qui vaut par coïncidence le nom du lieu" (voir
          // handleAddObservatory, qui a besoin de cette distinction pour title/subtitle).
          placeholder={newObservatory?.name || t("stepOne.form.name.placeholder")}
          value={observatoryName}
          onChangeText={setObservatoryName}
          action={() => {}}
        />

        <View style={addNewObservatoryScreenStyles.mapContainer}>
          <MapView
            ref={mapRef}
            style={addNewObservatoryScreenStyles.mapContainer.map}
            provider={PROVIDER_GOOGLE}

            initialRegion={{
              latitude: editedObservatory?.latitude ?? gpsLocation?.latitude ?? 48.856724859667835,
              longitude: editedObservatory?.longitude ?? gpsLocation?.longitude ?? 2.349875271320343,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}

            mapType="standard"
            onPress={handleMapPress}
            rotateEnabled={false}
          >
            {
              newObservatory && (
                <MapTargetMarker
                  coordinate={{
                    latitude: newObservatory.latitude,
                    longitude: newObservatory.longitude,
                  }}
                  title={t("stepOne.selectedLocationMarker")}
                />
              )
            }
          </MapView>
        </View>

        <View style={addNewObservatoryScreenStyles.coordsContainer}>
          <InputWithIcon
            fill
            label={t("stepOne.form.location.latitude.label")}
            placeholder={t("stepOne.form.location.latitude.placeholder")}
            value={searchLatitude}
            onChangeText={setSearchLatitude}
            action={() => {}}
            keyboardType="numeric"
          />
          <InputWithIcon
            fill
            label={t("stepOne.form.location.longitude.label")}
            placeholder={t("stepOne.form.location.longitude.placeholder")}
            value={searchLongitude}
            onChangeText={setSearchLongitude}
            action={() => {}}
            keyboardType="numeric"
          />
          <InputWithIcon
            fill
            label={t("stepOne.form.location.altitude.label")}
            placeholder={t("stepOne.form.location.altitude.placeholder")}
            value={observatoryElevation}
            onChangeText={setObservatoryElevation}
            action={() => {}}
            keyboardType="numeric"
          />

        </View>
        
        <View style={addNewObservatoryScreenStyles.coordsContainer.buttons}>
          <InputWithIcon
            fill
            label={t("stepOne.form.location.search.label")}
            placeholder={t("stepOne.form.location.search.placeholder")}
            value={searchQuery}
            onChangeText={setSearchQuery}
            action={() => handleSearchLocation(searchQuery)}
            keyboardType="default"
          />

          <TouchableOpacity disabled={searchLoading} style={addNewObservatoryScreenStyles.coordsContainer.buttons.button} onPress={() => handleSearchLocation(searchQuery)}>
            {
              searchLoading ? (
                <ActivityIndicator size="small" color={app_colors.white} />
              ) : (
                <>
                  <Search size={16} color={app_colors.white} />
                  <Text style={addNewObservatoryScreenStyles.coordsContainer.buttons.button.text}>{t("stepOne.form.location.buttons.search")}</Text>
                </>
              )
            }
          </TouchableOpacity>

          <TouchableOpacity disabled={gpsLoading} style={addNewObservatoryScreenStyles.coordsContainer.buttons.button} onPress={handleFetchCurrentLocation}>
            {
              gpsLoading ? (
                <ActivityIndicator size="small" color={app_colors.white} />
              ) : (
                <LocateFixedIcon size={16} color={app_colors.white} />
              )
            }
          </TouchableOpacity>
        </View>

        <InfoCard
          icon={Lightbulb}
          title={
            <Trans i18nKey="stepOne.lightPollution.title" ns="settings/addObservatory" values={{ bortle: newObservatory?.light_pollution?.bortle ?? "?", sqm: newObservatory?.light_pollution?.mpsas ?? "?" }}>
              <Text style={infoCardStyles.card.infos.title.bortle}>{newObservatory?.light_pollution?.bortle ?? "?"}</Text>
              <Text style={infoCardStyles.card.infos.title.highlight}>{`(${newObservatory?.light_pollution?.mpsas ?? "?"}mag/arcsec²)`}</Text>
            </Trans>
          }
          description={
            <Trans
              i18nKey="stepOne.lightPollution.description"
              ns="settings/addObservatory"
              values={{
                source: newObservatory?.light_pollution?.source || t("stepOne.lightPollution.noSource"),
                indicator: newObservatory?.light_pollution ? getLightPollutionIndicatorLabel(newObservatory.light_pollution.bortle) : "",
              }}
            >
              <Text style={infoCardStyles.card.infos.description.highlight}>
                {newObservatory?.light_pollution ? getLightPollutionIndicatorLabel(newObservatory.light_pollution.bortle) : "?"}
              </Text>
            </Trans>
          }
          additionnalDescriptionStyle={{opacity: .8, fontFamily: 'DMMonoRegular', fontSize: 10}}
        />

        <View style={addNewObservatoryScreenStyles.imageContainer}>
        <TouchableOpacity style={[addNewObservatoryStepTwoStyles.observatoryImagePicker, observatoryImage ? {borderStyle: "solid", padding: 0} : {}]} onPress={handlePickImage}>
            {
              !observatoryImage ? (
                <Text style={addNewObservatoryStepTwoStyles.observatoryImagePicker.placeholder}>{t('stepTwo.observatoryImage.placeholder')}</Text>
              ) : (
                <View style={addNewObservatoryStepTwoStyles.observatoryImagePicker.imageContainer}>
                  <Image source={{ uri: `${observatoryImage}` }} style={addNewObservatoryStepTwoStyles.observatoryImagePicker.imageContainer.image} />
                  <View style={addNewObservatoryStepTwoStyles.observatoryImagePicker.imageContainer.overlay}>
                    <Text style={addNewObservatoryStepTwoStyles.observatoryImagePicker.imageContainer.overlay.text}>{t('stepTwo.observatoryImage.editButton')}</Text>
                  </View>
                  <TouchableOpacity
                    style={addNewObservatoryStepTwoStyles.observatoryImagePicker.imageContainer.deleteButton}
                    onPress={handleRemoveImage}
                  >
                    <X size={16} color={app_colors.white} />
                  </TouchableOpacity>
                </View>
              )
            }
          </TouchableOpacity>
        </View>

        <Text style={[globalStyles.categoryTitle, {fontSize: 12}]}>{t("stepOne.form.type.label")}</Text>
        <View style={addNewObservatoryScreenStyles.caracteristicsContainer}>
          <SelectInput
            fill
            options={observatoriesTypes.map((type) => ({ value: type.id, label: type.label }))}
            placeholder={t("stepOne.form.type.placeholder")}
            value={observatoryType}
            presentation="sheet"
            onChange={handleSelectType}
          />

          <TabSwitch
            fitContent
            activeTabForegroundColor={app_colors.accent.main}
            tabs={observatoriesAccessTypes.map((accessType) => ({
              text: t(`stepOne.form.type.options.${accessType.id}`),
              icon: accessType.icon,
            }))}
            activeTab={observatoriesAccessTypes.findIndex((accessType) => accessType.id === observatoryAccessType)}
            onTabPress={(index) => {
              const selectedAccessType = observatoriesAccessTypes[index];
              setObservatoryAccessType(selectedAccessType.id as ObservatoryAccess);
              if (!newObservatory) return;
              setNewObservatory({ ...newObservatory, access: selectedAccessType.id as ObservatoryAccess });
            }}
          />
        </View>

        <View style={addNewObservatoryScreenStyles.equipmentsContainer}>
          <Text style={[globalStyles.categoryTitle, {fontSize: 12}]}>{t("stepOne.form.equipments.label")}</Text>
          <View style={addNewObservatoryScreenStyles.equipmentsContainer.badges}>
            {
              observatoriesEquipments.map((equipment) => (
                <Badge
                  key={equipment.id}
                  icon={equipment.icon}
                  text={equipment.label}
                  active={observatoryEquipments.includes(equipment.id as ObservatoryEquipment)}
                  backgroundColor={observatoryEquipments.includes(equipment.id as ObservatoryEquipment) ? app_colors.accent.main : app_colors.accent.light}
                  foregroundColor={observatoryEquipments.includes(equipment.id as ObservatoryEquipment) ? app_colors.white : app_colors.primary.main}
                  action={() => handleSelectEquipment(equipment.id as ObservatoryEquipment)}
                />
              ))
            }
          </View>
        </View>

        <View style={addNewObservatoryScreenStyles.tagsContainer}>
          <Text style={[globalStyles.categoryTitle, {fontSize: 12}]}>{t("stepOne.form.tags.label")}</Text>

          <TagsInput
            tags={observatoryTags}
            placeholder={t("stepOne.form.tags.placeholder")}
            onChange={setObservatoryTags}
          />
        </View>

        <View style={addNewObservatoryScreenStyles.notesContainer}>
          <Text style={[globalStyles.categoryTitle, {fontSize: 12}]}>{t("stepOne.form.notes.label")}</Text>

          <InputWithIcon
            multiline
            fill
            placeholder={t("stepOne.form.notes.placeholder")}
            value={observatoryNotes}
            onChangeText={setObservatoryNotes}
            action={() => {}}
          />
        </View>

        <Button label={editedObservatory ? t("saveButton") : t("nextButton")} icon={ArrowRight} iconPosition="right" onPress={() => handleAddObservatory()} />
      </View>
    </ScrollView>
  )
}

export default StepOne