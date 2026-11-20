import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { Plus } from "lucide-react-native";
import { globalStyles } from "../../../helpers/globalStyles";
import { app_colors, withOpacity } from "../../../helpers/variables";
import { ScreenHeader } from "../../../components/layout/ScreenHeader/ScreenHeader";
import CircularGauge from "../../../components/charts/CircularGauge/CircularGauge";
import { useUserDataStore } from "../../../store/userData.store";
import ChecklistCard from "./components/ChecklistCard/ChecklistCard";
import { checklistCardStyles } from "./components/ChecklistCard/ChecklistCard.styles";
import CreateChecklistModal from "./components/CreateChecklistModal/CreateChecklistModal";
import { checklistsScreenStyles } from "./ChecklistsScreen.styles";
import Button from "../../../components/buttons/Button/Button";

const ChecklistsScreen = () => {
  const { t } = useTranslation("tools/checklists/screen");

  const checklists = useUserDataStore((state) => state.checklists);
  const uncheckAllChecklistItems = useUserDataStore((state) => state.uncheckAllChecklistItems);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const totalItems = checklists.reduce((total, checklist) => total + checklist.items.length, 0);
  const totalChecked = checklists.reduce((total, checklist) => total + checklist.items.filter((item) => item.checked).length, 0);
  const totalRemainingItems = totalItems - totalChecked;

  const overviewSubtitle = checklists.length === 0
    ? t("overview.noLists")
    : totalItems === 0
      ? t("overview.noItems")
      : totalRemainingItems === 0
        ? t("overview.allDone")
        : t("overview.remaining", { count: totalRemainingItems });

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("title")} subtitle={t("subtitle", { listsCount: checklists.length, itemsCount: totalRemainingItems })} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>
          <View style={checklistsScreenStyles.overview}>
            <CircularGauge
              value={totalChecked}
              max={totalItems || 1}
              size={56}
              strokeWidth={5}
              progressColor={app_colors.yellow.main}
              trackColor={withOpacity(app_colors.white, 0.25)}
            >
              <Text style={checklistsScreenStyles.overview.ringValue}>{totalItems === 0 ? "–" : `${totalChecked}/${totalItems}`}</Text>
            </CircularGauge>

            <View style={checklistsScreenStyles.overview.texts}>
              <Text style={checklistsScreenStyles.overview.texts.title}>{t("overview.title")}</Text>
              <Text style={checklistsScreenStyles.overview.texts.subtitle}>{overviewSubtitle}</Text>
            </View>
          </View>

          <View style={checklistCardStyles.grid}>
            {
              checklists.map((checklist) => (
                <ChecklistCard
                  key={checklist.id}
                  checklist={checklist}
                  onPress={() => router.push(`/tools/checklists/${checklist.id}`)}
                  onReset={() => uncheckAllChecklistItems(checklist.id)}
                />
              ))
            }

            <Button
              label={t("addNew")}
              icon={Plus}
              onPress={() => setIsCreateModalOpen(true)}
              style={checklistCardStyles.addCard}
            />
          </View>
        </View>
      </ScrollView>

      {isCreateModalOpen && <CreateChecklistModal onClose={() => setIsCreateModalOpen(false)} />}
    </View>
  );
};

export default ChecklistsScreen;
