import React, {useState} from "react";
import {ActivityIndicator, FlatList, ListRenderItemInfo, SafeAreaView, View} from "react-native";
import {planetariumSearchModalStyles} from "../../styles/components/skymap/planetariumSearchModal";
import InputWithIcon from "../forms/InputWithIcon";
import ScreenInfo from "../ScreenInfo";
import SimpleButton from "../commons/buttons/SimpleButton";
import {app_colors} from "../../helpers/constants";
import {universalObjectSearch} from "../../helpers/scripts/universalObjectSearch";
import {useSolarSystem} from "../../contexts/SolarSystemContext";
import {DSO} from "../../helpers/types/DSO";
import {GlobalPlanet} from "../../helpers/types/GlobalPlanet";
import {Star} from "../../helpers/types/Star";
import CelestialBodyCardLite from "../cards/CelestialBodyCardLite";
import {getObjectFamily} from "../../helpers/scripts/astro/objects/getObjectFamily";
import SearchResultCard from "../cards/SearchResultCard";
import SearchPlanetResultCard from "../cards/SearchPlanetResultCard";
import SearchStarResultCard from "../cards/SearchStarResultCard";

interface PlanetariumSearchModalProps {
  onClose: () => void;
  navigation: any
}

export default function PlanetariumSearchModal({ onClose, navigation }: PlanetariumSearchModalProps) {

  const {planets} = useSolarSystem()

  const [loading, setLoading] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>('');
  const [data, setData] = useState<(DSO | GlobalPlanet | Star)[]>([])

  const handleSearch = async () => {
    setLoading(true);
    console.log("Searching for:", searchString);
    const {planetResults, starsResults, dsoResults} = await universalObjectSearch(searchString, planets)

    const mergedResults: (DSO | GlobalPlanet | Star)[] = [...planetResults, ...dsoResults, ...starsResults]
    setData(mergedResults)
    setLoading(false);
  };

  const handleRenderItem = ({item}: {item: DSO | GlobalPlanet | Star}) => {
    const itemFamily = getObjectFamily(item)

    switch (itemFamily) {
      case 'DSO':
        return <SearchResultCard object={item as DSO} navigation={navigation} />
      case 'Planet':
        return <SearchPlanetResultCard planet={item as GlobalPlanet} navigation={navigation} />
      case 'Star':
        return <SearchStarResultCard star={item as Star} navigation={navigation} />
      default:
        return <></>
    }
  }


  return (
    <View style={planetariumSearchModalStyles.modal}>
      <View style={planetariumSearchModalStyles.modal.header}>
        <SimpleButton
          icon={require('../../../assets/icons/FiChevronLeft.png')}
          active
          activeBorderColor={app_colors.white_no_opacity}
          onPress={() => onClose()}
        />
        <InputWithIcon
          placeholder={"M13, Mars, Nebula..."}
          changeEvent={(e) => setSearchString(e)}
          value={searchString}
          type={"text"}
          icon={require('../../../assets/icons/FiSearch.png')}
          search={() => handleSearch()}
        />
      </View>
      {
        data.length === 0 && !loading &&
          <ScreenInfo image={require('../../../assets/icons/FiSearch.png')} text={"Recherchez un objet céleste"}/>
      }

      <SafeAreaView style={planetariumSearchModalStyles.modal.body}>
        {
          loading ?
            <ActivityIndicator size="large" color={app_colors.white} style={{marginTop: 20}} />
            :
            <FlatList
              scrollEnabled={data.length > 1}
              data={data}
              ListEmptyComponent={<View></View>}
              renderItem={({item}: ListRenderItemInfo<DSO|GlobalPlanet|Star>) => <CelestialBodyCardLite object={item} navigation={navigation} />}
              keyExtractor={(item: DSO|GlobalPlanet|Star) => `${item.dec}-${item.ra}`}
            />
        }
      </SafeAreaView>
    </View>
  );
}
