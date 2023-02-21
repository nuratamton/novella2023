import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import Button from "../components/Button";
import { db, auth } from "../firebase";
import { IconButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import rukia_profile from "../../assets/icon.png";
import Logo from "../../assets/icon.png";
import { Card, Avatar } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import {
  getDocs,
  getDoc,
  collection,
  doc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  increment,
} from "firebase/firestore";
import defProfile from "../../assets/images/default_profile.png";
import Apploader from "../components/Apploader";
import { DrawerActions, useIsFocused} from "@react-navigation/native";

const UserProfile = ({ navigation, route }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [scrapbooks, getScrapbooks] = useState([]);
  const [username, setusername] = useState("Default");
  const [name, setName] = useState("Name");
  const [bio, setbio] = useState("Bio");
  const [image, setimage] = useState(
    "https://blogifs.azureedge.net/wp-content/uploads/2019/03/Guest_Blogger_v1.png"
  );
  const [FollowersCount, setFollowersCount] = useState(0);
  const [FollowingCount, setFollowingCount] = useState(0);
  const [Loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const getUserDetails = async () => {
    const Uref = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(Uref);
    setFollowersCount(userDoc.data().followerCount);
    setFollowingCount(userDoc.data().followingCount);
    setusername(userDoc.data().username);
    setName(userDoc.data().name);
    setbio(userDoc.data().bio);
    setimage(userDoc.data().profilePicsrc);
    
  };



  const Scrapbooks = async () => {
    let temp = []
    const ref = collection(db, "users", auth.currentUser.uid, "Scrapbooks");
    await getDocs(ref).then((querySnapshot) => {
      querySnapshot.forEach((item) => {
        temp.push(item.data());    })
    getScrapbooks(temp)
    });
    setLoading(false);

  };

  useEffect(() => {

    setLoading(true);
    getUserDetails();
    
  }, []);

  // useEffect(() => {
  //   getUserDetails();
  // }, [renderLoad]);

  // useEffect(() => {
    
  // }, [tempScrapbook])

  useEffect(() => {
    getUserDetails();
    Scrapbooks();
  }, [isFocused]);

  useEffect(() => {
    scrapbooks.sort(function (a, b) {
      if (a.timestamp > b.timestamp) return -1;
      if (a.timestamp < b.timestamp) return 1;
      return 0;
    });
  }, [scrapbooks, Loading]);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Logged out");
      })
      .catch((error) => alert(error.message));
    console.log(auth.currentUser);
  };

  useEffect(() => {
    getUserDetails();
  }, [FollowersCount, FollowingCount]);

  renderPost = (post) => {
    const selectPost = () => {
      setId(post.id);
      console.warn(post.id);
    };

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
      </Card>
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
              <View style={styles.followerCount}>
                {/* {currDoc = doc(db, "users", currentUserId)} */}
                <Text>{FollowersCount}</Text>
                <Text>Followers</Text>
              </View>
              <View style={styles.followingCount}>
                <Text>{FollowingCount}</Text>
                <Text>Following</Text>
              </View>
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
          <FlatList
            style={styles.feed}
            data={scrapbooks}
            renderItem={({ item }) => renderPost(item)}
            keyExtractor={(itemm) => itemm.id}
            showsVerticalScrollIndicator={false}
            numColumns={2}
          />
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
});
