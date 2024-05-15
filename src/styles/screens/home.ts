import { app_colors } from "../../helpers/constants";

export const homeStyles = {
  toolsSuggestions: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    marginTop: 10,
    marginBottom: 10,

    buttons: {
      display: 'flex' as 'flex',
      flexDirection: 'column' as 'column',
    }
  },
  searchResults: {
    marginBottom: 25,
    marginTop: 10,
    height: 210,
  },
  nasaTools: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    marginTop: 10,
    marginBottom: 10,

    buttons: {
      display: 'flex' as 'flex',
      flexDirection: 'row' as 'row',
      justifyContent: 'space-between' as 'space-between',
      flexWrap: 'wrap' as 'wrap',
    }
  },
}