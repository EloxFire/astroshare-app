import React, { useEffect, useRef, useState } from "react";
import {ScrollView, Text, View, Image, TouchableOpacity, ActivityIndicator} from "react-native";
import { globalStyles } from "../../styles/global";
import PageTitle from "../../components/commons/PageTitle";
import { i18n } from "../../helpers/scripts/i18n";
import {  getObject, removeData, storeData, storeObject } from "../../helpers/storage";
import { app_colors, storageKeys } from "../../helpers/constants";
import { Satellite } from "../../helpers/types/satellites/Satellite";
import InputWithIcon from "../../components/forms/InputWithIcon";
import { sendAnalyticsEvent } from "../../helpers/scripts/analytics";
import { useSettings } from "../../contexts/AppSettingsContext";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks/useTranslation";
import { eventTypes } from "../../helpers/constants/analytics";
import { SatelliteIdCard } from "../../components/cards/SatelliteIdCard";
import { routes } from "../../helpers/routes";
import { showToast } from "../../helpers/scripts/showToast";


export default function AddCustomSatellite({ navigation }: any) {
  
  const { currentUserLocation } = useSettings()
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()

  const [satSearch, setSatSearch] = useState<string>("");
  const [availableSatList, setAvailableSatList] = useState<Array<Satellite>>([]);
  const [userSatList, setUserSatList] = useState<Array<Satellite>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Add Custom Satellite Screen View', eventTypes.SCREEN_VIEW, {}, currentLocale);
  }, [])

  useEffect(() => {
    (async () => {
      
      const storedList = await getObject(storageKeys.satellites.customNoradList);
      console.log("Stored custom NORAD list:", storedList);
      
      if (storedList) {
        const parsedList = JSON.parse(storedList) as Array<Satellite>;
        setUserSatList(parsedList);
      }
    })()
  }, [])

  const handleSearchSatellite = async () => {
    if(satSearch.length === 0) {
      console.log("[AddCustomSatellite] No NORAD ID or name entered.");
      showToast({ type: 'error', message: i18n.t('satelliteTrackers.addSatellite.errors.noSearch') });
      return;
    };

    if(satSearch.length <= 2) {
      console.log("[AddCustomSatellite] NORAD ID too short. Too many results expected.");
      showToast({ type: 'error', message: i18n.t('satelliteTrackers.addSatellite.errors.tooShort') });
      return;
    }
    console.log("Searching for satellite with NORAD ID:", satSearch);

    setIsLoading(true);
    const results = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/norad/${satSearch}`);
    const data = await results.json();
    console.log("Search results:", data);
    
    if (data) {
      setAvailableSatList(data);
      setIsLoading(false);
    } else {
      setAvailableSatList([]);
      setIsLoading(false);
      showToast({ type: 'error', message: i18n.t('satelliteTrackers.addSatellite.errors.fetchFailed') });
    }
  }


  const handleSatellitePress = async (satellite: Satellite) => {
    // If the satellite is already in the user's list remove it else add it
    const isAlreadyAdded = userSatList.some(sat => sat.norad_id === satellite.norad_id);
    let updatedUserSatList: Array<Satellite> = [];
    if (isAlreadyAdded) {
      updatedUserSatList = userSatList.filter(sat => sat.norad_id !== satellite.norad_id);
    } else {
      updatedUserSatList = [...userSatList, satellite];
    }
    setUserSatList(updatedUserSatList);
    await storeObject(storageKeys.satellites.customNoradList, JSON.stringify(updatedUserSatList));
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Custom Satellite Added', eventTypes.BUTTON_CLICK, {norad_id: satellite.norad_id}, currentLocale);
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('satelliteTrackers.addSatellite.title')}
        subtitle={i18n.t('satelliteTrackers.addSatellite.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={{paddingBottom: 50}}>
          <InputWithIcon
            icon={require('../../../assets/icons/FiSearch.png')}
            placeholder={i18n.t('satelliteTrackers.addSatellite.searchPlaceholder')}
            search={() => {
              handleSearchSatellite();
            }}
            changeEvent={(text) => {
              setSatSearch(text);
            }}
            type="text"
            value={satSearch}
            keyboardType="default"
          />
          {
            availableSatList.length > 0 && !isLoading && (
              <View>
                <Text style={{color: app_colors.white, marginBottom: 10}}>Résultats de la recherche :</Text>
                <Text style={{color: app_colors.white, marginBottom: 10, fontFamily: "DMMonoRegular", opacity: 0.5}}>{availableSatList.length} résultats trouvés</Text>
                <View style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                  {
                    availableSatList.map((satellite) => (
                      <SatelliteIdCard
                        active={userSatList.some(sat => sat.norad_id === satellite.norad_id)}
                        key={satellite.norad_id}
                        sat={satellite}
                        onClick={() => handleSatellitePress(satellite)}
                      />
                    ))
                  }
                </View>
              </View>
            )
          }
          {
            isLoading && (
              <ActivityIndicator size="large" color={app_colors.white} style={{marginTop: 20}} />
            )
          }
        </View>
      </ScrollView>
    </View>
  );
}
