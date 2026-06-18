import React, { useEffect, useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { app_colors } from '../../helpers/constants';
import { i18n } from '../../helpers/scripts/i18n';

interface DateTimePickerModalProps {
  visible: boolean;
  mode: 'date' | 'time';
  value: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  minimumDate?: Date;
  maximumDate?: Date;
  accentColor?: string;
}

export default function DateTimePickerModal({
  visible,
  mode,
  value,
  onConfirm,
  onCancel,
  minimumDate,
  maximumDate,
  accentColor = app_colors.yellow,
}: DateTimePickerModalProps) {
  const [tempDate, setTempDate] = useState<Date>(value);

  useEffect(() => {
    if (visible) setTempDate(value);
  }, [visible]);

  if (Platform.OS === 'android') {
    if (!visible) return null;
    return (
      <DateTimePicker
        value={value}
        mode={mode}
        display="default"
        themeVariant="dark"
        onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
          if (event.type === 'dismissed') {
            onCancel();
          } else if (event.type === 'set' && selectedDate) {
            onConfirm(selectedDate);
          }
        }}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        accentColor={accentColor}
      />
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onCancel}>
        <TouchableOpacity activeOpacity={1} style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.cancelButton}>{i18n.t('common.other.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onConfirm(tempDate)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.confirmButton}>{i18n.t('common.other.confirm')}</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={tempDate}
            mode={mode}
            display="spinner"
            themeVariant="dark"
            onChange={(_event: DateTimePickerEvent, selectedDate?: Date) => {
              if (selectedDate) setTempDate(selectedDate);
            }}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            accentColor={accentColor}
            style={styles.picker}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    width: '85%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: app_colors.white_twenty,
  },
  cancelButton: {
    color: app_colors.white_sixty,
    fontSize: 16,
  },
  confirmButton: {
    color: app_colors.yellow,
    fontSize: 16,
    fontWeight: '600',
  },
  picker: {
    width: '100%',
  },
});
