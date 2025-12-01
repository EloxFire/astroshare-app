import { app_colors } from "../../../helpers/constants";

export const observationPlannerComponentsStyles = {
  sectionTitle: {
    color: app_colors.white,
    fontFamily: 'GilroyBlack',
    fontSize: 18,
    textTransform: 'uppercase' as 'uppercase',
  },
  sectionSubtitle: {
    color: app_colors.white_sixty,
    fontFamily: 'DMMonoRegular',
    fontSize: 11,
    marginBottom: 10,
  },
  helperText: {
    color: app_colors.white_sixty,
    fontFamily: 'DMMonoRegular',
    fontSize: 11,
    marginTop: 6,
  },
  row: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
    gap: 10,
    flexWrap: 'wrap' as 'wrap',
    marginBottom: 10,
  },
  inputsRow: {
    display: 'flex' as 'flex',
    flexDirection: 'row' as 'row',
    gap: 10,
    flexWrap: 'wrap' as 'wrap',
    marginVertical: 10,
  },
  inputGroup: {
    flex: 1,
    minWidth: 120,

    label: {
      color: app_colors.white,
      fontFamily: 'GilroyMedium',
      fontSize: 12,
      marginBottom: 4,
    },
    input: {
      backgroundColor: app_colors.white_no_opacity,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
      color: app_colors.white,
      borderWidth: 1,
      borderColor: app_colors.white_twenty,
      fontFamily: 'DMMonoRegular',
    },
  },
  card: {
    backgroundColor: app_colors.grey,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: app_colors.white_twenty,
    padding: 12,
    marginTop: 12,

    header: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      alignItems: 'center' as 'center',
      justifyContent: 'space-between' as 'space-between',
      marginBottom: 8,
    },
    title: {
      color: app_colors.white,
      fontFamily: 'GilroyBlack',
      fontSize: 18,
      textTransform: 'uppercase' as 'uppercase',
    },
    subtitle: {
      color: app_colors.white_sixty,
      fontFamily: 'DMMonoRegular',
      fontSize: 11,
      marginTop: 2,
    },
    badges: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      flexWrap: 'wrap' as 'wrap',
      gap: 6,
      marginBottom: 8,
    },
  },
};
