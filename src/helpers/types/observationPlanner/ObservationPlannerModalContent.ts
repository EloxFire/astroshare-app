export type ObservationPlannerModalContent = {
  type: 'info' | 'warn' | 'error';
  title: string;
  text: string;
  buttons: {
    label: string;
    onPress: () => void;
    backgroundColor: string;
    foregroundColor: string;
    borderColor: string
  }[];
}