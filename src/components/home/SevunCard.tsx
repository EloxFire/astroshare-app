import { View, Text, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { app_colors } from '../../helpers/constants';
import { i18n } from '../../helpers/scripts/i18n';
import { useSevunProgress } from '../../hooks/useSevunProgress';
import { SEVUN_MODULES } from '../../helpers/data/sevunData';

interface SevunCardProps {
  onPress: () => void;
}

export default function SevunCard({ onPress }: SevunCardProps) {
  const { moduleCompletedCount } = useSevunProgress();

  const totalResources = SEVUN_MODULES.reduce((acc, m) => acc + m.resources.length, 0);
  const totalDone = SEVUN_MODULES.reduce((acc, m) => acc + moduleCompletedCount(m.id), 0);
  const hasStarted = totalDone > 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <ImageBackground
        source={require('../../../assets/images/partners/sevun/banner.jpg')}
        style={{ height: 170, borderRadius: 16, overflow: 'hidden' }}
        imageStyle={{ borderRadius: 16 }}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.08)', 'rgba(0,0,0,0.82)']}
          style={{ flex: 1, padding: 16, justifyContent: 'flex-end' }}
        >
          {/* AFA badge */}
          <View style={{
            alignSelf: 'flex-start',
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 6,
            paddingHorizontal: 8,
            paddingVertical: 3,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.25)',
          }}>
            <Text style={{ color: app_colors.white, fontFamily: 'GilroyBold', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' }}>
              AFA · Partenaire officiel
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: app_colors.white, fontFamily: 'GilroyBlack', fontSize: 20, lineHeight: 24 }}>
                {i18n.t('partners.sevun.card.title')}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'GilroyRegular', fontSize: 12, marginTop: 3 }} numberOfLines={1}>
                {i18n.t('partners.sevun.card.subtitle')}
              </Text>
            </View>

            <View style={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 8,
              marginLeft: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}>
              <Text style={{ color: '#000', fontFamily: 'GilroyBlack', fontSize: 13 }}>
                {i18n.t('partners.sevun.card.cta')}
              </Text>
              <Image
                source={require('../../../assets/icons/FiChevronRight.png')}
                style={{ width: 14, height: 14, tintColor: '#000' }}
              />
            </View>
          </View>

          {/* Progress bar */}
          {hasStarted && (
            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'GilroyRegular', fontSize: 11 }}>
                  {totalDone}/{totalResources} {i18n.t('partners.sevun.home.progress')}
                </Text>
              </View>
              <View style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3 }}>
                <View style={{
                  height: 3,
                  width: `${(totalDone / totalResources) * 100}%`,
                  backgroundColor: '#4CAF82',
                  borderRadius: 3,
                }} />
              </View>
            </View>
          )}
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}
