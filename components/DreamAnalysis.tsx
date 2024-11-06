import React, { useState } from "react";
import { View, Text, Button } from "react-native";

export default function DreamAnalysis({ dreamDescription }: { dreamDescription: String }) {
  const [apiResponse, setApiResponse] = useState(null);

  const handleApiRequest = async () => {
    try {
      const apiUrl = "https://api.meaningcloud.com/topics-2.0";
      const language = "fr";
      const tmpDream = dreamDescription;
      const apiKey = "4c7f7dc4388ea9918edbff05d7f071a4";
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
      console.log("MeaningCloud API response :", responseData);
    } catch (error) {
      console.error("Error with Meaning Cloud API request :", error);
    }
  };
  const renderTable = () => {
    if (!apiResponse) {
      return null;
    }

    const conceptsList = apiResponse.concept_list;
    const entitiesList = apiResponse.entity_list;
    const entryList = [...apiResponse.concept_list, ...apiResponse.entity_list];
    return (
      <View>
        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
          Tableau des données :
        </Text>
        <View style={{ flexDirection: "row", marginBottom: 5 }}>
          <Text style={styles.tableHeader}>Type d'Entrée</Text>
          <Text style={styles.tableHeader}>Pertinence</Text>
          <Text style={styles.tableHeader}>Terme</Text>
          <Text style={styles.tableHeader}>Type Sémantique</Text>
        </View>
        {conceptsList.map((entry, index) => (
          <View key={index} style={{ flexDirection: "row", marginBottom: 5 }}>
            <Text style={styles.tableCell}>Concept</Text>
            <Text style={styles.tableCell}>{entry.relevance}</Text>
            <Text style={styles.tableCell}>{entry.form}</Text>
            <Text style={styles.tableCell}>{entry.sementity.type}</Text>
          </View>
        ))}
        {entitiesList.map((entry, index) => (
          <View key={index} style={{ flexDirection: "row", marginBottom: 5 }}>
            <Text style={styles.tableCell}>Entity</Text>
            <Text style={styles.tableCell}>{entry.relevance}</Text>
            <Text style={styles.tableCell}>{entry.form}</Text>
            <Text style={styles.tableCell}>{entry.sementity.type}</Text>
          </View>
        ))}
      </View>
    );
  };
  
  return (
    <View>
      <Button
        title="Execute MeaningCloud request"
        onPress={handleApiRequest}
      />
      {apiResponse && (
        <View>
          <Text>Réponse de l'API :</Text>
          {renderTable()}
        </View>
      )}
    </View>
  );
}
const styles = {
  tableHeader: {
    flex: 1,
    fontWeight: "bold",
    marginRight: 5,
  },
  tableCell: {
    flex: 1,
    marginRight: 5,
  },
};
