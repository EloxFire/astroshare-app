import React, {useEffect, useRef, useState} from 'react'
import {Dimensions, FlatList, SafeAreaView, View} from 'react-native'
import NewsBar from "./NewsBar";
import {app_colors} from "../../helpers/constants";
import {routes} from "../../helpers/routes";

interface Props {
  navigation: any
}

export default function NewsBannerHandler({ navigation }: Props) {

  const flatListRef = useRef<FlatList>(null)

  const [currentScrollPosition, setCurrentScrollPosition] = useState(0)

  useEffect(() => {
    (async () => {

    })()
  }, [])

  const fakeNews = [
    {
      title: "Maximum des Orionides !",
      description: "Le maximum des Orionides sera visible cette nuit ! Cliquez ici pour en savoir plus.",
      icon: require('../../../assets/icons/FiMeteorShower.png'),
      colors: "#311D6E;#3B2751",
      type: 'external',
      externalLink: 'https://www.stelvision.com'
    },
    {
      title: "Activitée solaire intense",
      description: "Une tempête solaire est en approche ! Cliquez ici pour en savoir plus.",
      icon: require('../../../assets/icons/FiSun.png'),
      colors: "#6E1D1D;#6E1D1D",
      type: 'internal',
      internalRoute: routes.solarWeather.path
    },
    {
      title: "Activitée solaire intense",
      description: "Une tempête solaire est en approche ! Cliquez ici pour en savoir plus.",
      icon: require('../../../assets/icons/FiSun.png'),
      colors: "#6E1D1D;#8B4E35",
      type: 'none',
    }
  ]

  return (
    <SafeAreaView>
      <FlatList
        ref={flatListRef}
        data={fakeNews}
        renderItem={({item}) => (
          <NewsBar
            navigation={navigation}
            icon={item.icon}
            title={item.title}
            description={item.description}
            colors={item.colors}
            type={item.type}
            externalLink={item.externalLink}
            internalRoute={item.internalRoute}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        onMomentumScrollEnd={(event) => {
          const contentOffsetX = event.nativeEvent.contentOffset.x;
          const currentIndex = Math.round(contentOffsetX / Dimensions.get('window').width);
          setCurrentScrollPosition(currentIndex);
        }}
        showsHorizontalScrollIndicator={false}
      />
      <View>
      {/*  Item Dots */}
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 10}}>
          <View style={{flexDirection: 'row'}}>
            {fakeNews.map((_, index) => (
              <View
                key={index}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 4,
                  backgroundColor: currentScrollPosition === index ? app_colors.white : app_colors.white_twenty,
                  marginHorizontal: 4,
                }}
              />
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
