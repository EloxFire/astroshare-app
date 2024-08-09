import { app_colors } from "../../helpers/constants";

export const tutorialStyles = {
  content: {
    flex: 1,
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    justifyContent: 'space-between' as 'space-between',
    paddingVertical: 20,

    bottomBar: {
      height: 100,
      width: '100%' as '100%',
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      alignItems: 'center' as 'center',

      dots: {
        display: 'flex' as 'flex',
        flexDirection: 'row' as 'row',
        justifyContent: 'space-between' as 'space-between',
        alignItems: 'center' as 'center',

        dot: {
          width: 10,
          height: 10,
          borderRadius: 10,
          marginHorizontal: 3,
          marginVertical: 3,
        }
      }
    }
  },
}