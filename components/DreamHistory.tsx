import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import PresentationCard from "@/components/PresentationCard";
import SearchingForm from "@/components/SearchingForm";

export default function DreamHistory() {
  const [dreamData, setDreamData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [searchString, setSearchString] = useState("");

  // watch la donnée. Watcher uniquement des données simples
  useEffect(() => {
    const fetchData = async () => {
      try {
        const existingData = await AsyncStorage.getItem("dreamFormDataArray");
        const formDataArray = existingData ? JSON.parse(existingData) : [];
        if (formDataArray) setDreamData(formDataArray);

        if (!searchString || searchString == "") {
          setFilteredData(dreamData);
        }
      } catch (error) {
        console.error("Error while accessing to data:", error);
      }
    };

    fetchData();
  }, [dreamData]);

  useEffect(() => {
    if (searchString && searchString != "") {
      const filteredData = dreamData.filter((item: any) => {
        return (
          item.title.toLowerCase().includes(searchString.toLowerCase()) ||
          item.date.toLowerCase().includes(searchString.toLowerCase())
        );
      });
      setFilteredData(filteredData);
    } else {
      setFilteredData(dreamData);
    }
  }, [searchString]);

  const updateSearchString = (searchField: String) => {
    setSearchString(searchField);
  };

  return (
    <View style={styles.container}>
      <SearchingForm searchStringSetter={updateSearchString} />
      {filteredData
      // sort by date DESC
        .sort((a, b) => {
          return (
            // to actually sort by date (date is saved in dd/mm/yyyy format)
            b.date.split("/").reverse().join("") -
            a.date.split("/").reverse().join("")
          );
        })
        .map((item, index) => (
          <PresentationCard dream={item} key={index} />
        ))}
    </View>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    marginTop: 8,
  },
});
