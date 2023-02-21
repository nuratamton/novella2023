import { StyleSheet, Text, View } from "react-native";
import React, {useState} from "react";

const AddMembers = () => {


  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");

  const searchFilter = (text) => {
    if (text) {
      const newData = data.filter((item) => {
        const itemData = item.username
          ? item.username.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      setFilteredData(data);
      setSearch(text);
    }
  };

  return (
    <View>
      <Text>AddMembers</Text>
    </View>
  );
};

export default AddMembers;

const styles = StyleSheet.create({});
