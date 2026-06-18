import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { globalStyles } from '../../../styles/global';
import { sevunStyles } from '../../../styles/screens/partners/sevun';
import { pageTitleStyles } from '../../../styles/components/commons/pageTitle';
import { app_colors } from '../../../helpers/constants';
import { i18n } from '../../../helpers/scripts/i18n';
import { useSevunProgress } from '../../../hooks/useSevunProgress';
import { SevunModuleLevel, SevunResource } from '../../../helpers/types/SevunTypes';

export default function SevunResourceScreen({ navigation, route }: any) {
  const { resource, moduleId }: { resource: SevunResource; moduleId: SevunModuleLevel } = route.params;
  const { isResourceCompleted, toggleResource } = useSevunProgress();
  const [playing, setPlaying] = useState(false);

  const completed = isResourceCompleted(moduleId, resource.id);
  const thumbnail = `https://img.youtube.com/vi/${resource.youtubeId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${resource.youtubeId}?autoplay=1&rel=0&controls=1`;

  return (
    <View style={[globalStyles.body, { paddingHorizontal: 0, paddingTop: 0 }]}>
      <StatusBar style="light" translucent animated />

      {/* Video player */}
      <View style={sevunStyles.resourcePage.videoContainer}>
        {playing ? (
          <WebView
            style={sevunStyles.resourcePage.webview}
            source={{ uri: embedUrl }}
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
          />
        ) : (
          <TouchableOpacity style={sevunStyles.resourcePage.thumbnailOverlay} activeOpacity={0.85} onPress={() => setPlaying(true)}>
            <Image source={{ uri: thumbnail }} style={sevunStyles.resourcePage.thumbnailImage} resizeMode="cover" />
            <View style={sevunStyles.resourcePage.playButton}>
              <Image source={require('../../../../assets/icons/FiPlay.png')} style={sevunStyles.resourcePage.playIcon} />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Back + open externally row */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 4,
      }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Image source={require('../../../../assets/icons/FiChevronDown.png')} style={[pageTitleStyles.container.icon, { tintColor: app_colors.white_sixty }]} />
          <Text style={{ color: app_colors.white_sixty, fontFamily: 'GilroyRegular', fontSize: 13 }}>
            {i18n.t('partners.sevun.resource.back_to_module')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${resource.youtubeId}`)}>
          <Text style={{ color: app_colors.white_sixty, fontFamily: 'GilroyRegular', fontSize: 12 }}>
            {i18n.t('partners.sevun.resource.open_youtube')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={sevunStyles.resourcePage.body}>
          <Text style={sevunStyles.resourcePage.title}>{resource.title}</Text>

          <View style={sevunStyles.resourcePage.metaRow}>
            <View style={sevunStyles.resourcePage.metaBadge}>
              <Image source={require('../../../../assets/icons/FiClock.png')} style={sevunStyles.resourcePage.metaIcon} />
              <Text style={sevunStyles.resourcePage.metaText}>{resource.duration}</Text>
            </View>
            {completed && (
              <View style={[sevunStyles.resourcePage.metaBadge, { backgroundColor: 'rgba(76,175,130,0.15)', borderWidth: 1, borderColor: '#4CAF82' }]}>
                <Text style={[sevunStyles.resourcePage.metaText, { color: '#4CAF82' }]}>
                  {i18n.t('partners.sevun.resource.completed_badge')}
                </Text>
              </View>
            )}
          </View>

          <Text style={sevunStyles.resourcePage.description}>{resource.description}</Text>
        </View>
      </ScrollView>

      {/* Complete / uncomplete button */}
      <TouchableOpacity
        style={[
          sevunStyles.resourcePage.completeButton,
          { backgroundColor: completed ? app_colors.white_twenty : '#4CAF82' },
        ]}
        onPress={() => toggleResource(moduleId, resource.id)}
        activeOpacity={0.8}
      >
        <Image
          source={completed
            ? require('../../../../assets/icons/FiToggleFilled.png')
            : require('../../../../assets/icons/FiToggleEmpty.png')}
          style={[sevunStyles.resourcePage.completeIcon, { tintColor: completed ? app_colors.white_sixty : app_colors.white }]}
        />
        <Text style={[sevunStyles.resourcePage.completeText, { color: completed ? app_colors.white_sixty : app_colors.white }]}>
          {completed ? i18n.t('partners.sevun.resource.mark_undone') : i18n.t('partners.sevun.resource.mark_done')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
