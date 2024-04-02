import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useNavigation } from "@react-navigation/native";

import TextualInfo from "@/components/TextualInfo";
import { Text, View } from "@/components/Themed";

export default function ResetAllDreams() {
  const navigation = useNavigation();

  const handleResetDreams = async () => {
    try {
      AsyncStorage.clear();
      console.log("Liste des rêves réinitialisée");

      navigation.goBack();
      
    } catch (error) {
      console.error("Erreur lors de la réinitialisation des données:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset all dreams</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <TextualInfo text="This operation is irreversible, do you really want to reset all your dreams ?" />
      <Button
        mode="contained-tonal"
        onPress={handleResetDreams}
        style={styles.button}
      >
        Reset all dreams
      </Button>

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
