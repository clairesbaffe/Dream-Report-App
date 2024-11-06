import {
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { View } from "@/components/Themed";
import DreamForm from "@/components/DreamForm";

const handlePressOutside = () => {
  Keyboard.dismiss();
};

export default function TabOneScreen() {
  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <ScrollView>
        <View style={styles.container}>
          <DreamForm dreamData={null} update={false} />
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
