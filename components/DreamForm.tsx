import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { TextInput, Button, Checkbox } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DatePicker from "@/components/DatePicker";

import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function DreamForm({
  dreamData,
  update,
}: {
  dreamData: any;
  update: Boolean;
}) {
  const navigation = useNavigation();

  const [dreamTitle, setDreamTitle] = useState("");
  const [dreamText, setDreamText] = useState("");
  const [isLucidDream, setIsLucidDream] = useState(false);
  const [dreamDate, setDreamDate] = useState(new Date(Date.now()));

  let categoriesToRecord: any[] = [];

  const [apiResponse, setApiResponse] = useState(null);

  useEffect(() => {
    if (dreamData) {
      setDreamTitle(dreamData.title);
      setDreamText(dreamData.description.replace(/\\n/g, "\n"));
      setIsLucidDream(dreamData.isLucid);
      const [day, month, year] = dreamData.date.split("/");
      setDreamDate(new Date(year, month - 1, day));
    }
  }, []);

  const handleDreamSubmission = async () => {
    // Dream submission processing logic
    console.log(
      "Submitted dream:",
      dreamTitle,
      dreamText,
      "Date:",
      dreamDate.toLocaleDateString("fr"),
      "Lucid:",
      isLucidDream
    );

    try {
      // --------------------- MEANINGCLOUD API ---------------------
      const apiUrl = "https://api.meaningcloud.com/topics-2.0";
      const language = "en";
      const tmpDream = dreamText;
      const apiKey = "b8f86bc3db5dbe851f2cafbfaeffe8fe";
      const formdata = new FormData();
      formdata.append("key", apiKey);
      formdata.append("txt", tmpDream);
      formdata.append("lang", language);

      const requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };

      const response = await fetch(apiUrl, requestOptions);
      const responseData = await response.json();

      setApiResponse(responseData);
      console.log("apiResponse : ", apiResponse);

      responseData.concept_list.forEach((element: any) => {
        categoriesToRecord.push(element.form);
      });

      responseData.entity_list.forEach((element: any) => {
        categoriesToRecord.push(element.form);
      });

      setApiResponse(null);

      let modifiedText = dreamText.replace(/\n/g, "\\n");

      // --------------------- RECORD DATA ON ASYNCSTORAGE ---------------------
      // Get current data array from AsyncStorage
      const existingData = await AsyncStorage.getItem("dreamFormDataArray");
      let formDataArray = existingData ? JSON.parse(existingData) : [];

      let dataId;
      if (update) {
        dataId = dreamData.id;
      } else {
        if (formDataArray[0])
          dataId = formDataArray[formDataArray.length - 1].id + 1 || 1;
        else dataId = 1;
      }

      const newDreamToPush = {
        id: dataId,
        title: dreamTitle,
        description: modifiedText,
        isLucid: isLucidDream,
        date: dreamDate.toLocaleDateString("fr"),
        apiCategories: categoriesToRecord,
      };

      if (update) {
        // Update current data
        formDataArray = formDataArray.map((dreamElement: any) => {
          if (dreamElement.id === dreamData.id) {
            return newDreamToPush;
          } else {
            return dreamElement;
          }
        });
      } else {
        // Add new object to data
        formDataArray.push(newDreamToPush);
      }

      // Save updated array in AsyncStorage
      await AsyncStorage.setItem(
        "dreamFormDataArray",
        JSON.stringify(formDataArray)
      );

      const consoleTmp = await AsyncStorage.getItem("dreamFormDataArray");
      console.log("AsyncStorage: ", consoleTmp);

      if (update) {
        // Redirect to history page
        navigation.goBack();
      } else {
        // Reset form
        setDreamTitle("");
        setDreamText("");
        setIsLucidDream(false);
        setDreamDate(new Date(Date.now()));
        categoriesToRecord = [];
      }
    } catch (error) {
      console.error("Error while saving datas:", error);
    }
  };

  const updateDate = (date: Date) => {
    setDreamDate(date);
  };

  return (
    <View style={styles.container}>
      <DatePicker dateSetter={updateDate} dreamDate={dreamDate} />

      <TextInput
        label="Title"
        value={dreamTitle}
        onChangeText={(text) => setDreamTitle(text)}
        mode="outlined"
        style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
      />

      <TextInput
        label="Description"
        value={dreamText}
        onChangeText={(text) => setDreamText(text)}
        mode="outlined"
        multiline
        numberOfLines={8}
        style={[styles.input, { width: width * 0.8, alignSelf: "center" }]}
      />
      <View style={styles.checkboxContainer}>
        <Checkbox.Item
          label="Lucid dream"
          status={isLucidDream ? "checked" : "unchecked"}
          onPress={() => setIsLucidDream(!isLucidDream)}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleDreamSubmission}
        style={styles.button}
      >
        Submit
      </Button>
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
  button: {
    marginTop: 8,
  },
});
