import * as React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { Chip } from "react-native-paper";

import { Link } from "expo-router";

import FontAwesome from "@expo/vector-icons/FontAwesome";

const PresentationCard = ({ dream }: { dream: any }) => {

  return (
    <View style={styles.container}>
      <Link
        href={{
          pathname: "/EditDream",
          params: { dreamData: JSON.stringify(dream) },
        }}
        asChild
      >
        <Pressable>
          {({ pressed }) => (
            <FontAwesome
              name="pencil-square-o"
              size={25}
              style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
            />
          )}
        </Pressable>
      </Link>

      <Text style={styles.title}>{dream.title}</Text>
      <Text style={styles.title}>{dream.date}</Text>

      {dream.isLucid && <Text style={styles.title}>Lucid Dream !</Text>}
      <Text style={styles.description}>{dream.description.replace(/\\n/g, '\n')}</Text>

      {dream.apiCategories[0] && <Text style={styles.title}>Categories : </Text>}
      <View style={styles.chipContainer}>
        {dream.apiCategories.map((item: any, index: any) => (
          <Chip style={styles.chip} mode="outlined" key={index}>
            {item}
          </Chip>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginHorizontal: 0,
    marginVertical: 10,

    backgroundColor: "white",

    borderWidth: 1,
    borderColor: "rgba(100, 100, 111, 0.3)",
    borderRadius: 15,

    shadowColor: "rgba(100, 100, 111, 1)",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.3,
    shadowRadius: 29,
    elevation: 7,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  input: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    fontWeight: "normal",
    textAlign: "center",
  },
  button: {
    marginTop: 8,
  },
  chip: {
    margin: 2,
    width: "auto",
  },
});

export default PresentationCard;
