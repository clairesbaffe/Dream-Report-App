import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useNavigation } from "@react-navigation/native";

import { View } from "@/components/Themed";
import { useState } from "react";

export default function ResetAllDreams({
  visible,
  resetAll,
  dreamId,
  buttonTitle,
  dialogTitle,
  dialogText,
}: {
  visible: Boolean,
  resetAll: Boolean;
  dreamId: Number;
  buttonTitle: String;
  dialogTitle: String;
  dialogText: String;
}) {
  const navigation = useNavigation();

  const [visibleDialog, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const handleResetDreams = async () => {
    try {
      if (resetAll) {
        AsyncStorage.clear();
        console.log("Dreams list reset");
      } else {
        const existingData = await AsyncStorage.getItem("dreamFormDataArray");
        let formDataArray = existingData ? JSON.parse(existingData) : [];

        formDataArray = formDataArray.filter((element: any) => element.id !== dreamId);

        await AsyncStorage.setItem(
          "dreamFormDataArray",
          JSON.stringify(formDataArray)
        );
      }

      hideDialog();

      navigation.goBack();
    } catch (error) {
      console.error("Error while reseting datas:", error);
    }
  };

  return (
    
    <View style={[styles.container, visible ? {} : { display: 'none' }]}>
      <Button mode="contained-tonal" onPress={showDialog} style={styles.button}>
        {buttonTitle}
      </Button>
      <Portal>
        <Dialog visible={visibleDialog} onDismiss={hideDialog}>
          <Dialog.Title>{dialogTitle}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{dialogText}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleResetDreams}>OK</Button>
            <Button onPress={hideDialog}>Cancel</Button>
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
    margin: 8,
    backgroundColor: '#FF6363'
  },
});
