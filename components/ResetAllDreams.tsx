import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useNavigation } from "@react-navigation/native";

import { View } from "@/components/Themed";
import { useState } from "react";

export default function ResetAllDreams() {
  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const handleResetDreams = async () => {
    try {
      AsyncStorage.clear();
      console.log("Liste des rêves réinitialisée");
      hideDialog();

      navigation.goBack();
    } catch (error) {
      console.error("Erreur lors de la réinitialisation des données:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        mode="contained-tonal"
        onPress={showDialog}
        style={styles.button}
      >
        Reset all dreams
      </Button>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Are you sure ?</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              This operation is irreversible, do you really want to reset all
              your dreams ?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={handleResetDreams}>I am sure</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  button: {
    marginTop: 8,
  },
});
