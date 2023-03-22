import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
  Button as Btn,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { db, auth } from "../firebase";
import { IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, Avatar } from "react-native-paper";
import { ScrollView } from "react-native-virtualized-view";
import { AntDesign } from "@expo/vector-icons";

import {
  getDocs,
  getDoc,
  collection,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  increment,
  setDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";

import uuid from "react-native-uuid";
const Profile = ({ navigation, route }) => {
  const currentUserId = auth.currentUser.uid;
  const uid = route.params.item;
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [scrapbooks, getScrapbooks] = useState([]);
  const [groups, getGroups] = useState([]);
  const [onFollowClick, setOnFollowClick] = useState(false);
  const [request, setRequest] = useState(false);
  const [username, setusername] = useState("Default");
  const [name, setName] = useState("Name");
  const [FollowersCount, setFollowersCount] = useState(0);
  // const [FollowersArray, setFollowersArray] = useState([]);
  const [FollowingCount, setFollowingCount] = useState(0);
  // const [FollowingArray, setFollowingArray] = useState([]);
  const [bio, setbio] = useState("Bio");
  const [displayScrap, setDisplayScrap] = useState(true);
  const [image, setimage] = useState(
    "https://blogifs.azureedge.net/wp-content/uploads/2019/03/Guest_Blogger_v1.png"
  );
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [accountType, setAccountType] = useState("");

  const UUID = uuid.v4();
  const UUID2 = uuid.v4();

  const hiddenAlert = (location) => {
    Alert.alert(
      "You have come across a hidden scrapbook!",
      "To view the contents of this scrapbook and interact with it, please find it on the map",
      [
        {
          text: "Give me hints",
          onPress: () => {
            hintAlert(location);
          },
        },
        {
          text: "View on map",
          onPress: () => {
            navigation.navigate("Explore");
          },
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ],
      { cancelable: false }
    );
  };

  const hintAlert = (location) => {
    const hello = "hello";
    Alert.alert(
      "Here is your hint!",
      "Latitude: " +
        `${location.coords.latitude}` +
        "\nLongitude: " +
        `${location.coords.longitude}`,
      [
        {
          text: "View on map",
          onPress: () => {
            navigation.navigate("Explore");
          },
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ],
      { cancelable: false }
    );
  };

  const getUserDetails = async () => {
    const Uref = doc(db, "users", route.params.item);
    const userDoc = await getDoc(Uref);

    const Iref = doc(db, "users", currentUserId);
    const myDoc = await getDoc(Iref);

    setusername(userDoc.data().username);
    setbio(userDoc.data().bio);
    setimage(userDoc.data().profilePicsrc);

    setFollowersCount(userDoc.data().followerCount);
    setFollowingCount(userDoc.data().followingCount);

    setFollowers(userDoc.data().followers);
    setFollowing(userDoc.data().following);

    setAccountType(userDoc.data().accountType);

    getFollowStatus();
  };
  const groupExists = async () => {
    if (collection(db, "users", auth.currentUser.uid, "Groups")) {
      return true;
    }
  };
  const sendFollowNotification = async () => {
    let followBack = false;
    const currDoc = doc(db, "users", auth.currentUser.uid);
    const receiverDoc = doc(db, "users", route.params.item);
    const receiver = doc(db, "users", route.params.item, "Notifications", UUID);
    await getDoc(receiverDoc).then(async (Snap) => {
      followBack = Snap.data().following.includes(auth.currentUser.uid)
        ? true
        : false;
      await getDoc(currDoc).then(async (QuerySnapshot) => {
        await setDoc(receiver, {
          id: UUID,
          message: `${QuerySnapshot.data().username} started following you`,
          From: auth.currentUser.uid,
          profilePic: QuerySnapshot.data().profilePicsrc,
          followBack: followBack,
          timestamp: serverTimestamp(),
          type: "Follow",
        });
      });
    });
  };

  const removeFollowNotification = async () => {
    const receiver = collection(
      db,
      "users",
      route.params.item,
      "Notifications"
    );
    const q = query(
      receiver,
      where("From", "==", auth.currentUser.uid),
      where("type", "==", "Follow")
    );
    await getDocs(q).then(async (QuerySnapshot) => {
      QuerySnapshot.forEach(async (item) => {
        await deleteDoc(
          doc(db, "users", route.params.item, "Notifications", item.data().id)
        );
      });
      //   await deleteDoc(doc(db,"users", route.params.item.uid,"Notifications",doc.data().id))
    });
  };

  const sendRequestNotification = async () => {
    const currDoc = doc(db, "users", auth.currentUser.uid);
    const receiverDoc = doc(db, "users", route.params.item);
    const receiver = doc(db, "users", route.params.item, "Notifications", UUID);
    await getDoc(receiverDoc).then(async (Snap) => {
      const request = Snap.data().following.includes(auth.currentUser.uid)
        ? true
        : false;
      await getDoc(currDoc).then(async (QuerySnapshot) => {
        await setDoc(
          receiver,
          {
            id: UUID,
            message: `${QuerySnapshot.data().username} requested to follow you`,
            From: auth.currentUser.uid,
            profilePic: QuerySnapshot.data().profilePicsrc,
            request: request,
            timestamp: serverTimestamp(),
            type: "Request",
          },
          { merge: true }
        );
      });
    });
  };
  const removeRequestNotification = async () => {
    const receiver = collection(
      db,
      "users",
      route.params.item,
      "Notifications"
    );
    const q = query(
      receiver,
      where("From", "==", auth.currentUser.uid),
      where("type", "==", "Request")
    );
    await getDocs(q).then(async (QuerySnapshot) => {
      QuerySnapshot.forEach(async (item) => {
        await deleteDoc(
          doc(db, "users", route.params.item, "Notifications", item.data().id)
        );
      });
      //   await deleteDoc(doc(db,"users", route.params.item.uid,"Notifications",doc.data().id))
    });
  };

  const Scrapbooks = async () => {
    const ref = collection(db, "users", route.params.item, "Scrapbooks");
    const data = await getDocs(ref);
    data.forEach((item) => {
      getScrapbooks((prev) => [...prev, item.data()]);
    });
  };

  const Groups = async () => {
    let temp = [];
    const ref = collection(db, "users", route.params.item, "Groups");
    const newref = doc(db, "users", route.params.item);
    await getDoc(newref).then((querySnapshot) => {
      querySnapshot.data().groups.forEach(async (item) => {
        await getDoc(item).then((oogabooga) => {
          temp.push(oogabooga.data());
        });
      });
    });

    await getDocs(ref)
      .then((querySnapshot) => {
        querySnapshot.forEach((item) => {
          temp.push(item.data());
        });
        getGroups(temp);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const isPrivate = () => {
    if (
      accountType === "Private" &&
      !followers.includes(auth.currentUser.uid)
    ) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    getUserDetails();
    Scrapbooks();
    Groups();
    const unsub = onSnapshot(collection(db,"users",),(snapshot)=>{
      snapshot.docChanges().forEach((change) => {
        if(change.type === "removed"){
          Scrapbooks();
          Groups();
        }
        if(change.type === "added"){
          Scrapbooks();
          Groups();
          getUserDetails()
        }
        if(change.type === "modified"){
          Scrapbooks();
          Groups();
          getUserDetails()
        }
      })
    })
  }, []);

  renderPost = (post) => {
    return (
      <Card style={[styles.post, { width: windowWidth / 2 - 15 }]}>
        {post.hide != true ? (
          <TouchableOpacity
            onPress={() => navigation.navigate("Post", { item: post })}
          >
            <Card.Cover
              source={{ uri: post.CoverImg ? post.CoverImg : "" }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => hiddenAlert(post.location)}>
            <Card.Cover
              source={{ uri: post.CoverImg ? post.CoverImg : "" }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        <Card.Title
          style={styles.postHeader}
          title={post.title}
          titleStyle={styles.cardTitle}
          subtitleStyle={styles.cardSubTitle}
          leftStyle={styles.profilePicture}
        />
        <Text
          style={{
            // position: "absolute",
            // backgroundColor: "black",
            color: "black",
            // justifyContent:"center",
            textAlign: "right",
            fontSize: 15,
            fontWeight: "600",
            marginRight: 10,
            marginBottom: 10,
            bottom: 37,
          }}
        >
          {post.type}
        </Text>
      </Card>
    );
  };

  renderGroup = (group) => {
    if (groupExists()) {
      return (
        <View style={[styles.notifications]}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("GroupProfile", {
                item: group.groupId,
                uid: group.admin,
                group: true,
              });
            }}
          >
            <View style={styles.groupBox}>
              <View style={styles.picture}>
                <Avatar.Image
                  source={{ uri: group.groupIcon }}
                  size={40}
                  style={{ marginRight: 12 }}
                />
              </View>
              <View styles={styles.textFollowButton}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "300",
                    alignContent: "center",
                    padding: 5,
                    marginRight: 10,
                  }}
                >
                  {group.groupname}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const followUser = async () => {
    //  our id:  currentUserId
    // follow person id:   uid

    const currDoc = doc(db, "users", currentUserId);
    if (accountType === "Private") {
      removeRequestNotification();
      const receiver = doc(
        db,
        "users",
        route.params.item,
        "Notifications",
        UUID
      );
      await getDoc(doc(db, "users", uid)).then(async (QuerySnapshot) => {
        if (QuerySnapshot.data().requests.includes(currentUserId)) {
          await updateDoc(doc(db, "users", uid), {
            requests: arrayRemove(currentUserId),
          });
          // await updateDoc(receiver, {
          //   request: false,
          // });
        } else {
          sendRequestNotification();
          await updateDoc(doc(db, "users", uid), {
            requests: arrayUnion(currentUserId),
            
          });
        }

        await getDoc(currDoc).then(async (QuerySnapshot) => {
          if (QuerySnapshot.data().following.includes(uid)) {
            setFollowersCount(FollowersCount - 1);
            // setFollowingCount(FollowingCount - 1);
            await updateDoc(doc(db, "users", uid), {
              followers: arrayRemove(currentUserId),
              followerCount: increment(-1),
            });
            await updateDoc(currDoc, {
              following: arrayRemove(uid),
              followingCount: increment(-1),
            });
            setOnFollowClick(false);
            removeFollowNotification();
          }
        });
      });
    } else {
      await getDoc(currDoc).then(async (QuerySnapshot) => {
        if (QuerySnapshot.data().following.includes(uid)) {
          setFollowersCount(FollowersCount - 1);
          // setFollowingCount(FollowingCount - 1);
          await updateDoc(doc(db, "users", uid), {
            followers: arrayRemove(currentUserId),
            followerCount: increment(-1),
          });
          await updateDoc(currDoc, {
            following: arrayRemove(uid),
            followingCount: increment(-1),
          });
          setOnFollowClick(false);
          removeFollowNotification();
        } else {
          setFollowersCount(FollowersCount + 1);
          // setFollowersArray("")
          // setFollowingCount(FollowingCount + 1);
          await updateDoc(doc(db, "users", uid), {
            followers: arrayUnion(currentUserId),
            followerCount: increment(1),
          });
          await updateDoc(currDoc, {
            following: arrayUnion(uid),
            followingCount: increment(1),
          });
          setOnFollowClick(true);
          sendFollowNotification();
        }
      });
    }
  };

  const getFollowStatus = async () => {
    let status = false;
    const currDoc = doc(db, "users", currentUserId);
    await getDoc(currDoc).then(async (QuerySnapshot) => {
      if (QuerySnapshot.data().following.includes(uid)) {
        setOnFollowClick(true);
      } else {
        setOnFollowClick(false);
      }
    });
    await getDoc(doc(db, "users", uid)).then((querySnapshot) => {
      if (querySnapshot.data().requests.includes(currentUserId)) {
        setRequest(true);
      } else {
        setRequest(false);
      }
    });
  };

  return (
    // <ScrollView showsVerticalScrollIndicator={false}>
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <IconButton
          icon="chevron-left"
          size={24}
          iconColor="black"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.header}>
          <Text> {username} </Text>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.avatarContainer}>
            <Avatar.Image source={{ uri: image }} size={100} />
          </View>
          <View style={styles.infoContainer}>
            <TouchableOpacity
              style={styles.followerCount}
              onPress={() =>
                navigation.navigate("DisplayFollowers", {
                  uid: route.params.item,
                })
              }
            >
              {/* {currDoc = doc(db, "users", currentUserId)} */}
              <Text>{FollowersCount}</Text>
              <Text>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.followingCount}
              onPress={() =>
                navigation.navigate("DisplayFollowing", {
                  uid: route.params.item,
                })
              }
            >
              <Text>{FollowingCount}</Text>
              <Text>Following</Text>
            </TouchableOpacity>
          </View>
          <Text> {name} </Text>
          <Text> {bio} </Text>
          {request ? (
            <Button
              onPress={() => followUser()}
              text="Requested"
              type="TERITARY"
            />
          ) : (
            <Button
              onPress={() => followUser()}
              text={onFollowClick ? "Unfollow" : "Follow"}
              type="TERITARY"
            />
          )}
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <Btn
            title="Scrapbooks"
            color="#841584"
            onPress={() => setDisplayScrap(true)}
          />
          <Btn
            style={{ backgroundColor: "black" }}
            color="#841584"
            title="Groups"
            onPress={() => setDisplayScrap(false)}
          />
        </View>

        {isPrivate() === true ? (
          <View
            style={{
              //   flex: 1,
              flexDirection: "column",
              alignItems: "center",
              //   justifyContent: "flex-start",
              //   width: 100,
              padding: 50,
            }}
          >
            <AntDesign name="lock1" size={90} color="black" />
            <Text style={{ textAlign: "center", fontSize: 22 }}>
              Private Account
            </Text>
            <Text style={{ textAlign: "center" }}>
              Follow this account to view their scrapbooks
            </Text>
          </View>
        ) : displayScrap ? (
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
        ) : (
          <FlatList
            style={styles.feed}
            data={groups}
            renderItem={({ item }) => renderGroup(item)}
            // keyExtractor={(itemm) => itemm.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>
    </SafeAreaView>
    // </ScrollView>
  );
};

export default Profile;

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
    backgroundColor: "white",
  },
  infoContainer: {
    // padding: 10,
    marginTop: 50,
    marginBottom: 30,
    position: "relative",
    top: 10,
    display: "flex",
    justifyContent: "space-between",
    flex: 1,
    flexDirection: "row",
  },
  followerCount: {
    position: "absolute",
    alignItems: "center",
    right: 50,
    bottom: 10,
  },
  followingCount: {
    position: "absolute",
    alignItems: "center",
    left: 50,
    bottom: 10,
  },
  groupBox: {
    padding: 20,
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    margin: 2,
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 16,
    borderBottomColor: "#f2f2f2",
    backgroundColor: "#e6e6fa",

    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
});
