import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";

const DatePicker = ({ dateSetter, dreamDate }: { dateSetter: any, dreamDate: Date }) => {

  const [visible, setVisible] = React.useState(false);
  const onToggleDatePicker = () => setVisible(!visible);
  const onDismissDatePicker = () => setVisible(false);

  const onChange = (event: any, dreamDate?: Date) => {
    dateSetter(dreamDate);
    onDismissDatePicker();
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={onToggleDatePicker}>
        {dreamDate.toLocaleDateString("fr")}
      </Button>

      {visible && (
        <DateTimePicker
          value={dreamDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default DatePicker;
