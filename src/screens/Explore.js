import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import { Avatar } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";

const Explore = ({navigation}) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  const fetchData = () => {
    let unsubscribed = false;
    const Uref = collection(db, "users");
    const userDoc = getDocs(Uref)
      .then((querySnapshot) => {
        if (unsubscribed) return;
        const newUserDataArray = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(newUserDataArray);
        //console.log(newUserDataArray);
      })
      .catch((err) => {
        if (unsubscribed) return;
        console.error("Failed to retrieve data", err);
      });
    return () => (unsubscribed = true);
  };

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

  const ItemView = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate("Profile", {item: item.id})}>
        <View style={styles.user}>
          <Image style={styles.avatar} source={{ uri: item.profilePicsrc }} />
          <Text style={styles.username}> {item.username}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{ height: 0.5, width: "100%", backgroundColor: "#F2F2F2" }}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search"
          value={search}
          onChangeText={(text) => searchFilter(text)}
        />
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
      </View>
    </SafeAreaView>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    height: "100%",
    width: "100%",
  },
  searchBox: {
    borderRadius: 50,
    padding: 15,
    borderColor: "#F2F2F2",
    borderWidth: 1,
    marginBottom: 5,
    backgroundColor: "#eacdf7",
  },
  avatar: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  user: {
    // position: "relative",
    flex: 1,
    flexDirection: "row",
    padding: 20,
  },
  avatar: {
    // position: "absolute",
    // left: 20,
    // Top: 20
  },
  username: {
    // position: "absolute",
  },
});
