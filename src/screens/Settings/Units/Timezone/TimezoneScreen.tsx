import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { ScreenHeader } from "../../../../components/ScreenHeader/ScreenHeader";
import { InputWithIcon } from "../../../../components/InputWithIcon/InputWithIcon";
import { globalStyles } from "../../../../helpers/globalStyles";
import { useUserDataStore } from "../../../../store/userData.store";
import { useTranslation } from "react-i18next";
import { Check, Search } from "lucide-react-native";
import { app_colors } from "../../../../helpers/variables";
import { timezoneScreenStyles } from "./TimezoneScreen.styles";
import { ALL_TIMEZONES } from "../../../../helpers/timezones";

const TimezoneScreen = () => {
  const router = useRouter();
  const { t } = useTranslation("settings");
  const currentTimezone = useUserDataStore((state) => state.units.timezone);
  const setTimezone = useUserDataStore((state) => state.setTimezone);

  const [searchQuery, setSearchQuery] = useState("");

  // Filtrage en direct (à chaque frappe) : simple filtre sur un tableau déjà en
  // mémoire, pas un appel réseau — pas besoin d'attendre une validation ici.
  const filteredTimezones = useMemo(() => {
    if (!searchQuery.trim()) return ALL_TIMEZONES;
    const query = searchQuery.toLowerCase();
    return ALL_TIMEZONES.filter((timezone) => timezone.toLowerCase().includes(query));
  }, [searchQuery]);

  const handleSelect = (timezone: string | null) => {
    setTimezone(timezone);
    router.back();
  };

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("units.timezone.title")} main={false} />
      <View style={globalStyles.content}>
        <View style={timezoneScreenStyles.searchContainer}>
          <InputWithIcon
            icon={Search}
            placeholder={t("units.timezone.searchPlaceholder")}
            value={searchQuery}
            onChangeText={setSearchQuery}
            action={() => {}}
          />
        </View>

        {/* flex: 1 nécessaire : une View dans une colonne flex ne prend pas la place
            restante par défaut en React Native (flexShrink: 0 implicite) — sans ça la
            liste ne peut pas défiler correctement. */}
        <View style={[globalStyles.content.heroCard, { flex: 1 }]}>
          <FlatList
            style={{ flex: 1 }}
            data={filteredTimezones}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <TouchableOpacity
                style={[
                  globalStyles.content.heroCard.item,
                  filteredTimezones.length > 0 && globalStyles.content.heroCard.item.withBorder,
                ]}
                onPress={() => handleSelect(null)}
              >
                <Text style={timezoneScreenStyles.itemText}>{t("units.timezone.automatic")}</Text>
                {currentTimezone === null && <Check size={18} color={app_colors.accent.main} />}
              </TouchableOpacity>
            }
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  globalStyles.content.heroCard.item,
                  index !== filteredTimezones.length - 1 && globalStyles.content.heroCard.item.withBorder,
                  { paddingTop: 10 },
                ]}
                onPress={() => handleSelect(item)}
              >
                <Text style={timezoneScreenStyles.itemText}>{item.replace(/_/g, " ")}</Text>
                {currentTimezone === item && <Check size={18} color={app_colors.accent.main} />}
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default TimezoneScreen;
