import { Alert } from "react-native";

export const onClose = (onConfirm: (value?: string) => void) => {
  Alert.alert("Avslutte?", "Da må du begynne på nytt neste gang", [
    {
      text: "Nei",
      onPress: () => {},
      style: "cancel",
    },
    {
      text: "Ja",
      onPress: onConfirm,
      style: "destructive",
    },
  ]);
};