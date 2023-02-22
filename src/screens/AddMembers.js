import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Image,
  Text,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  getDocs,
  setDoc,
  collection,
  query,
  where,
  doc,
  arrayUnion,
  arrayRemove,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { Button as Btn } from "react-native";
import { uuidv4 } from "@firebase/util";
import Button from "../components/Button";

const AddMembers = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [search, setSearch] = useState("");

  useEffect(() => {
    
    fetchData();
  }, []);

  const fetchData = () => {
    let unsubscribed = false;
    // goes to users collection
    const Uref = collection(db, "users");
    // every user
    const userDoc = getDocs(
      query(Uref, where("email", "!=", auth.currentUser.email))
    )
      .then((querySnapshot) => {
        if (unsubscribed) return;
        const newUserDataArray = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        // setting data variable to newUserDataArray
        setData(newUserDataArray);
        setFilteredData(newUserDataArray);
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

  const addToGroup = async (uid) => {
    // create a new doc for the group
    const groupDoc = doc(
      db,
      "users",
      auth.currentUser.uid,
      "Groups",
      route.params.docId
    );
    await getDoc(groupDoc).then(async (QuerySnapshot) => {
      if (QuerySnapshot.data().members.includes(uid)) {
        await updateDoc(groupDoc, {
          members: arrayRemove(uid),
        });
      } else {
        await updateDoc(groupDoc, {
          members: arrayUnion(uid),
        });
      }
    });
  };

  const ItemView = ({ item }) => {
    return (
      <View style={styles.user}>
        <Image style={styles.avatar} source={{ uri: item.profilePicsrc }} />
        <Text style={styles.username}> {item.username}</Text>
        <Btn title="Add" onPress={() => addToGroup(item.id)} />
      </View>
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
        <Text> Add Members to your group</Text>
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
        <Button text="Next"/>
      </View>
    </SafeAreaView>
  );
};

export default AddMembers;

const styles = StyleSheet.create({
  user: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
