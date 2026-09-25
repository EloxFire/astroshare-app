import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { useUserDataStore } from "../../../../store/userData.store"
import { globalStyles } from "../../../../helpers/globalStyles"
import { ScreenHeader } from "../../../../components/ScreenHeader/ScreenHeader"
import { useTranslation } from "react-i18next"
import { Pencil } from "lucide-react-native"
import { observatoryDetailsStyles } from "./ObservatoryDetails.styles"

const ObservatoryDetails = () => {

  const { t } = useTranslation("settings")
  const userObservatories = useUserDataStore((state) => state.observatories)
  const observatoryId = useLocalSearchParams().observatory as string

  const observatory = userObservatories.find((observatory) => observatory.id === observatoryId)

  if (!observatory) {
    router.push("/settings/observatories")
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t('observatoryDetails.screenTitle')} main={false} />

      <ScrollView>
        <View style={[globalStyles.screen.content, {backgroundColor: 'transparent'}]}>
          <Text style={observatoryDetailsStyles.title}>{observatory?.name}</Text>
        </View>
      </ScrollView>
      
      <View style={globalStyles.screen.content}>
        <TouchableOpacity style={globalStyles.button} onPress={() => router.push("/settings/observatories")}>
          <Pencil color="white" size={14} />
          <Text style={globalStyles.button.text}>{t('observatoryDetails.editButton')}</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

export default ObservatoryDetails