import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { v4 as uuidv4 } from 'uuid';
import SimpleButton from '../../../../components/commons/buttons/SimpleButton';
import PageTitle from '../../../../components/commons/PageTitle';
import InputWithIcon from '../../../../components/forms/InputWithIcon';
import { useAuth } from '../../../../contexts/AuthContext';
import { useObservatories } from '../../../../contexts/ObservatoriesContext';
import { getLocationName } from '../../../../helpers/api/getLocationFromCoords';
import { app_colors } from '../../../../helpers/constants';
import { mapStyle } from '../../../../helpers/mapJsonStyle';
import { i18n } from '../../../../helpers/scripts/i18n';
import { showToast } from '../../../../helpers/scripts/showToast';
import { Observatory } from '../../../../helpers/types/Observatory';
import { gearFormsStyles } from '../../../../styles/screens/profile/gear/gearForms';
import { globalStyles } from '../../../../styles/global';

const EMPTY_OBS = (): Observatory => ({
  id: uuidv4(),
  name: '',
  latitude: 0,
  longitude: 0,
  altitude: null,
  notes: '',
  amenities: { parking: false, electricity: false, sleeping: false, shelter: false },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

type AmenityKey = keyof Observatory['amenities'];

const AMENITIES: { key: AmenityKey; icon: any; labelKey: string }[] = [
  { key: 'parking',     icon: require('../../../../../assets/icons/FiParking.png'), labelKey: 'profile.observatories.amenities.parking' },
  { key: 'electricity', icon: require('../../../../../assets/icons/FiZap.png'),     labelKey: 'profile.observatories.amenities.electricity' },
  { key: 'sleeping',    icon: require('../../../../../assets/icons/FiMoon.png'),    labelKey: 'profile.observatories.amenities.sleeping' },
  { key: 'shelter',     icon: require('../../../../../assets/icons/FiUmbrella.png'),labelKey: 'profile.observatories.amenities.shelter' },
];

export const ObservatoryCrud = ({ navigation, route }: any) => {
  const { currentUser } = useAuth();
  const { saveObservatory, removeObservatory } = useObservatories();

  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [locating, setLocating] = useState(false);
  const [obs, setObs] = useState<Observatory>(EMPTY_OBS());

  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (route.params?.selectedObservatory) {
      setObs(route.params.selectedObservatory);
      setMode('edit');
    }
  }, []);

  useEffect(() => {
    if (obs.latitude !== 0 && obs.longitude !== 0 && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: obs.latitude,
        longitude: obs.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 500);
    }
  }, [obs.latitude, obs.longitude]);

  const applyGeocodingToName = async (latitude: number, longitude: number) => {
    try {
      const place = await getLocationName({ lat: latitude, lon: longitude });
      const geocodedName = place?.local_names?.fr ?? place?.name ?? '';
      if (geocodedName) {
        setObs((prev) => ({
          ...prev,
          name: prev.name.trim() === '' ? geocodedName : prev.name,
        }));
      }
    } catch { /* non-blocking */ }
  };

  const detectGps = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast({ message: i18n.t('profile.observatories.crud.gpsPermissionDenied'), type: 'error' });
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      const { latitude, longitude, altitude } = loc.coords;
      setObs((prev) => ({
        ...prev,
        latitude,
        longitude,
        altitude: altitude != null ? Math.round(altitude) : prev.altitude,
      }));
      await applyGeocodingToName(latitude, longitude);
    } catch {
      showToast({ message: i18n.t('profile.observatories.crud.gpsError'), type: 'error' });
    } finally {
      setLocating(false);
    }
  };

  const handleMapPress = async (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setObs((prev) => ({ ...prev, latitude, longitude }));
    await applyGeocodingToName(latitude, longitude);
  };

  const handleSave = async () => {
    if (!currentUser) return;
    if (!obs.name.trim()) {
      showToast({ message: i18n.t('profile.observatories.crud.nameRequired'), type: 'error' });
      return;
    }
    if (!obs.latitude || !obs.longitude) {
      showToast({ message: i18n.t('profile.observatories.crud.coordsRequired'), type: 'error' });
      return;
    }
    await saveObservatory({ ...obs, updatedAt: new Date().toISOString() });
    navigation.goBack();
  };

  const handleDelete = async () => {
    if (!currentUser) return;
    await removeObservatory(obs.id);
    navigation.goBack();
  };

  const toggleAmenity = (key: AmenityKey) =>
    setObs((prev) => ({ ...prev, amenities: { ...prev.amenities, [key]: !prev.amenities[key] } }));

  const hasCoords = obs.latitude !== 0 && obs.longitude !== 0;

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t(`profile.observatories.crud.${mode}.title`)}
        subtitle={i18n.t(`profile.observatories.crud.${mode}.subtitle`)}
      />
      <View style={globalStyles.screens.separator} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[globalStyles.content, { paddingBottom: 40 }]}>

          {/* ── Identification + coordonnées ── */}
          <View style={[gearFormsStyles.formSection, { gap: 8 }]}>
            <Text style={gearFormsStyles.formSection.title}>
              {i18n.t('profile.observatories.crud.sections.identity')} &amp; {i18n.t('profile.observatories.crud.sections.location')}
            </Text>

            {/* Name */}
            <View>
              <Text style={gearFormsStyles.label}>
                {i18n.t('profile.observatories.crud.fields.name')}{' '}
                <Text style={{ color: app_colors.red }}>*</Text>
              </Text>
              <InputWithIcon
                keyboardType="default"
                placeholder={i18n.t('profile.observatories.crud.placeholders.name')}
                type="text"
                changeEvent={(v) => setObs({ ...obs, name: v })}
                value={obs.name}
                additionalStyles={{ marginVertical: 4 }}
              />
            </View>

            {/* GPS detect */}
            <TouchableOpacity
              onPress={detectGps}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 12,
                paddingVertical: 9,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: app_colors.white_no_opacity,
                backgroundColor: locating ? 'rgba(255,255,255,0.08)' : 'transparent',
              }}
            >
              <Image source={require('../../../../../assets/icons/FiCrosshair.png')} style={{ width: 15, height: 15 }} />
              <Text style={{ color: app_colors.white, fontFamily: 'GilroyRegular', fontSize: 14, flex: 1 }}>
                {locating
                  ? i18n.t('profile.observatories.crud.locating')
                  : i18n.t('profile.observatories.crud.detectGps')}
              </Text>
              {hasCoords && (
                <Text style={{ color: app_colors.white, fontSize: 10, fontFamily: 'DMMonoRegular', opacity: 0.5 }}>
                  {obs.latitude.toFixed(4)}° / {obs.longitude.toFixed(4)}°
                </Text>
              )}
            </TouchableOpacity>

            {/* Map — visual + click-to-select */}
            <View style={{
              borderRadius: 10,
              overflow: 'hidden',
              height: 180,
              borderWidth: 1,
              borderColor: app_colors.white_no_opacity,
            }}>
              <MapView
                ref={mapRef}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                customMapStyle={mapStyle}
                style={{ flex: 1 }}
                onPress={handleMapPress}
                initialRegion={{
                  latitude: hasCoords ? obs.latitude : 48.8566,
                  longitude: hasCoords ? obs.longitude : 2.3522,
                  latitudeDelta: hasCoords ? 0.05 : 20,
                  longitudeDelta: hasCoords ? 0.05 : 20,
                }}
              >
                {hasCoords && (
                  <Marker
                    coordinate={{ latitude: obs.latitude, longitude: obs.longitude }}
                    pinColor={app_colors.white}
                  />
                )}
              </MapView>
              <View style={{
                position: 'absolute',
                bottom: 8,
                left: 0,
                right: 0,
                alignItems: 'center',
                pointerEvents: 'none',
              }}>
                <View style={{
                  backgroundColor: 'rgba(0,0,0,0.65)',
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, fontFamily: 'DMMonoRegular' }}>
                    Toucher pour sélectionner
                  </Text>
                </View>
              </View>
            </View>

            {/* Lat / Lon row */}
            <View style={gearFormsStyles.formSection.formRow}>
              <View style={{ flex: 1, marginRight: 5 }}>
                <Text style={gearFormsStyles.label}>
                  {i18n.t('profile.observatories.crud.fields.latitude')}{' '}
                  <Text style={{ color: app_colors.red }}>*</Text>
                </Text>
                <InputWithIcon
                  keyboardType="numeric"
                  placeholder="48.8566"
                  type="number"
                  changeEvent={(v) => setObs({ ...obs, latitude: parseFloat(v) || 0 })}
                  value={obs.latitude ? obs.latitude.toString() : ''}
                  additionalStyles={{ marginVertical: 4 }}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <Text style={gearFormsStyles.label}>
                  {i18n.t('profile.observatories.crud.fields.longitude')}{' '}
                  <Text style={{ color: app_colors.red }}>*</Text>
                </Text>
                <InputWithIcon
                  keyboardType="numeric"
                  placeholder="2.3522"
                  type="number"
                  changeEvent={(v) => setObs({ ...obs, longitude: parseFloat(v) || 0 })}
                  value={obs.longitude ? obs.longitude.toString() : ''}
                  additionalStyles={{ marginVertical: 4 }}
                />
              </View>
            </View>

            {/* Altitude */}
            <View>
              <Text style={gearFormsStyles.label}>{i18n.t('profile.observatories.crud.fields.altitude')}</Text>
              <InputWithIcon
                keyboardType="numeric"
                placeholder="341"
                type="number"
                changeEvent={(v) => setObs({ ...obs, altitude: v ? Math.round(parseFloat(v)) : null })}
                value={obs.altitude != null ? obs.altitude.toString() : ''}
                additionalStyles={{ marginVertical: 4 }}
              />
            </View>
          </View>

          {/* ── Équipements ── */}
          <View style={[gearFormsStyles.formSection, { gap: 8 }]}>
            <Text style={gearFormsStyles.formSection.title}>
              {i18n.t('profile.observatories.crud.sections.amenities')}
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {AMENITIES.map(({ key, icon, labelKey }) => {
                const active = obs.amenities[key];
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => toggleAmenity(key)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 7,
                      paddingHorizontal: 12,
                      paddingVertical: 9,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: active ? app_colors.white : app_colors.white_no_opacity,
                      backgroundColor: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                      minWidth: '45%',
                      flex: 1,
                    }}
                  >
                    <Image source={icon} style={{ width: 15, height: 15, opacity: active ? 1 : 0.45 }} />
                    <Text style={{
                      color: app_colors.white,
                      fontFamily: active ? 'GilroyBlack' : 'GilroyRegular',
                      fontSize: 13,
                      opacity: active ? 1 : 0.6,
                    }}>
                      {i18n.t(labelKey)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Notes inline */}
            <View style={{ marginTop: 4 }}>
              <Text style={gearFormsStyles.label}>{i18n.t('profile.observatories.crud.sections.notes')}</Text>
              <InputWithIcon
                keyboardType="default"
                placeholder={i18n.t('profile.observatories.crud.placeholders.notes')}
                type="text"
                changeEvent={(v) => setObs({ ...obs, notes: v })}
                value={obs.notes}
                additionalStyles={{ marginVertical: 4 }}
              />
            </View>
          </View>

          {/* ── Actions ── */}
          <SimpleButton
            align='center'
            fullWidth
            text={i18n.t(`profile.observatories.crud.${mode}.save`)}
            onPress={handleSave}
            textColor={app_colors.black}
            backgroundColor={app_colors.white}
            iconColor={app_colors.black}
            textAdditionalStyles={{ fontFamily: 'GilroyBlack' }}
          />

          {mode === 'edit' && (
            <SimpleButton
              fullWidth
              text={i18n.t('profile.observatories.crud.delete')}
              onPress={handleDelete}
              textColor={app_colors.white}
              align='center'
              backgroundColor={app_colors.red_eighty}
              iconColor={app_colors.white}
              textAdditionalStyles={{ fontFamily: 'GilroyBlack' }}
            />
          )}

        </View>
      </ScrollView>
    </View>
  );
};
