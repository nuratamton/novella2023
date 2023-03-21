import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
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
  increment,
  deleteDoc,
  DocumentReference,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { Button as Btn } from "react-native";
import { uuidv4 } from "@firebase/util";
import Button from "../components/Button";
import { Avatar } from "react-native-paper";
import uuid from "react-native-uuid";

const Share = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [search, setSearch] = useState("");
  const UUID = uuid.v4();



  useEffect(() => {
    fetchData();
    // fetchGroupData();
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

//   receiver -> doc of person you wanna share to 
  const sendShareNotification = async (shareTo) => {
    const currDoc = doc(db, "users", auth.currentUser.uid);
    // receiver doc must be the person you are sharing 
    const receiverDoc = doc(db, "users", shareTo);
    const receiver = doc(db, "users", shareTo, "Notifications", UUID);
    await getDoc(doc(db,"users",route.params.post.uid)).then(async (item) => {
      await getDoc(currDoc).then(async (QuerySnapshot) => {
        await setDoc(
          receiver,
          {
            id: UUID,
            message: `${QuerySnapshot.data().username} shared a post with you`,
            From: auth.currentUser.uid,
            profilePic: QuerySnapshot.data().profilePicsrc,
            timestamp: serverTimestamp(),
            type: "Share",
            post: route.params.post,
            postOwnerType: item.data().accountType
          },
          { merge: true }
        );
      });
    });
  };

  const ItemView = ({ item }) => {
    return (
      <View style={styles.user}>
        <Avatar.Image
          style={styles.avatar}
          source={{ uri: item.profilePicsrc }}
        />
        <Text style={styles.username}> {item.username}</Text>
        <TouchableOpacity
          style={styles.addbtn}
          onPress={() => sendShareNotification(item.id)}
        >
          <Text style={styles.buttonText}> Share </Text>
        </TouchableOpacity>
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
        <Text style={{fontSize: 22, fontWeight:"400" ,padding:20}}>  Share post with... </Text>
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

export default Share;

const styles = StyleSheet.create({
  username: {
    marginTop: 10,
    marginLeft: 50
  },
  user: {
    // position: "relative",
    flex: 1,
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#E6E6FA",
    borderRadius: 10,
    zIndex: 1,
    justifyContent: "space-between",
  },
  avatar: {
    position: "absolute",
    // left: 20,
    // Top: 20,
  },
  searchBox: {
    marginTop: 5,
    marginBottom: 20,
    borderRadius: 50,
    padding: 15,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    backgroundColor: "#ffffff",
  },
  addbtn: {
    backgroundColor: "purple",
    marginTop: 10,
    paddingVertical: 6,
    borderRadius: 25,
    width: "20%",
    alignItems: "center",
    color: "white",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
});
