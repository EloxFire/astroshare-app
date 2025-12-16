import {app_colors} from "../../../helpers/constants";

const containerBase = {
  display: 'flex' as 'flex',
  flexDirection: 'column' as 'column',
  backgroundColor: app_colors.white_no_opacity,
  borderWidth: 1,
  borderColor: app_colors.white_twenty,
  borderRadius: 10,
  padding: 10,
}

export const calculationHomeStyles = {
  content: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 10,
    paddingBottom: 20,

    input:{
      borderWidth: 1,
      borderColor: app_colors.white_twenty,
      borderRadius: 10,
      color: app_colors.white,
      backgroundColor: app_colors.white_no_opacity,
      minWidth: 140,
      maxWidth: 140,
      margin: 0,
      marginBottom: 5,
      fontSize: 12,
    },

    container: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
      backgroundColor: app_colors.white_no_opacity,
      borderWidth: 1,
      borderColor: app_colors.white_twenty,
      borderRadius: 10,
      padding: 10,
    },

    title: {
      fontSize: 18,
      fontFamily: 'GilroyBlack',
      color: app_colors.white
    },

    description: {
      fontSize: 12,
      fontFamily: 'DMMonoRegular',
      color: app_colors.white,
      opacity: .5,
    },

    text: {
      fontSize: 15,
      fontFamily: 'GilroyRegular',
      color: app_colors.white,
    },

    focalContainer: {
      ...containerBase
    },

    magnificationContainer: {
      ...containerBase
    },

    minimumMagnificationContainer: {
      ...containerBase
    },

    samplingContainer: {
      ...containerBase
    }
  },

  sectionCard: {
    ...containerBase,
    gap: 12,
  },

  sectionHeader: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: 'GilroyBlack',
    color: app_colors.white,
  },

  sectionSubtitle: {
    fontSize: 12,
    fontFamily: 'GilroyRegular',
    color: app_colors.white,
    opacity: .7,
  },

  row: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    gap: 10,
  },

  label: {
    fontSize: 12,
    fontFamily: 'GilroyRegular',
    color: app_colors.white,
    opacity: .8,
    marginBottom: 6,
  },

  chipRow: {
    flex: 1,
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    gap: 8,
  },

  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    backgroundColor: app_colors.white_no_opacity,
    display: 'flex' as 'flex',
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
  },

  chipActive: {
    backgroundColor: app_colors.white_twenty,
  },

  chipText: {
    color: app_colors.white,
    fontFamily: 'GilroyRegular',
    fontSize: 12,
    opacity: 0.85,
  },

  actionRow: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 10,
  },

  resultGrid: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    gap: 10,
  },

  resultCard: {
    ...containerBase,
    width: '100%' as '100%',
    minWidth: 160,
    flexGrow: 1,
    gap: 8,
  },

  resultTitle: {
    fontSize: 15,
    fontFamily: 'GilroyBlack',
    color: app_colors.white
  },

  resultDescription: {
    fontSize: 12,
    fontFamily: 'DMMonoRegular',
    color: app_colors.white,
    opacity: .6,
  },
}
