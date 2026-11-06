import { View } from "react-native"
import { useTranslation } from "react-i18next"
import { globalStyles } from "../../../../../../helpers/globalStyles"
import { ScreenHeader } from "../../../../../../components/ScreenHeader/ScreenHeader"

const TelescopeDetails = () => {
  const { t } = useTranslation("tools/journal")

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("gear.telescopes.details.title")} main={false} />
      <View style={globalStyles.content}>
      </View>
    </View>
  )
}

export default TelescopeDetails
