import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Observatory } from '../../../helpers/types/Observatory';
import { observatoryCardStyles } from '../../../styles/components/cards/observatories/observatoryCard';
import { app_colors } from '../../../helpers/constants';
import SimpleBadge from '../../badges/SimpleBadge';
import { routes } from '../../../helpers/routes';
import { useObservatories } from '../../../contexts/ObservatoriesContext';
import { i18n } from '../../../helpers/scripts/i18n';

interface ObservatoryCardProps {
  observatory: Observatory;
  isActive: boolean;
  navigation?: any;
}

const AMENITY_ICONS: Record<string, any> = {
  parking: require('../../../../assets/icons/FiParking.png'),
  electricity: require('../../../../assets/icons/FiZap.png'),
  sleeping: require('../../../../assets/icons/FiMoon.png'),
  shelter: require('../../../../assets/icons/FiUmbrella.png'),
};

const AMENITY_LABELS: Record<string, string> = {
  parking: i18n.t('profile.observatories.amenities.parking'),
  electricity: i18n.t('profile.observatories.amenities.electricity'),
  sleeping: i18n.t('profile.observatories.amenities.sleeping'),
  shelter: i18n.t('profile.observatories.amenities.shelter'),
};

export const ObservatoryCard = ({ observatory, isActive, navigation }: ObservatoryCardProps) => {
  const { selectObservatory } = useObservatories();

  const activeAmenities = Object.entries(observatory.amenities).filter(([, v]) => v);

  const handleSelect = () => {
    selectObservatory(isActive ? null : observatory);
  };

  const handleEdit = () => {
    if (navigation) {
      navigation.navigate(routes.auth.profile.observatories.crud.path, { selectedObservatory: observatory });
    }
  };

  return (
    <View style={[observatoryCardStyles.card as any, isActive && observatoryCardStyles.card.active]}>
      <View style={observatoryCardStyles.card.header as any}>
        <View style={observatoryCardStyles.card.header.left as any}>
          <Image source={require('../../../../assets/icons/FiPinMap.png')} style={observatoryCardStyles.card.header.icon} />
          <Text style={observatoryCardStyles.card.header.title} numberOfLines={1}>
            {observatory.name}
          </Text>
          {isActive && <SimpleBadge text={i18n.t('profile.observatories.selected')} small backgroundColor={app_colors.white} foregroundColor={app_colors.black} />}
        </View>
        <View style={observatoryCardStyles.card.header.actions}>
          <TouchableOpacity onPress={handleSelect}>
            <Image
              source={isActive ? require('../../../../assets/icons/FiToggleFilled.png') : require('../../../../assets/icons/FiToggleEmpty.png')}
              style={observatoryCardStyles.card.header.actionIcon}
            />
          </TouchableOpacity>
          {navigation && (
            <TouchableOpacity onPress={handleEdit}>
              <Image source={require('../../../../assets/icons/FiEdit.png')} style={observatoryCardStyles.card.header.actionIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={observatoryCardStyles.card.coords}>
        {observatory.latitude.toFixed(5)}° / {observatory.longitude.toFixed(5)}°
        {observatory.altitude !== null ? `  •  ${observatory.altitude} m` : ''}
      </Text>

      {activeAmenities.length > 0 && (
        <View style={observatoryCardStyles.card.amenities}>
          {activeAmenities.map(([key]) => (
            <View key={key} style={observatoryCardStyles.card.amenityChip}>
              <Image source={AMENITY_ICONS[key]} style={observatoryCardStyles.card.amenityChip.icon} />
              <Text style={observatoryCardStyles.card.amenityChip.text}>{AMENITY_LABELS[key]}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
