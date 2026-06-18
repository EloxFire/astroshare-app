import { Dimensions } from 'react-native';
import Constants from 'expo-constants';
import { app_colors } from '../../../helpers/constants';

const { width } = Dimensions.get('window');

export const sevunStyles = {
  // ── Home screen ──────────────────────────────────────────────
  header: {
    width: '100%' as '100%',
    height: 220,
    justifyContent: 'flex-end' as 'flex-end',

    image: {
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },

    gradient: {
      paddingHorizontal: 16,
      paddingBottom: 20,
      paddingTop: 60,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },

    backButton: {
      marginBottom: 12,
    },

    badge: {
      alignSelf: 'flex-start' as 'flex-start',
      backgroundColor: app_colors.white_twenty,
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 4,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: app_colors.white_forty,
    },

    badgeText: {
      color: app_colors.white,
      fontSize: 11,
      fontFamily: 'GilroyBold',
      letterSpacing: 1,
      textTransform: 'uppercase' as 'uppercase',
    },

    title: {
      color: app_colors.white,
      fontSize: 26,
      fontFamily: 'GilroyBlack',
      lineHeight: 30,
    },

    subtitle: {
      color: app_colors.white_eighty,
      fontSize: 13,
      fontFamily: 'GilroyRegular',
      marginTop: 4,
    },
  },

  // ── Module card ───────────────────────────────────────────────
  moduleCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 14,
    overflow: 'hidden' as 'hidden',
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    backgroundColor: '#111',

    inner: {
      padding: 16,
    },

    header: {
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      justifyContent: 'space-between' as 'space-between',
      marginBottom: 10,
    },

    levelBadge: {
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },

    levelText: {
      color: app_colors.white,
      fontFamily: 'GilroyBlack',
      fontSize: 12,
      textTransform: 'uppercase' as 'uppercase',
      letterSpacing: 0.5,
    },

    completedBadge: {
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      gap: 4,
    },

    completedIcon: {
      width: 16,
      height: 16,
      tintColor: '#4CAF82',
    },

    completedText: {
      color: '#4CAF82',
      fontFamily: 'GilroyBold',
      fontSize: 12,
    },

    description: {
      color: app_colors.white_sixty,
      fontFamily: 'GilroyRegular',
      fontSize: 13,
      lineHeight: 19,
      marginBottom: 14,
    },

    progressRow: {
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      justifyContent: 'space-between' as 'space-between',
      marginBottom: 8,
    },

    progressText: {
      color: app_colors.white_sixty,
      fontFamily: 'GilroyRegular',
      fontSize: 12,
    },

    progressBar: {
      height: 4,
      backgroundColor: app_colors.white_twenty,
      borderRadius: 4,
      overflow: 'hidden' as 'hidden',

      fill: {
        height: '100%' as '100%',
        borderRadius: 4,
      },
    },

    cta: {
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      marginTop: 14,
      paddingVertical: 10,
      borderRadius: 10,
      gap: 6,
    },

    ctaText: {
      color: app_colors.white,
      fontFamily: 'GilroyBold',
      fontSize: 14,
    },

    ctaIcon: {
      width: 16,
      height: 16,
      tintColor: app_colors.white,
    },
  },

  // ── Resource list item ────────────────────────────────────────
  resourceItem: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#111',
    borderRadius: 12,
    overflow: 'hidden' as 'hidden',
    borderWidth: 1,
    borderColor: app_colors.white_twenty,

    thumbnail: {
      width: 100,
      height: 72,
    },

    playOverlay: {
      position: 'absolute' as 'absolute',
      top: 0,
      left: 0,
      width: 100,
      height: 72,
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },

    playIcon: {
      width: 28,
      height: 28,
      tintColor: app_colors.white,
    },

    content: {
      flex: 1,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },

    title: {
      color: app_colors.white,
      fontFamily: 'GilroyBold',
      fontSize: 13,
      lineHeight: 18,
      marginBottom: 4,
    },

    meta: {
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      gap: 8,
    },

    duration: {
      color: app_colors.white_sixty,
      fontFamily: 'DMMonoRegular',
      fontSize: 11,
    },

    checkIcon: {
      width: 16,
      height: 16,
    },
  },

  // ── Resource detail screen ────────────────────────────────────
  resourcePage: {
    videoContainer: {
      width: '100%' as '100%',
      height: 220,
      backgroundColor: '#000',
    },

    webview: {
      flex: 1,
    },

    thumbnailOverlay: {
      flex: 1,
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      backgroundColor: '#000',
    },

    thumbnailImage: {
      width: '100%' as '100%',
      height: '100%' as '100%',
      position: 'absolute' as 'absolute',
    },

    playButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: 'rgba(255,255,255,0.9)',
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
    },

    playIcon: {
      width: 28,
      height: 28,
      tintColor: '#000',
      marginLeft: 4,
    },

    body: {
      padding: 16,
      paddingBottom: 120,
    },

    title: {
      color: app_colors.white,
      fontFamily: 'GilroyBlack',
      fontSize: 20,
      lineHeight: 26,
      marginBottom: 10,
    },

    metaRow: {
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      gap: 12,
      marginBottom: 16,
    },

    metaBadge: {
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      gap: 4,
      backgroundColor: app_colors.white_twenty,
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },

    metaIcon: {
      width: 14,
      height: 14,
      tintColor: app_colors.white_sixty,
    },

    metaText: {
      color: app_colors.white_sixty,
      fontFamily: 'DMMonoRegular',
      fontSize: 12,
    },

    description: {
      color: app_colors.white_eighty,
      fontFamily: 'GilroyRegular',
      fontSize: 14,
      lineHeight: 22,
    },

    completeButton: {
      position: 'absolute' as 'absolute',
      bottom: 30,
      left: 16,
      right: 16,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      flexDirection: 'row' as 'row',
      gap: 8,
    },

    completeIcon: {
      width: 20,
      height: 20,
    },

    completeText: {
      fontFamily: 'GilroyBlack',
      fontSize: 15,
      textTransform: 'uppercase' as 'uppercase',
      letterSpacing: 0.5,
    },
  },
};
