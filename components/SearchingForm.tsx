import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { TextInput } from "react-native-paper";

const { width } = Dimensions.get("window");

export default function SearchingForm({
  searchStringSetter,
}: {
  searchStringSetter: any;
}) {
  const handlePressOutside = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View style={styles.container}>
        <TextInput
          label="Search..."
          onChangeText={(searchString) => searchStringSetter(searchString)}
          mode="outlined"
          style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});
