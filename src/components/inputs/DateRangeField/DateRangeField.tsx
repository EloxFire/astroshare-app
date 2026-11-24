import { useState } from "react";
import { Modal, Platform, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker, { DateTimePickerChangeEvent } from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { X } from "lucide-react-native";
import { app_colors, spacing } from "../../../helpers/variables";
import { dateRangeFieldStyles } from "./DateRangeField.styles";

type DateRangeTarget = "start" | "end";

interface DateRangeFieldProps {
  startDate: Date;
  endDate: Date;
  // L'invariant "la fin ne peut jamais précéder le début" est géré ici (pas laissé à l'appelant) :
  // en touchant le début, la fin est repoussée d'un jour si besoin ; en touchant la fin, elle est
  // bornée au début.
  onChangeStart: (date: Date) => void;
  onChangeEnd: (date: Date) => void;
  startLabel: string;
  endLabel: string;
  pickerStartTitle: string;
  pickerEndTitle: string;
  doneLabel: string;
}

/**
 * Sélecteur de période (dates de début/fin), en date seule (pas d'heure) : même découpage Android
 * (boîte de dialogue native) / iOS (panneau maison, pas de mode "datetime" en boîte système) que les
 * dates d'AddSession (Journal), extrait ici pour un 2e usage (transits ISS, conjonctions) plutôt que
 * dupliqué une 3e fois. Pas de dépendance i18n propre : les libellés viennent de l'appelant (comme
 * InputWithIcon/SelectInput), chaque écran garde ses clés dans son propre namespace.
 */
const DateRangeField = ({ startDate, endDate, onChangeStart, onChangeEnd, startLabel, endLabel, pickerStartTitle, pickerEndTitle, doneLabel }: DateRangeFieldProps) => {
  const insets = useSafeAreaInsets();
  const [activeTarget, setActiveTarget] = useState<DateRangeTarget | null>(null);

  const openDatePicker = (target: DateRangeTarget) => setActiveTarget(target);
  const closeIosDatePicker = () => setActiveTarget(null);

  const handleDatePickerChange = (_event: DateTimePickerChangeEvent, selectedDate: Date) => {
    if (!activeTarget) return;

    if (activeTarget === "start") {
      onChangeStart(selectedDate);
      if (selectedDate >= endDate) onChangeEnd(dayjs(selectedDate).add(1, "day").toDate());
    } else {
      onChangeEnd(selectedDate < startDate ? startDate : selectedDate);
    }

    // Android : la boîte de dialogue se ferme déjà seule après sélection, contrairement au panneau
    // iOS (fermé explicitement via son bouton "Valider").
    if (Platform.OS === "android") setActiveTarget(null);
  };

  return (
    <>
      <View style={dateRangeFieldStyles.dateRow}>
        <TouchableOpacity style={dateRangeFieldStyles.dateRow.field} onPress={() => openDatePicker("start")}>
          <Text style={dateRangeFieldStyles.dateRow.field.label}>{startLabel}</Text>
          <Text style={dateRangeFieldStyles.dateRow.field.value}>{dayjs(startDate).format("DD/MM/YYYY")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dateRangeFieldStyles.dateRow.field} onPress={() => openDatePicker("end")}>
          <Text style={dateRangeFieldStyles.dateRow.field.label}>{endLabel}</Text>
          <Text style={dateRangeFieldStyles.dateRow.field.value}>{dayjs(endDate).format("DD/MM/YYYY")}</Text>
        </TouchableOpacity>
      </View>

      {Platform.OS === "android" && activeTarget && (
        <DateTimePicker
          value={activeTarget === "start" ? startDate : endDate}
          mode="date"
          display="default"
          minimumDate={activeTarget === "end" ? startDate : undefined}
          onValueChange={handleDatePickerChange}
          onDismiss={() => setActiveTarget(null)}
        />
      )}

      {Platform.OS === "ios" && (
        <Modal
          visible={activeTarget !== null}
          animationType="slide"
          transparent
          statusBarTranslucent
          navigationBarTranslucent
          onRequestClose={closeIosDatePicker}
        >
          <View style={dateRangeFieldStyles.pickerSheet.backdrop}>
            <Pressable style={dateRangeFieldStyles.pickerSheet.dismissArea} onPress={closeIosDatePicker} />

            <View style={[dateRangeFieldStyles.pickerSheet.container, { paddingBottom: spacing.modalSheet.bottom + insets.bottom }]}>
              <View style={dateRangeFieldStyles.pickerSheet.container.header}>
                <Text style={dateRangeFieldStyles.pickerSheet.container.header.title}>
                  {activeTarget === "start" ? pickerStartTitle : pickerEndTitle}
                </Text>
                <TouchableOpacity onPress={closeIosDatePicker} accessibilityRole="button" hitSlop={10}>
                  <X color={app_colors.primary.main} size={20} />
                </TouchableOpacity>
              </View>

              {activeTarget && (
                <DateTimePicker
                  value={activeTarget === "start" ? startDate : endDate}
                  mode="date"
                  display="spinner"
                  minimumDate={activeTarget === "end" ? startDate : undefined}
                  onValueChange={handleDatePickerChange}
                />
              )}

              <TouchableOpacity style={dateRangeFieldStyles.pickerSheet.container.doneButton} onPress={closeIosDatePicker}>
                <Text style={dateRangeFieldStyles.pickerSheet.container.doneButton.text}>{doneLabel}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default DateRangeField;
