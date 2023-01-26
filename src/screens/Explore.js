import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Button, SearchBar } from "react-native-elements";
import { FlatList } from "react-native-gesture-handler";
// import filter from "lodash.filter";

const Explore = () => {
  const users = [
    {
      id: "1",
      userName: "nuratamton",
    },
    {
      id: "2",
      userName: "gaurangchitnis",
    },
    {
      id: "3",
      userName: "test1",
    },
    {
      id: "4",
      userName: "test2",
    },
  ];

  const [name, setName] = useState(users);

  // const searchFn = (name) => {
  //   const updatedName = users.filter((item)=> {const item_data = `${item.title.toUpperCase()})`;
  //   const text_data = text.toUpperCase();
  //   return item_data.indexOf(text_data) > -1;})
  // }
  // }

  renderPost = (user) => {
    const selectPost = () => {
      setId(user.id);
      console.warn(user.id);
    };

    return (
      <View style={styles.item}>
        <Text> {user.userName} </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Explore</Text>
      {/* <InputBox value={name} setValue={setName} placeholder="Search" />       */}

      <SearchBar
        inputStyle={{ backgroundColor: "white" }}
        containerStyle={{
          backgroundColor: "white",
          borderColor: "#f2f2f2",
          borderWidth: 1,
          borderRadius: 5,
          height: "23%",
        }}
        placeholderTextColor={"#g5g5g5"}
        inputContainerStyle={{ backgroundColor: "white", height: "10%" }}
        placeholder="Search"
        lightTheme
        round
        value={name}
        onChangeText={setName}
        autoCorrect={false}
      />
      <FlatList
        style={styles.list}
        data={users}
        renderItem={({ item }) => renderPost(item)}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
  },
  item: {
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#F2f2f2",
    padding: 10,
    margin: 1,
  },
});
