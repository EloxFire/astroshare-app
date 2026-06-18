import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { globalStyles } from '../../../styles/global';
import { sevunStyles } from '../../../styles/screens/partners/sevun';
import { pageTitleStyles } from '../../../styles/components/commons/pageTitle';
import { app_colors } from '../../../helpers/constants';
import { i18n } from '../../../helpers/scripts/i18n';
import { routes } from '../../../helpers/routes';
import { useSevunProgress } from '../../../hooks/useSevunProgress';
import { SevunModule, SevunResource } from '../../../helpers/types/SevunTypes';

export default function SevunModuleScreen({ navigation, route }: any) {
  const { module }: { module: SevunModule } = route.params;
  const { isResourceCompleted, moduleCompletedCount, isModuleCompleted } = useSevunProgress();

  const total = module.resources.length;
  const done = moduleCompletedCount(module.id);
  const allDone = isModuleCompleted(module.id);

  const openResource = (resource: SevunResource) => {
    navigation.navigate(routes.partners.sevun.resource.path, { resource, moduleId: module.id });
  };

  return (
    <View style={[globalStyles.body, { paddingHorizontal: 0, paddingTop: 0 }]}>
      {/* Header */}
      <LinearGradient
        colors={['#1a1a2e', module.color + '55', '#0a0a0a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: 56, paddingHorizontal: 16, paddingBottom: 24 }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={sevunStyles.header.backButton}>
          <Image source={require('../../../../assets/icons/FiChevronDown.png')} style={pageTitleStyles.container.icon} />
        </TouchableOpacity>

        <View style={[sevunStyles.header.badge, { borderColor: module.color + '80', backgroundColor: module.color + '25' }]}>
          <Text style={[sevunStyles.header.badgeText, { color: module.color }]}>
            {i18n.t(`partners.sevun.modules.${module.levelKey}`)}
          </Text>
        </View>

        <Text style={sevunStyles.header.title}>
          {i18n.t(`partners.sevun.modules.${module.levelKey}`)}
        </Text>
        <Text style={sevunStyles.header.subtitle}>
          {i18n.t(`partners.sevun.modules.${module.descriptionKey}`)}
        </Text>

        {/* Progress bar */}
        <View style={{ marginTop: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ color: app_colors.white_sixty, fontFamily: 'GilroyRegular', fontSize: 12 }}>
              {done}/{total} {i18n.t('partners.sevun.home.progress')}
            </Text>
            {allDone && (
              <Text style={{ color: '#4CAF82', fontFamily: 'GilroyBold', fontSize: 12 }}>
                {i18n.t('partners.sevun.home.all_done')}
              </Text>
            )}
          </View>
          <View style={sevunStyles.moduleCard.progressBar}>
            <View style={[sevunStyles.moduleCard.progressBar.fill, {
              width: total > 0 ? `${(done / total) * 100}%` : '0%',
              backgroundColor: module.color,
            }]} />
          </View>
        </View>
      </LinearGradient>

      {/* Resource list */}
      <ScrollView style={{ marginTop: 8 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {module.resources.map((resource, index) => {
          const completed = isResourceCompleted(module.id, resource.id);
          const thumbnail = `https://img.youtube.com/vi/${resource.youtubeId}/hqdefault.jpg`;

          return (
            <TouchableOpacity
              key={resource.id}
              style={sevunStyles.resourceItem}
              onPress={() => openResource(resource)}
              activeOpacity={0.75}
            >
              {/* Thumbnail */}
              <View style={{ position: 'relative' }}>
                <Image source={{ uri: thumbnail }} style={sevunStyles.resourceItem.thumbnail} resizeMode="cover" />
                <View style={sevunStyles.resourceItem.playOverlay}>
                  <Image
                    source={require('../../../../assets/icons/FiPlay.png')}
                    style={sevunStyles.resourceItem.playIcon}
                  />
                </View>
              </View>

              {/* Content */}
              <View style={sevunStyles.resourceItem.content}>
                <Text style={sevunStyles.resourceItem.title} numberOfLines={2}>
                  {resource.title}
                </Text>
                <View style={sevunStyles.resourceItem.meta}>
                  <Text style={sevunStyles.resourceItem.duration}>{resource.duration}</Text>
                  {completed && (
                    <Image
                      source={require('../../../../assets/icons/FiToggleFilled.png')}
                      style={[sevunStyles.resourceItem.checkIcon, { tintColor: '#4CAF82' }]}
                    />
                  )}
                </View>
              </View>

              {/* Right arrow */}
              <Image
                source={require('../../../../assets/icons/FiChevronRight.png')}
                style={{ width: 18, height: 18, tintColor: app_colors.white_twenty, marginRight: 12 }}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
