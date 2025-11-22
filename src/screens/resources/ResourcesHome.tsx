import { ActivityIndicator, ScrollView, View, Text } from "react-native";
import { globalStyles } from "../../styles/global";
import { i18n } from "../../helpers/scripts/i18n";
import { routes } from "../../helpers/routes";
import { useEffect, useState } from "react";
import { Category } from "../../helpers/types/resources/Category";
import { app_colors } from "../../helpers/constants";
import { resourcesHomeStyles } from "../../styles/screens/resources/home";
import PageTitle from "../../components/commons/PageTitle";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import ScreenInfo from "../../components/ScreenInfo";
import ToolButton from "../../components/commons/buttons/ToolButton";
import InputWithIcon from "../../components/forms/InputWithIcon";

export default function ResourcesHome({ navigation }: any) {

  const [categories, setCategories] = useState<Category[]>([]);
  const [userSearchText, setUserSearchText] = useState<string>("");
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const [totalResources, setTotalResources] = useState<number>(0);
  const [countLoading, setCountLoading] = useState<boolean>(true);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: Category[] = await response.json();
      setCategories(
        data
          .filter((category) => category.visible)
          .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }))
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  }

  const fetchTotalResources = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stats/count/resources`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.EXPO_PUBLIC_ADMIN_KEY}`,
        },
      });
      const data = await response.json();
      setTotalResources(data.count);
    } catch (error) {
      console.error("Error fetching total resources:", error);
    } finally {
      setCountLoading(false);
    }
  }

  const handleSearch = () => {
    if(userSearchText.trim() === "") {
      fetchCategories();
      return;
    }
    const filteredCategories = categories
      .filter((category) => category.visible)
      .filter((category) =>
        category.title.toLowerCase().includes(userSearchText.toLowerCase())
      )
      .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }));
    setCategories(filteredCategories);
  }

  useEffect(() => {
    fetchCategories();
    fetchTotalResources();
  }, []);

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('resources.home.title')}
        subtitle={i18n.t('resources.home.subtitle')}
        backRoute={routes.home.path}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        {categoriesLoading && <ActivityIndicator size="large" color="#ffffff" />}
        <InputWithIcon
          placeholder={i18n.t('resources.home.search_placeholder')}
          changeEvent={(text) => {setUserSearchText(text)}}
          search={handleSearch}
          type="text"
          value={userSearchText}
          icon={require("../../../assets/icons/FiSearch.png")}
          additionalStyles={{marginBottom: 5}}
        />
        {
          !categoriesLoading && !countLoading && (
            <View style={resourcesHomeStyles.header}>
              <Text style={resourcesHomeStyles.header.number}>{categories.length} {i18n.t('resources.home.header_number', { plural: categories.length > 1 ? 's' : '' })}</Text>
              <Text style={resourcesHomeStyles.header.number}>{totalResources} {i18n.t('resources.home.header_number_resources', { plural: totalResources > 1 ? 's' : '' })}</Text>
            </View>
          )
        }
        {
          categories.length === 0 && !categoriesLoading && (
            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
              <ScreenInfo
                text={i18n.t('resources.home.no_categories')}
                image={require("../../../assets/icons/FiXCircle.png")}
              />
              <SimpleButton
                text={i18n.t('resources.home.retry')}
                onPress={fetchCategories}
                backgroundColor={app_colors.white}
                textColor={app_colors.black}
              />
            </View>
          )
        }
        {
          !categoriesLoading && categories.length > 0 && categories.map((category) => {
            return (
              <ToolButton
                key={category._id}
                text={category.title}
                subtitle={category.description}
                image={{ uri: category.illustrationUrl }}
                onPress={() => navigation.navigate(routes.resources.categoryScreen.path, { category: category })}
              />
            )
          })
        }
        <ScreenInfo
          text={i18n.t('resources.home.footer_text')}
          image={require("../../../assets/icons/FiInfo.png")}
        />
      </ScrollView>
    </View>
  );
}
