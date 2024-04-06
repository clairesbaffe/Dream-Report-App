import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Pressable } from "react-native";
import {
  TextInput,
  Button,
  Checkbox,
  Chip,
  Text,
  Dialog,
  Portal,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DatePicker from "@/components/DatePicker";
import DeleteDreams from "@/components/DeleteDreams";

import { useNavigation } from "@react-navigation/native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { AntDesign } from "@expo/vector-icons";

import ApiKeyService from '../ApiKeyService';

const { width } = Dimensions.get("window");

export default function DreamForm({
  dreamData,
  update,
}: {
  dreamData: any;
  update: Boolean;
}) {
  const navigation = useNavigation();

  const [visibleDialog, setVisibleDialog] = useState(false);
  const showDialog = () => setVisibleDialog(true);
  const hideDialog = () => setVisibleDialog(false);

  const [dreamTitle, setDreamTitle] = useState("");
  const [dreamText, setDreamText] = useState("");
  const [isLucidDream, setIsLucidDream] = useState(false);
  const [dreamDate, setDreamDate] = useState(new Date(Date.now()));
  const [apiCategoriesDream, setApiCategoriesDream] = useState([]);
  const [newCategory, setNewCategory] = useState("");

  let categoriesToRecord: any[] = [];

  const [useAICategories, setUseAICategories] = useState(true);

  useEffect(() => {
    if (dreamData) {
      setDreamTitle(dreamData.title);
      setDreamText(dreamData.description.replace(/\\n/g, "\n"));
      setIsLucidDream(dreamData.isLucid);

      const [day, month, year] = dreamData.date.split("/");
      setDreamDate(new Date(year, month - 1, day));

      setApiCategoriesDream(dreamData.apiCategories);
      setUseAICategories(false);
    }
  }, []);

  const handleSubmissionButton = () => {
    if (update && useAICategories) showDialog();
    else handleDreamSubmission();
  };

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

      if (useAICategories) {
        const apiUrl = "https://api.meaningcloud.com/topics-2.0";
        const language = "en";
        const tmpDream = dreamText;
        const apiKey = ApiKeyService.getApiKey();
        const formdata = new FormData();
        formdata.append("key", apiKey);
        formdata.append("txt", tmpDream);
        formdata.append("lang", language);

        const requestOptions = {
          method: "POST",
          body: formdata,
          redirect: "follow",
        };

        categoriesToRecord = await callMeaningCloudAPI(apiUrl, requestOptions);
      } else {
        apiCategoriesDream.forEach((element: any) => {
          categoriesToRecord.push(element);
        });
      }

      // --------------------- RECORD DATA ON ASYNCSTORAGE ---------------------
      // Get current data array from AsyncStorage
      const existingData = await AsyncStorage.getItem("dreamFormDataArray");
      let formDataArray = existingData ? JSON.parse(existingData) : [];

      // define id
      let dataId;
      if (update) {
        dataId = dreamData.id;
      } else {
        if (formDataArray[0])
          dataId = formDataArray[formDataArray.length - 1].id + 1;
        else dataId = 1;
      }

      let modifiedText = dreamText.replace(/\n/g, "\\n"); // to save as valid JSON

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
        setApiCategoriesDream([]);

        setUseAICategories(true);

        categoriesToRecord = [];
      }
    } catch (error) {
      console.error("Error while saving datas:", error);
    }
  };

  const updateDate = (date: Date) => {
    setDreamDate(date);
  };

  const handleDeleteCategory = (indexToDelete: any) => {
    setApiCategoriesDream((prevCategories) =>
      prevCategories.filter((_, index) => index !== indexToDelete)
    );
  };

  const handleAddCategory = () => {
    setApiCategoriesDream((prevCategories) =>
      prevCategories.concat(newCategory)
    );
    setNewCategory("");
  };

  async function callMeaningCloudAPI(apiUrl: any, requestOptions: any) {
    const response = await fetch(apiUrl, requestOptions);
    const responseData = await response.json();

    const categories: any[] = [];

    console.log("apiResponse : ", responseData);

    responseData.concept_list.forEach((element: any) => {
      categories.push(element.form);
    });

    responseData.entity_list.forEach((element: any) => {
      categories.push(element.form);
    });

    return categories;
  }

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

      <View style={styles.checkboxContainer}>
        <Checkbox.Item
          label="Use AI-generated categories ?"
          status={useAICategories ? "checked" : "unchecked"}
          onPress={() => setUseAICategories(!useAICategories)}
        />
      </View>

      {update ? (
        <View>
          <Text style={styles.title}>Categories : </Text>
          <View style={styles.chipContainer}>
            {apiCategoriesDream.map((item: any, index: any) => (
              <Chip style={styles.chip} mode="outlined" key={index}>
                <View style={styles.chipElements}>
                  <Text>{item}</Text>
                  <Pressable
                    style={styles.chipElementsIcon}
                    onPress={() => handleDeleteCategory(index)}
                  >
                    {({ pressed }) => (
                      <AntDesign name="closecircleo" size={24} color="black" />
                    )}
                  </Pressable>
                </View>
              </Chip>
            ))}

            <View style={styles.addCategoryContainer}>
              <TextInput
                label="New Category"
                value={newCategory}
                onChangeText={(category) => setNewCategory(category)}
                mode="outlined"
                style={[
                  styles.input,
                  { width: width * 0.6, alignSelf: "center" },
                ]}
              />

              <Button
                mode="contained"
                onPress={handleAddCategory}
                style={[
                  styles.button,
                  { marginVertical: 10, marginTop: 0, marginLeft: 8 },
                ]}
              >
                Add
              </Button>
            </View>
          </View>
        </View>
      ) : null}

      <Button
        mode="contained"
        onPress={handleSubmissionButton}
        style={styles.button}
      >
        Submit
      </Button>

      <DeleteDreams
        visible={update}
        resetAll={false}
        dreamId={dreamData ? dreamData.id : -1}
        buttonTitle="Delete dream"
        dialogTitle="Are you sure ?"
        dialogText="This operation is irreversible, do you really want to delete this dream ?"
      />

      <Portal>
        <Dialog visible={visibleDialog} onDismiss={hideDialog}>
          <Dialog.Title>Confirm overwrite</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              You chose to use AI-generated categories. This will overwrite your
              current categories.
            </Text>
            <Text variant="bodyMedium">
              Are you sure you want to overwrite your categories ?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleDreamSubmission}>
              Yes, overwrite my categories
            </Button>
            <Button onPress={hideDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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

    display: "flex",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  chip: {
    margin: 2,
    width: "auto",
  },
  chipElements: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  chipElementsIcon: {
    marginLeft: 5,
  },
  addCategoryContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
