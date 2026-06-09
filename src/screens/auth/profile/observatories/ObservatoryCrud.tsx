import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import DisclaimerBar from '../../../../components/banners/DisclaimerBar';
import SimpleButton from '../../../../components/commons/buttons/SimpleButton';
import PageTitle from '../../../../components/commons/PageTitle';
import InputWithIcon from '../../../../components/forms/InputWithIcon';
import { useAuth } from '../../../../contexts/AuthContext';
import { useObservatories } from '../../../../contexts/ObservatoriesContext';
import { app_colors } from '../../../../helpers/constants';
import { i18n } from '../../../../helpers/scripts/i18n';
import { showToast } from '../../../../helpers/scripts/showToast';
import { Observatory } from '../../../../helpers/types/Observatory';
import { gearFormsStyles } from '../../../../styles/screens/profile/gear/gearForms';
import { globalStyles } from '../../../../styles/global';

const DEFAULT_OBSERVATORY: Observatory = {
  id: '',
  name: '',
  latitude: 0,
  longitude: 0,
  altitude: null,
  notes: '',
  amenities: {
    parking: false,
    electricity: false,
    sleeping: false,
    shelter: false,
  },
  createdAt: '',
  updatedAt: '',
};

const AMENITY_ICONS: Record<string, any> = {
  parking: require('../../../../../assets/icons/FiParking.png'),
  electricity: require('../../../../../assets/icons/FiZap.png'),
  sleeping: require('../../../../../assets/icons/FiMoon.png'),
  shelter: require('../../../../../assets/icons/FiUmbrella.png'),
};

const AMENITY_KEYS = ['parking', 'electricity', 'sleeping', 'shelter'] as const;

export const ObservatoryCrud = ({ navigation, route }: any) => {
  const { currentUser } = useAuth();
  const { saveObservatory, removeObservatory } = useObservatories();

  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [locating, setLocating] = useState(false);
  const [obs, setObs] = useState<Observatory>({ ...DEFAULT_OBSERVATORY, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });

  useEffect(() => {
    if (route.params?.selectedObservatory) {
      setObs(route.params.selectedObservatory);
      setMode('edit');
    }
  }, []);

  const detectGps = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast({ message: i18n.t('profile.observatories.crud.gpsPermissionDenied'), type: 'error' });
        return;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      setObs((prev) => ({
        ...prev,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude !== null ? Math.round(location.coords.altitude) : prev.altitude,
      }));
    } catch (e) {
      showToast({ message: i18n.t('profile.observatories.crud.gpsError'), type: 'error' });
    } finally {
      setLocating(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      showToast({ message: 'Utilisateur non authentifié.', type: 'error' });
      return;
    }
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

  const setAmenity = (key: keyof Observatory['amenities'], value: boolean) => {
    setObs((prev) => ({ ...prev, amenities: { ...prev.amenities, [key]: value } }));
  };

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t(`profile.observatories.crud.${mode}.title`)}
        subtitle={i18n.t(`profile.observatories.crud.${mode}.subtitle`)}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={globalStyles.content}>
          <DisclaimerBar message={i18n.t('profile.observatories.crud.disclaimer')} type="info" soft />

          {/* Identification */}
          <View style={gearFormsStyles.formSection}>
            <Text style={gearFormsStyles.formSection.title}>{i18n.t('profile.observatories.crud.sections.identity')}</Text>
            <View>
              <Text style={gearFormsStyles.label}>
                {i18n.t('profile.observatories.crud.fields.name')} <Text style={{ color: app_colors.red }}>*</Text>
              </Text>
              <InputWithIcon
                keyboardType="default"
                placeholder={i18n.t('profile.observatories.crud.placeholders.name')}
                type="text"
                changeEvent={(v) => setObs({ ...obs, name: v })}
                value={obs.name}
                additionalStyles={{ marginVertical: 5 }}
              />
            </View>
          </View>

          {/* Coordinates */}
          <View style={gearFormsStyles.formSection}>
            <Text style={gearFormsStyles.formSection.title}>{i18n.t('profile.observatories.crud.sections.location')}</Text>

            <SimpleButton
              fullWidth
              text={locating ? i18n.t('profile.observatories.crud.locating') : i18n.t('profile.observatories.crud.detectGps')}
              icon={require('../../../../../assets/icons/FiCrosshair.png')}
              onPress={detectGps}
              textColor={app_colors.white}
              backgroundColor={app_colors.white_no_opacity}
              iconColor={app_colors.white}
              small
            />

            <View style={gearFormsStyles.formSection.formRow}>
              <View style={{ flex: 1, marginRight: 5 }}>
                <Text style={gearFormsStyles.label}>
                  {i18n.t('profile.observatories.crud.fields.latitude')} <Text style={{ color: app_colors.red }}>*</Text>
                </Text>
                <InputWithIcon
                  keyboardType="numeric"
                  placeholder="48.8566"
                  type="number"
                  changeEvent={(v) => setObs({ ...obs, latitude: parseFloat(v) || 0 })}
                  value={obs.latitude ? obs.latitude.toString() : ''}
                  additionalStyles={{ marginVertical: 5 }}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 5 }}>
                <Text style={gearFormsStyles.label}>
                  {i18n.t('profile.observatories.crud.fields.longitude')} <Text style={{ color: app_colors.red }}>*</Text>
                </Text>
                <InputWithIcon
                  keyboardType="numeric"
                  placeholder="2.3522"
                  type="number"
                  changeEvent={(v) => setObs({ ...obs, longitude: parseFloat(v) || 0 })}
                  value={obs.longitude ? obs.longitude.toString() : ''}
                  additionalStyles={{ marginVertical: 5 }}
                />
              </View>
            </View>

            <View>
              <Text style={gearFormsStyles.label}>{i18n.t('profile.observatories.crud.fields.altitude')}</Text>
              <InputWithIcon
                keyboardType="numeric"
                placeholder="341"
                type="number"
                changeEvent={(v) => setObs({ ...obs, altitude: v ? Math.round(parseFloat(v)) : null })}
                value={obs.altitude !== null ? obs.altitude.toString() : ''}
                additionalStyles={{ marginVertical: 5 }}
              />
            </View>
          </View>

          {/* Amenities */}
          <View style={gearFormsStyles.formSection}>
            <Text style={gearFormsStyles.formSection.title}>{i18n.t('profile.observatories.crud.sections.amenities')}</Text>
            {AMENITY_KEYS.map((key) => (
              <View key={key} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Image source={AMENITY_ICONS[key]} style={{ width: 18, height: 18 }} />
                  <Text style={gearFormsStyles.label}>{i18n.t(`profile.observatories.amenities.${key}`)}</Text>
                </View>
                <Switch
                  value={obs.amenities[key]}
                  onValueChange={(v) => setAmenity(key, v)}
                  trackColor={{ false: app_colors.white_no_opacity, true: app_colors.white }}
                  thumbColor={obs.amenities[key] ? app_colors.black : app_colors.white}
                />
              </View>
            ))}
          </View>

          {/* Notes */}
          <View style={gearFormsStyles.formSection}>
            <Text style={gearFormsStyles.formSection.title}>{i18n.t('profile.observatories.crud.sections.notes')}</Text>
            <InputWithIcon
              keyboardType="default"
              placeholder={i18n.t('profile.observatories.crud.placeholders.notes')}
              type="text"
              changeEvent={(v) => setObs({ ...obs, notes: v })}
              value={obs.notes}
              additionalStyles={{ marginVertical: 5 }}
            />
          </View>

          {/* Actions */}
          <SimpleButton
            fullWidth
            text={i18n.t(`profile.observatories.crud.${mode}.save`)}
            onPress={handleSave}
            textColor={app_colors.white}
            backgroundColor={app_colors.white_no_opacity}
            iconColor={app_colors.white}
          />

          {mode === 'edit' && (
            <SimpleButton
              fullWidth
              text={i18n.t('profile.observatories.crud.delete')}
              onPress={handleDelete}
              textColor={app_colors.white}
              backgroundColor={'rgba(200,50,50,0.25)'}
              iconColor={app_colors.white}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};
