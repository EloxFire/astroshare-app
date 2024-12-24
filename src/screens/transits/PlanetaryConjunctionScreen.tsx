import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { i18n } from '../../helpers/scripts/i18n';
import { globalStyles } from '../../styles/global';
import PageTitle from '../../components/commons/PageTitle';
import { Conjunction, findPlanetaryConjunctions, GeographicCoordinate, Interval } from '@observerly/astrometry';
import dayjs from 'dayjs';
import { useSettings } from '../../contexts/AppSettingsContext';
import ConjunctionCard from '../../components/cards/ConjunctionCard';
import { planetaryConjunctionStyles } from '../../styles/screens/transits/planetaryConjunction';
import ScreenInfo from '../../components/ScreenInfo';
import InputWithIcon from '../../components/forms/InputWithIcon';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

export default function PlanetaryConjunctionScreen({ navigation }: any) {
  const { currentUserLocation } = useSettings();
  const [conjunctions, setConjunctions] = useState<Map<string, Conjunction> | null>(null);
  const [customSeparation, setCustomSeparation] = useState<number | null>(null);
  const [loadingConjunctions, setLoadingConjunctions] = useState<boolean>(true);

  // Reference to ScrollView
  const scrollViewRef = useRef<ScrollView>(null);

  // Store item positions for horizontal scrolling
  const itemPositions = useRef<Array<{ key: string; left: number; width: number }>>([]);

  useEffect(() => {
    searchConjunctions();
  }, [currentUserLocation]);

  const searchConjunctions = () => {
    if (currentUserLocation) {
      setConjunctions(null);
      const separation = customSeparation ? customSeparation : 3;

      const interval: Interval = {
        from: dayjs().toDate(),
        to: dayjs().add(6, 'months').toDate(),
      };

      const observer: GeographicCoordinate = {
        latitude: currentUserLocation.lat,
        longitude: currentUserLocation.lon,
      };

      const c: Map<string, Conjunction> = findPlanetaryConjunctions(interval, observer, {
        angularSeparationThreshold: separation,
      });

      // Order by date
      const ordered = new Map([...c.entries()].sort((a, b) => a[1].datetime.getTime() - b[1].datetime.getTime()));
      setConjunctions(ordered);
      setLoadingConjunctions(false);
    } else {
      console.log('No location found');
      setLoadingConjunctions(false);
    }
  };

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;

    // Déterminer l'élément le plus visible
    let closestItemKey: string | null = null;
    let smallestOffset = Infinity;

    itemPositions.current.forEach(({ key, left, width }) => {
      const itemCenter = left + width / 2; // Centre de l'élément
      const viewportCenter = scrollX + windowWidth / 2; // Centre de la zone visible
      const offset = Math.abs(itemCenter - viewportCenter);

      // Trouver l'élément le plus proche du centre
      if (offset < smallestOffset) {
        smallestOffset = offset;
        closestItemKey = key;
      }
    });

    // Snap à l'élément le plus visible
    if (closestItemKey) {
      const item = itemPositions.current.find((i) => i.key === closestItemKey);
      if (item && scrollViewRef.current) {
        const targetX = item.left - (windowWidth / 2 - item.width / 2);
        scrollViewRef.current.scrollTo({ x: targetX, animated: true });
      }
    }
  };

  const registerItemPosition = (key: string, layout: { x: number; width: number }) => {
    itemPositions.current = [
      ...itemPositions.current.filter((item) => item.key !== key),
      { key, left: layout.x, width: layout.width },
    ];
  };

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('transits.planetaryConjunction.title')}
        subtitle={i18n.t('transits.planetaryConjunction.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <View style={planetaryConjunctionStyles.content.filters}>
        <InputWithIcon
          placeholder={'Séparation angulaire max (default : 3°)'}
          type={'text'}
          keyboardType={'numeric'}
          changeEvent={(text) => setCustomSeparation(parseInt(text))}
          value={customSeparation ? customSeparation.toString() : ''}
        />
        <TouchableOpacity
          disabled={loadingConjunctions}
          style={planetaryConjunctionStyles.content.filters.button}
          onPress={() => searchConjunctions()}
        >
          <Text style={planetaryConjunctionStyles.content.filters.button.text}>Valider</Text>
        </TouchableOpacity>
      </View>

      {conjunctions && Array.from(conjunctions.entries()).length > 0 && <Text style={[planetaryConjunctionStyles.content.text, {marginBottom: 10}]}>{Array.from(conjunctions.entries()).length} résultats</Text>}

      {loadingConjunctions && (
        <ScreenInfo
          image={require('../../../assets/icons/FiTransit.png')}
          text={'Calcul des conjonctions en cours...'}
        />
      )}

      {!loadingConjunctions && conjunctions && Array.from(conjunctions.entries()).length === 0 && (
        <ScreenInfo
          image={require('../../../assets/icons/FiTransit.png')}
          text={'Aucune conjonction à venir'}
        />
      )}

      {!loadingConjunctions && conjunctions && Array.from(conjunctions.entries()).length > 0 && (
        <ScrollView
          ref={scrollViewRef}
          horizontal={true} // Défilement horizontal
          onMomentumScrollEnd={handleMomentumScrollEnd} // Snapping après la fin du scroll
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
        >
          {Array.from(conjunctions.entries()).map(([key, conjunction]) => (
            <View
              key={key}
              onLayout={(event) =>
                registerItemPosition(key, {
                  x: event.nativeEvent.layout.x,
                  width: event.nativeEvent.layout.width,
                })
              }
            >
              <ConjunctionCard conjunction={conjunction} />
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
