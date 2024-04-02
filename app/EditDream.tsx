// app/(tabs)/three.tsx
import {
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { View } from "@/components/Themed";

import { useLocalSearchParams } from "expo-router";

import DreamForm from "@/components/DreamForm";

export default function EditDream() {
  const params = useLocalSearchParams();
  let { dreamData } = params;
  
  dreamData = JSON.parse(dreamData);
  

  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <ScrollView>
        <View style={styles.container}>
          <DreamForm dreamData={dreamData} update={true} />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
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
});
