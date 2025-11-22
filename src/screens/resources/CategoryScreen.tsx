import { ActivityIndicator, ScrollView, View, Text } from "react-native";
import { globalStyles } from "../../styles/global";
import { i18n } from "../../helpers/scripts/i18n";
import { routes } from "../../helpers/routes";
import { useEffect, useState } from "react";
import { app_colors } from "../../helpers/constants";
import { resourcesHomeStyles } from "../../styles/screens/resources/home";
import PageTitle from "../../components/commons/PageTitle";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import ScreenInfo from "../../components/ScreenInfo";
import InputWithIcon from "../../components/forms/InputWithIcon";
import { Resource } from "../../helpers/types/resources/Resource";
import { ResourceCard } from "../../components/cards/ResourceCard";

export default function ResourcesHome({ navigation, route }: any) {

  const { category } = route.params;

  const [resources, setResources] = useState<Resource[]>([]);
  const [userSearchText, setUserSearchText] = useState<string>("");
  const [resourcesLoading, setResourcesLoading] = useState<boolean>(true);

  const fetchResources = async () => {
    setResourcesLoading(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/categories/${category._id}/resources`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: Resource[] = await response.json();
      setResources(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setResourcesLoading(false);
    }
  }

  const handleSearch = () => {
    if(userSearchText.trim() === "") {
      fetchResources();
      return;
    }
    const filteredResources = resources.filter((resource) =>
      resource.title.toLowerCase().includes(userSearchText.toLowerCase())
    );
    setResources(filteredResources);
  }

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={category.title}
        subtitle={category.description}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        {resourcesLoading && <ActivityIndicator size="large" color={app_colors.white} />}
        <InputWithIcon
          placeholder={i18n.t('resources.home.search_placeholder_resources')}
          changeEvent={(text) => {setUserSearchText(text)}}
          search={handleSearch}
          type="text"
          value={userSearchText}
          icon={require("../../../assets/icons/FiSearch.png")}
          additionalStyles={{marginBottom: 5}}
        />
        {
          !resourcesLoading && (
            <View style={resourcesHomeStyles.header}>
              <Text style={resourcesHomeStyles.header.number}>{resources.length} {i18n.t('resources.home.header_number_resources', { plural: resources.length > 1 ? 's' : '' })}</Text>
            </View>
          )
        }
        {
          resources.length === 0 && !resourcesLoading && (
            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
              <ScreenInfo
                text={i18n.t('resources.home.no_resources')}
                image={require("../../../assets/icons/FiXCircle.png")}
              />
              <SimpleButton
                text={i18n.t('resources.home.retry')}
                onPress={fetchResources}
                backgroundColor={app_colors.white}
                textColor={app_colors.black}
              />
            </View>
          )
        }
        {
          !resourcesLoading && resources.length > 0 && resources.map((resource) => {
            return (
              <ResourceCard
                key={resource._id}
                resource={resource}
                navigation={navigation}
              />
            )
          })
        }
      </ScrollView>
    </View>
  );
}
