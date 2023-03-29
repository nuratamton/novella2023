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
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { Button as Btn } from "react-native";
import { uuidv4 } from "@firebase/util";
import Button from "../components/Button";
import { Avatar } from "react-native-paper";

const AddMembers = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [search, setSearch] = useState("");

  const [accType, setAccountType] = useState("");
  const [admin, setAdmin] = useState("");
  const [desc, setDesc] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groupname, setGroupname] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [members, setMembers] = useState([]);
  const [groupIcon, setGroupIcon] = useState("");

  useEffect(() => {
    fetchData();
    fetchGroupData();
  }, []);

  const fetchGroupData = async () => {
    await getDoc(
      doc(db, "users", auth.currentUser.uid, "Groups", route.params.docId)
    ).then((item) => {
      setAccountType(item.data().accountType);
      setAdmin(item.data().admin);
      setDesc(item.data().description);
      setGroupId(item.data().groupId);
      setGroupname(item.data().groupname);
      setMemberCount(item.data().memberCount);
      setMembers(item.data().members);
      setGroupIcon(item.data().groupIcon);
    });
  };

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
          memberCount: increment(-1),
        }).then(async () => {});
        setMemberCount(memberCount);
        setMembers(members);
        // await deleteDoc(doc(db, "users", uid, "Groups", route.params.docId));
      } else {
        await updateDoc(groupDoc, {
          members: arrayUnion(uid),
          memberCount: increment(1),
        }).then(async () => {});
        setMemberCount(memberCount);
        setMembers(members);
        await updateDoc(doc(db, "users", uid),{
          groups: arrayUnion(groupDoc),
        })
      }
    });
  };

  const ItemView = ({ item }) => {
    return (
      <View style={styles.user}>
        <Avatar.Image style={styles.avatar} source={{ uri: item.profilePicsrc }} />
        <Text style={styles.username}> {item.username}</Text>
        <TouchableOpacity
          style={styles.addbtn}
          onPress={() => addToGroup(item.id)}
        >
          <Text style={styles.buttonText}> Add </Text>
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
        <Button
          text="Next"
          onPress={() =>
            navigation.navigate("GroupProfile", {
              item: route.params.docId,
              uid: auth.currentUser.uid,
            })
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default AddMembers;

const styles = StyleSheet.create({
  username: {
    marginTop: 10,
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
