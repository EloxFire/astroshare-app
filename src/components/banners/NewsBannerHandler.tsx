import React, {useEffect, useRef, useState} from 'react'
import {Dimensions, FlatList, ImageSourcePropType, SafeAreaView, View} from 'react-native'
import NewsBar from "./NewsBar";
import {app_colors} from "../../helpers/constants";
import {BannerNews} from "../../helpers/types/utils/BannerNews";
import axios from "axios";

interface Props {
  navigation: any
}

export default function NewsBannerHandler({ navigation }: Props) {

  const flatListRef = useRef<FlatList>(null)

  const [banners, setBanners] = useState<BannerNews[]>([])
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0)

  useEffect(() => {
    (async () => {
      const news = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/news`)
      setBanners(news.data.data)
    })()
  }, [])

  return (
    <SafeAreaView>
      <FlatList
        ref={flatListRef}
        data={banners}
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
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', marginVertical: 10}}>
          <View style={{flexDirection: 'row'}}>
            {banners.map((_, index) => (
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
