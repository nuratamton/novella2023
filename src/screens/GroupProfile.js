import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Button as Btn,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Card, Avatar, IconButton } from "react-native-paper";
import Button from "../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-virtualized-view";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  increment,
  arrayRemove,
  deleteDoc,
  arrayUnion,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { async } from "@firebase/util";
import { useIsFocused } from "@react-navigation/native";

const GroupProfile = ({ navigation, route }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [groupname, setGroupname] = useState("");
  const [desc, setDesc] = useState("");
  const [groupIcon, setGroupIcon] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [members, setMembers] = useState([]);
  const [scrapbooks, getScrapbooks] = useState([]);
  const [onClick, setOnClick] = useState(false);

  const [accType, setAccountType] = useState("");
  const [admin, setAdmin] = useState("");

  const [groupId, setGroupId] = useState("");
  const isFocused = useIsFocused();

  const getGroupDetails = async () => {
    const Uref = doc(
      db,
      "users",
      route.params.uid,
      "Groups",
      route.params.item
    );
    const groupDoc = await getDoc(Uref);
    setGroupname(groupDoc.data().groupname);
    setDesc(groupDoc.data().description);
    setGroupIcon(groupDoc.data().groupIcon);
    setMemberCount(groupDoc.data().memberCount);
    setMembers(groupDoc.data().members);
    setAccountType(groupDoc.data().accountType);
    setAdmin(groupDoc.data().admin);
    setGroupId(groupDoc.data().groupId);
  };

  const Scrapbooks = async () => {
    let temp = [];
    const ref = collection(
      db,
      "users",
      route.params.uid,
      "Groups",
      route.params.item,
      "Scrapbooks"
    );
    await getDocs(ref)
      .then((querySnapshot) => {
        querySnapshot.forEach((item) => {
          temp.push(item.data());
        });
        getScrapbooks(temp);
      })
      .catch((error) => {
        console.log(error);
      });
  };



  useEffect(() => {
    getGroupDetails();
    Scrapbooks();
    getStatus();
    const unsub = onSnapshot(collection(db,"users",route.params.uid,"Groups",route.params.item,"Scrapbooks"),(snapshot)=>{
      snapshot.docChanges().forEach((change) => {
        if(change.type === "removed"){
          Scrapbooks()
          getGroupDetails();
          getStatus();
        }
        if(change.type === "added"){
          Scrapbooks()
          // getGroupDetails();
          getStatus();
          
        }
        if(change.type === "modified"){
          Scrapbooks()
          getGroupDetails();
          // getStatus();
        }
      })
    })
  }, []);


  useEffect(()=> {
    getGroupDetails();
    Scrapbooks();
    getStatus();
  },[isFocused])

  useEffect(()=> {
    getGroupDetails();
    Scrapbooks();
  },[db])

  renderPost = (post) => {
    return (
      <Card style={[styles.post, { width: windowWidth / 2 - 15 }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Post", { item: post })}
        >
          <Card.Cover source={{ uri: post.CoverImg }} resizeMode="cover" />
        </TouchableOpacity>
        <Card.Title
          style={styles.postHeader}
          title={post.title}
          titleStyle={styles.cardTitle}
          subtitleStyle={styles.cardSubTitle}
          leftStyle={styles.groupIcon}
        />
        {members.includes(auth.currentUser.uid) ? (
          <Card.Actions>
            <Btn
              title="Edit"
              style={styles.buttonTxt}
              onPress={() =>
                navigation.navigate("EditScrapbook", {
                  item: post,
                  item3: groupId,
                  group: true,
                })
              }
            >
              {" "}
              Edit{" "}
            </Btn>
          </Card.Actions>
        ) : (
          ""
        )}
      </Card>
    );
  };

  const joinGroup = async () => {
    const currDoc = doc(
      db,
      "users",
      route.params.uid,
      "Groups",
      route.params.item
    );
    await getDoc(currDoc).then(async (querySnapshot) => {
      if (querySnapshot.data().members.includes(auth.currentUser.uid)) {
        setOnClick(!onClick);
        setMemberCount(memberCount - 1);
        setMembers((item) => item.filter((user) => user !== auth.currentUser.uid))
        await updateDoc(
          doc(db, "users", route.params.uid, "Groups", route.params.item),
          {
            memberCount: increment(-1),
            members: arrayRemove(auth.currentUser.uid),
          }
        );
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          groups: arrayRemove(
            doc(db, "users", route.params.uid, "Groups", route.params.item)
          ),
        });
      } else {
        setOnClick(!onClick);
        setMemberCount(memberCount + 1);
        setMembers((prev) => [...prev,auth.currentUser.uid])
        await updateDoc(
          doc(db, "users", route.params.uid, "Groups", route.params.item),
          {
            memberCount: increment(1),
            members: arrayUnion(auth.currentUser.uid),
          }
        );
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          groups: arrayUnion(
            doc(db, "users", route.params.uid, "Groups", route.params.item)
          ),
        });
      }
    });
  };

  const getStatus = async () => {
    const currDoc = doc(
      db,
      "users",
      route.params.uid,
      "Groups",
      route.params.item
    );
    await getDoc(currDoc).then(async (querySnapshot) => {
      if (querySnapshot.data().members.includes(auth.currentUser.uid)) {
        setOnClick(true);
      } else {
        setOnClick(false);
      }
    });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView style={styles.container}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <IconButton
            icon="chevron-left"
            size={24}
            iconColor="black"
            onPress={() => navigation.goBack()}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {members.includes(auth.currentUser.uid) ? (
              <IconButton
                icon="plus-circle"
                size={24}
                iconColor="purple"
                onPress={() =>
                  navigation.navigate("CreateScrapbook", {
                    item: route.params.item,
                    uid: route.params.uid,
                    group: true,
                  })
                }
              />
            ) : (
              ""
            )}
            <IconButton
              icon="check"
              size={24}
              iconColor="black"
              onPress={() => navigation.navigate("UserStack")}
            />
          </View>
        </View>
        <View style={styles.header}>
          <Text> {groupname} </Text>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.avatarContainer}>
            {groupIcon ? (
              <Avatar.Image source={{ uri: groupIcon }} size={100} />
            ) : (
              ""
            )}
          </View>
          <View style={styles.infoContainer}>
            <TouchableOpacity
              style={styles.followerCount}
              onPress={() =>
                navigation.navigate("DisplayMembers", {
                  uid: route.params.uid,
                  item: route.params.item,
                })
              }
            >
              <Text>{memberCount} </Text>
              <Text> Members </Text>
            </TouchableOpacity>
          </View>

          <Text> {desc} </Text>

          {admin === auth.currentUser.uid ? (
            <Button type="TERITARY" text_type="TERTIARY" text="Admin" />
          ) : (
            <Button
              type="TERITARY"
              text_type="TERTIARY"
              text={onClick ? "Leave Group" : "Join Group"}
              onPress={() => joinGroup()}
            />
          )}

          <FlatList
            style={styles.feed}
            data={scrapbooks.sort(function (a, b) {
              if (a.timestamp > b.timestamp) return -1;
              if (a.timestamp < b.timestamp) return 1;
              return 0;
            })}
            renderItem={({ item }) => renderPost(item)}
            // keyExtractor={(itemm) => itemm.id}
            showsVerticalScrollIndicator={false}
            numColumns={2}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default GroupProfile;

const styles = StyleSheet.create({
  container: {},
  header: {
    // backgroundColor: '#b98ad4',
    backgroundColor: "#eacdf7",
    alignItems: "center",
    padding: 10,
    marginBottom: 20,
  },
  bodyContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  avatarContainer: {
    borderRadius: 10,
    // borderWidth: 1,
    // marginBottom: 30,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  avatar: {
    flex: 1,
    borderRadius: 50,
  },
  post: {
    margin: 7.5,
    backgroundColor:"white"
  },
  infoContainer: {
    padding: 10,
    marginTop: 50,
    marginBottom: 30,
    position: "relative",
    top: 10,
    display: "flex",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
  },
  followerCount: {
    position: "absolute",
    alignItems: "center",
    bottom: 10,
  },
  followingCount: {
    position: "absolute",
    alignItems: "center",
    left: 50,
    bottom: 10,
  },
});
