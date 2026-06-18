import { View, Text, ScrollView, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { globalStyles } from '../../../styles/global';
import { sevunStyles } from '../../../styles/screens/partners/sevun';
import { pageTitleStyles } from '../../../styles/components/commons/pageTitle';
import { app_colors } from '../../../helpers/constants';
import { i18n } from '../../../helpers/scripts/i18n';
import { routes } from '../../../helpers/routes';
import { useSevunProgress } from '../../../hooks/useSevunProgress';
import { SEVUN_MODULES } from '../../../helpers/data/sevunData';
import { SevunModule } from '../../../helpers/types/SevunTypes';

export default function SevunScreen({ navigation }: any) {
  const { moduleCompletedCount, isModuleCompleted } = useSevunProgress();

  const openModule = (module: SevunModule) => {
    navigation.navigate(routes.partners.sevun.module.path, { module });
  };

  return (
    <View style={[globalStyles.body, { paddingHorizontal: 0, paddingTop: 0 }]}>
      {/* Header */}
      <ImageBackground
        source={require('../../../../assets/images/partners/sevun/banner.jpg')}
        style={sevunStyles.header}
        imageStyle={sevunStyles.header.image}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.92)']}
          style={sevunStyles.header.gradient}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={sevunStyles.header.backButton}>
            <Image source={require('../../../../assets/icons/FiChevronDown.png')} style={pageTitleStyles.container.icon} />
          </TouchableOpacity>

          <View style={sevunStyles.header.badge}>
            <Text style={sevunStyles.header.badgeText}>Parcours pédagogique</Text>
          </View>
          <Text style={sevunStyles.header.title}>{i18n.t('partners.sevun.home.title')}</Text>
          <Text style={sevunStyles.header.subtitle}>{i18n.t('partners.sevun.home.subtitle')}</Text>
        </LinearGradient>
      </ImageBackground>

      {/* Module cards */}
      <ScrollView contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}>
        {SEVUN_MODULES.map((module) => {
          const total = module.resources.length;
          const done = moduleCompletedCount(module.id);
          const allDone = isModuleCompleted(module.id);
          const progress = total > 0 ? done / total : 0;

          return (
            <TouchableOpacity
              key={module.id}
              style={sevunStyles.moduleCard}
              onPress={() => openModule(module)}
              activeOpacity={0.8}
            >
              <View style={sevunStyles.moduleCard.inner}>
                {/* Header row */}
                <View style={sevunStyles.moduleCard.header}>
                  <View style={[sevunStyles.moduleCard.levelBadge, { backgroundColor: module.color + '30', borderWidth: 1, borderColor: module.color + '80' }]}>
                    <Text style={[sevunStyles.moduleCard.levelText, { color: module.color }]}>
                      {i18n.t(`partners.sevun.modules.${module.levelKey}`)}
                    </Text>
                  </View>

                  {allDone ? (
                    <View style={sevunStyles.moduleCard.completedBadge}>
                      <Image
                        source={require('../../../../assets/icons/FiToggleFilled.png')}
                        style={[sevunStyles.moduleCard.completedIcon]}
                      />
                      <Text style={sevunStyles.moduleCard.completedText}>
                        {i18n.t('partners.sevun.modules.completed')}
                      </Text>
                    </View>
                  ) : (
                    <Text style={[sevunStyles.moduleCard.progressText, { color: app_colors.white_forty }]}>
                      {total} {i18n.t('partners.sevun.modules.resources_count')}
                    </Text>
                  )}
                </View>

                {/* Description */}
                <Text style={sevunStyles.moduleCard.description}>
                  {i18n.t(`partners.sevun.modules.${module.descriptionKey}`)}
                </Text>

                {/* Progress */}
                <View style={sevunStyles.moduleCard.progressRow}>
                  <Text style={sevunStyles.moduleCard.progressText}>
                    {done}/{total} {i18n.t('partners.sevun.home.progress')}
                  </Text>
                  <Text style={[sevunStyles.moduleCard.progressText, { color: module.color }]}>
                    {Math.round(progress * 100)}%
                  </Text>
                </View>
                <View style={sevunStyles.moduleCard.progressBar}>
                  <View style={[sevunStyles.moduleCard.progressBar.fill, {
                    width: `${progress * 100}%`,
                    backgroundColor: module.color,
                  }]} />
                </View>

                {/* CTA */}
                <View style={[sevunStyles.moduleCard.cta, { backgroundColor: module.color + '20', borderWidth: 1, borderColor: module.color + '50' }]}>
                  <Text style={sevunStyles.moduleCard.ctaText}>
                    {done === 0
                      ? i18n.t('partners.sevun.modules.start')
                      : allDone
                        ? i18n.t('partners.sevun.modules.completed')
                        : i18n.t('partners.sevun.modules.continue')}
                  </Text>
                  <Image
                    source={require('../../../../assets/icons/FiChevronRight.png')}
                    style={[sevunStyles.moduleCard.ctaIcon, { tintColor: module.color }]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
