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

const TagUsers = ({ navigation, route }) => {
  const [temp, setTemp] = useState([])  
  const [selected , setSelected] = useState({})
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [search, setSearch] = useState("");
  const [scrapbook, setScrapbook] = useState("")
  const UUID = uuid.v4();

  useEffect(() => {
    getScrapbook()
    fetchData();
    // fetchGroupData();
  }, []);

  useEffect(() => {
    console.log(selected)
  }, [selected]);

  useEffect(() => {
    console.log(scrapbook.id)
  }, [scrapbook]);

  useEffect(() => {
    temp.forEach((item) =>{
        console.log(item.id)
    })
  }, [temp]);
  const getScrapbook = async () => {
    await getDoc(doc(db,"users",auth.currentUser.uid,"Scrapbooks",route.params.doc)).then((item) => {
        setScrapbook(item)
    })
  }
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
        })) 
        querySnapshot.forEach((item) => {
            setSelected((prev) => ({...prev, [item.data().username]: false}))
        })
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
  const sendTagNotification = async () => {
    let users = []
    const currDoc = doc(db, "users", auth.currentUser.uid);
    // receiver doc must be the person you are sharing 
    temp.forEach(async (shareTo) => {
        users.push(shareTo)
        const receiverDoc = doc(db, "users", shareTo.id);
        const receiver = doc(db, "users", shareTo.id, "Notifications", UUID);
        const scrapRef = doc(db,"users", auth.currentUser.uid,"Scrapbooks",scrapbook.id)
        await getDoc(receiverDoc).then(async (Snap) => {
            await getDoc(currDoc).then(async (QuerySnapshot) => {
              await setDoc(
                receiver,
                {
                  id: UUID,
                  message: `${QuerySnapshot.data().username} has tagged you in a post`,
                  From: auth.currentUser.uid,
                  profilePic: QuerySnapshot.data().profilePicsrc,
                  timestamp: serverTimestamp(),
                  type: "Share",
                  post: scrapbook.data()
                },
                { merge: true }
              );
            });
          });
          await updateDoc(receiverDoc,{
            tagScrap: arrayUnion(scrapbook.id)
          },{merge:true})
          await setDoc(scrapRef,{
            taggedUsers:users
          },{merge:true})
    })
    navigation.navigate("UserStack", {screen: 'UserProfile'} , {itemCheck: true});

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
          onPress={() => {
            if(selected[item.username] === true){
                setSelected(prev => ({
                    ...prev,
                    [item.username] : false
                }))
                setTemp(temp.filter(tempItem => tempItem.email !== item.email))
            }
            else{
                setSelected(prev => ({
                    ...prev,
                    [item.username] : true
                }))
                setTemp((prev) => [...prev, item ])
            }


        }}
        style={[styles.addbtn, {backgroundColor: !selected[item.username]? "purple": "grey"}]}
        >
          <Text style={[styles.buttonText, {color: !selected[item.username]? "white" : "black"}]}> {!selected[item.username]? "Tag" : "Remove"} </Text>
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
          renderItem={(item) => ItemView(item)}
        />
        <Button
          text="Create Scrapbook"
          onPress={async () =>
            sendTagNotification()
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default TagUsers;

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
    marginTop: 10,
    paddingVertical: 6,
    borderRadius: 25,
    width: "20%",
    alignItems: "center",
    color: "white",
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 12,
  },
});
