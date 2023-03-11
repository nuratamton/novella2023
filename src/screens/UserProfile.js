import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
  Button as Btn,
} from "react-native";
import { Button as But } from "react-native-elements";
import { BlurView } from "expo-blur";
import Modal from "react-native-modal";
import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import Button from "../components/Button";
import { db, auth } from "../firebase";
import { IconButton } from "react-native-paper";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import rukia_profile from "../../assets/icon.png";
import Logo from "../../assets/icon.png";
import { Card, Avatar } from "react-native-paper";
import { ScrollView } from "react-native-virtualized-view";
import { getDocs, getDoc, collection, doc } from "firebase/firestore";
import defProfile from "../../assets/images/default_profile.png";
import Apploader from "../components/Apploader";
import { DrawerActions, useIsFocused } from "@react-navigation/native";
import CreateModal from "../components/CreateModal";

const UserProfile = ({ navigation, route }) => {
  const windowWidth = Dimensions.get("window").width;
  const [modalVisible, setModalVisible] = useState(false);
  const [scrapbooks, getScrapbooks] = useState([]);
  const [username, setusername] = useState("Default");
  const [groups, getGroups] = useState([]);
  const [name, setName] = useState("Name");
  const [bio, setbio] = useState("Bio");
  const [image, setimage] = useState(
    "https://blogifs.azureedge.net/wp-content/uploads/2019/03/Guest_Blogger_v1.png"
  );
  const [FollowersCount, setFollowersCount] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [FollowingCount, setFollowingCount] = useState(0);
  const [following, setFollowing] = useState([]);
  const [displayScrap, setDisplayScrap] = useState(true);
  const [Loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const getUserDetails = async () => {
    const Uref = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(Uref);
    setFollowersCount(userDoc.data().followerCount);
    setFollowers(userDoc.data().followers);
    setFollowingCount(userDoc.data().followingCount);
    setFollowing(userDoc.data().following);
    setusername(userDoc.data().username);
    setName(userDoc.data().name);
    setbio(userDoc.data().bio);
    setimage(userDoc.data().profilePicsrc);
  };

  const Scrapbooks = async () => {
    let temp = [];
    const ref = collection(db, "users", auth.currentUser.uid, "Scrapbooks");
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
    setLoading(false);
  };

  const Groups = async () => {
    temp = [];
    const ref = collection(db, "users", auth.currentUser.uid, "Groups");
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

  const displayList = () => {
    return (
      <>
        {/* <But
        style={{paddingLeft: 17, paddingRight: 17}}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
          icon={<AntDesign name="pluscircle" size={33} color="purple" />}
        /> */}

        <View style={styles.container}>
          <BlurView
            tint="dark"
            intensity={100}
            style={StyleSheet.absoluteFill}
          />
          <Modal
            isVisible={modalVisible}
            backdropOpacity={0.1}
            onBackdropPress={() => setModalVisible(false)}
            style={styles.modal}
          >
            <View style={styles.create_option2}>
              <Text> {followers}</Text>
            </View>
          </Modal>
        </View>
      </>
    );
  };

  useEffect(() => {
    setLoading(true);
  }, []);

  useEffect(() => {
    getUserDetails();
    Scrapbooks();
    Groups();
  }, [isFocused]);

  useEffect(() => {
    getUserDetails();
  }, [FollowersCount, FollowingCount]);

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
          // subtitle={post.userName}
          subtitleStyle={styles.cardSubTitle}
          //right={(props) => <Text>{post.postTime}</Text>}
          // left={(props) => (
          //   <Avatar.Image source={{ uri: post.userImage }} size={25} />
          // )}
          leftStyle={styles.profilePicture}
        />
        <Card.Actions>
          <Btn
            title="Edit"
            style={styles.buttonTxt}
            onPress={() =>
              navigation.navigate("CreateNext", {
                item: auth.currentUser.uid,
                item2: post,
              })
            }
          >
            {" "}
            Edit{" "}
          </Btn>
        </Card.Actions>
      </Card>
    );
  };

  renderGroup = (group) => {
    const selectPost = () => {
      setId(group.id);
    };
    return (
      <View style={[styles.notifications]}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("GroupProfile", {
              item: group.groupId,
              uid: auth.currentUser.uid,
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
  };

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={24}
                color="black"
                style={{ alignItems: "flex-end" }}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.headerUsername}>
            <Text> {username} </Text>
          </View>
          <View style={styles.bodyContainer}>
            <View style={styles.avatarContainer}>
              <Avatar.Image source={{ uri: image }} size={100} />
            </View>
            <View style={styles.infoContainer}>
              <TouchableOpacity
                style={styles.followerCount}
                onPress={() => navigation.navigate("DisplayList")}
              >
                {/* {currDoc = doc(db, "users", currentUserId)} */}
                <Text>{FollowersCount}</Text>
                <Text>Followers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.followingCount}>
                <Text>{FollowingCount}</Text>
                <Text>Following</Text>
              </TouchableOpacity>
            </View>
            <Text> {name} </Text>
            <Text> {bio} </Text>
            <Button
              onPress={() => navigation.navigate("EditProfile")}
              text=" Edit Profile "
              type="TERITARY"
              text_type="TERTIARY"
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
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

          {displayScrap ? (
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
        </SafeAreaView>
      </ScrollView>
      {Loading ? <Apploader /> : null}
    </>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {},
  header: {
    alignItems: "flex-end",
    padding: 20,
  },
  buttonTxt: {
    paddingBottom: 10,
  },
  headerUsername: {
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
    // position: "absolute",
    // width: '100%',
    // height: '100%',
    borderRadius: 50,
    // resizeMode: "contain",
  },
  post: {
    margin: 7.5,
    // flex: 1,
    // width: 300,
    // maxWidth: "100%", // 100% devided by the number of rows you want
    // alignItems: "center",
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
