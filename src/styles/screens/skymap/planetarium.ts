import { app_colors } from "../../../helpers/constants";
import {Dimensions} from "react-native";

export const planetariumStyles = {
  loadingScreen: {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: app_colors.black,
    display: 'flex' as 'flex',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    paddingHorizontal: 20,
    zIndex: 11
  },
  loadingPanel: {
    width: '100%' as '100%',
    maxWidth: 420,
    maxHeight: Dimensions.get('window').height - 150,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: app_colors.black_modal,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
  },
  loadingContent: {
    marginTop: 16,
    maxHeight: Dimensions.get('window').height - 250,
  },
  loadingContentInner: {
    paddingBottom: 30,
  },
  loadingTitle: {
    color: app_colors.white,
    fontSize: 22,
    fontWeight: '700' as '700',
    marginTop: 14,
  },
  loadingSubtitle: {
    color: app_colors.white_eighty,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  loadingProgressMeta: {
    color: app_colors.white_sixty,
    fontSize: 12,
  },
  loadingProgressTrack: {
    width: '100%' as '100%',
    height: 6,
    borderRadius: 999,
    overflow: 'hidden' as 'hidden',
    backgroundColor: app_colors.white_twenty,
  },
  loadingProgressFill: {
    height: '100%' as '100%',
    borderRadius: 999,
    backgroundColor: app_colors.green_eighty,
  },
  loadingSectionTitle: {
    color: app_colors.white,
    fontSize: 14,
    fontWeight: '600' as '600',
    marginTop: 10,
  },
  loadingStepRow: {
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    backgroundColor: app_colors.black_sixty,
    marginTop: 8,
  },
  loadingStepRowFirst: {
    marginTop: 0,
  },
  loadingStepRowActive: {
    borderColor: app_colors.green,
    backgroundColor: app_colors.green_sixty,
  },
  loadingStepRowDone: {
    borderColor: app_colors.green_eighty,
    backgroundColor: app_colors.green_twenty,
  },
  loadingStepRowError: {
    borderColor: app_colors.red_eighty,
    backgroundColor: app_colors.red_twenty,
  },
  loadingStepHeader: {
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
    marginBottom: 5,
  },
  loadingStepTitle: {
    color: app_colors.white,
    fontFamily: 'GilroyBlack' as 'GilroyBlack',
    fontSize: 12,
    flexShrink: 1,
    paddingRight: 8,
  },
  loadingStepDetail: {
    color: app_colors.white_eighty,
    fontFamily: 'DMMonoRegular' as 'DMMonoRegular',
    fontSize: 10,
  },
  loadingBadge: {
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    backgroundColor: app_colors.white_no_opacity,
  },
  loadingBadgeActive: {
    borderColor: app_colors.green,
    backgroundColor: app_colors.green_sixty,
  },
  loadingBadgeDone: {
    borderColor: app_colors.green_eighty,
    backgroundColor: app_colors.green_twenty,
  },
  loadingBadgeError: {
    borderColor: app_colors.red_eighty,
    backgroundColor: app_colors.red_twenty,
  },
  loadingBadgeText: {
    color: app_colors.white,
    fontSize: 10,
    fontWeight: '700' as '700',
    letterSpacing: 0.6,
  },
  loadingActivityRow: {
    color: app_colors.white_eighty,
    fontSize: 12,
    fontFamily: 'DMMonoRegular' as 'DMMonoRegular',
    marginTop: 8,
  },
  loadingActivityRowFirst: {
    marginTop: 0,
  },
  loadingErrorText: {
    color: app_colors.red,
  },
  container: {
    backgroundColor: app_colors.black,
    flex: 1,
    position : 'relative' as 'relative',
    zIndex: 3
  }
}
