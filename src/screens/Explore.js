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
import MapView from "react-native-maps";
import {
  getDocs,
  collection,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { Avatar } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { EvilIcons } from "@expo/vector-icons";

const Explore = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState([]);
  // setSearch(value)

  useEffect(() => {
    fetchUserData();
    fetchGroupData();
    // return () => {};
  }, []);

  const fetchUserData = async () => {
    let unsubscribed = false;
    // goes to users collection
    const Uref = collection(db, "users");
    // every user
    await getDocs(query(Uref, where("email", "!=", auth.currentUser.email)))
      .then((querySnapshot) => {
        if (unsubscribed) return;
        const newUserDataArray = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        // setting data variable to newUserDataArray
        setData(newUserDataArray);
        //console.log(newUserDataArray);
      })
      .catch((err) => {
        if (unsubscribed) return;
        console.error("Failed to retrieve data", err);
      });
    return () => (unsubscribed = true);
  };

  const fetchGroupData = async () => {
    const currDoc = doc(db, "users", auth.currentUser.uid);
    console.log(groups);
    await getDoc(currDoc).then(async (QuerySnapshot) => {
      QuerySnapshot.data().following.forEach(async (element) => {
        const ref = collection(db, "users", element, "Groups");
        await getDocs(ref).then((data) => {
          data.forEach((item) => {
            setData((prev) => [...prev, item.data()]);
          });
        });
      });
    });
  };

  const searchFilter = (text) => {
    if (text) {
      const newData = data.filter((item) => {
        let itemData;
        {
          item.username
            ? (itemData = item.username
                ? item.username.toUpperCase()
                : "".toUpperCase())
            : (itemData = item.groupname
                ? item.groupname.toUpperCase()
                : "".toUpperCase());
        }
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
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile", { item: item.id })}
      >
        <View style={styles.user}>
          <Image style={styles.avatar} source={{ uri: item.profilePicsrc }} />
          <Text style={styles.username}> {item.username}</Text>
          <Image style={styles.avatar} source={{ uri: item.groupIcon }} />
          <Text style={styles.username}> {item.groupname}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{ height: 0.5, width: "100%" }}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search"
          value={search}
          onChangeText={(text) => searchFilter(text)}
        />
        <EvilIcons
          style={{ marginLeft: "90%", position: "absolute", marginTop: "5%" }}
          name="close"
          size={24}
          color="black"
          onPress={() => setFilteredData([])}
        />
        <TouchableOpacity>
        
        <FlatList
          style={{ zIndex: 1, overflow: "visible", borderBottomRadius: 50}}
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
        </TouchableOpacity>
        
          <MapView style={{ height: "100%", width: "100%", }} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#8cdbf3",
    height: "100%",
    width: "100%",
  },
  searchBox: {
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 50,
    padding: 15,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    backgroundColor: "#ffffff",
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
    backgroundColor: "#E6E6FA",
    borderRadius: 10,
    zIndex:1
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
