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
  setDoc,
  collectionGroup,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import defProfile from "../../assets/images/default_profile.png";

const UserProfile = ({ navigation, route }) => {
  const currentUserId = auth.currentUser.uid;
  const uid = route.params.item;

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const [scrapbooks, getScrapbooks] = useState([]);
  const [followers, getFollowers] = useState([]);
  const [myFollowing, getMyFollowing] = useState([]);
  const [onFollowClick, setOnFollowClick] = useState(false);
  const [username, setusername] = useState("Default");
  const [bio, setbio] = useState("Bio");
  const [image, setimage] = useState(
    "https://blogifs.azureedge.net/wp-content/uploads/2019/03/Guest_Blogger_v1.png"
  );
  const Uref = doc(db, "users", uid);
  const Iref = doc(db, "users", currentUserId);

  const userDoc = getDoc(Uref);
  const myDoc = getDoc(Iref);

  const getUserDetails = async ({ navigation }) => {
    // const Uref = doc(db, "users", route.params.item);
    // const userDoc = await getDoc(Uref);
    setusername(userDoc.data());
    setbio(userDoc.data().bio);
    setimage(userDoc.data().profilePicsrc);
    getFollowers(userDoc.data().followers);
    console.log(userDoc.data());
  };

  const Scrapbooks = async () => {
    const ref = collection(db, "users", route.params.item, "Scrapbooks");
    const data = await getDocs(ref);
    data.forEach((item) => {
      getScrapbooks((prev) => [...prev, item.data()]);
    });
  };

  useEffect(() => {
    getUserDetails();
    Scrapbooks();
  }, []);

  renderPost = (post) => {
    const selectPost = () => {
      setId(post.id);
      console.warn(post.id);
    };

    return (
      <Card style={[styles.post, { width: windowWidth / 2 - 15 }]}>
        <TouchableOpacity onPress={() => navigation.navigate("Post")}>
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

  const followUser = async () => {
    
    let tempFollowing = myFollowing;
    if (tempFollowing.length > 0) {
      tempFollowing.map((itemTwo) => {
        if (itemTwo === uid) {
          let index = tempFollowing.indexOf(uid);
          if (index > -1) {
            tempFollowing.splice(index, 1);
          }
        } else {
          tempFollowing.push(uid);
        }
      });
    } else {
      tempFollowing.push(uid);
    }

    // get followers list of the user we wish to follow
    let tempFollowers = followers;
    if (tempFollowers.length > 0) {
      tempFollowers.map((itemOne) => {
        // if the follower is already in the list, remove the follower
        if (itemOne === currentUserId) {
          // getting the index of the follower in the array
          let index = tempFollowers.indexOf(currentUserId);
          if (index > -1) {
            tempFollowers.splice(index, 1);
          }else{
            tempFollowers.push(currentUserId)
          }
          // follower is not found, add it
        } else {
          tempFollowers.push(currentUserId);
        }
      });
      // if followers list is empty, push my id into it
    } else {
      tempFollowers.push(currentUserId);
    }
    updateDoc(Iref, { following: tempFollowing });
    updateDoc(Uref, { followers: tempFollowers });

    setOnFollowClick(!onFollowClick);
  };

  const getFollowStatus = () => {
    let status = false;
    if (onFollowClick === true) {
      status = true;
    }
    // else {
    //   status = false;
    // }
    return status;
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView style={styles.container}>
        <IconButton
          icon="chevron-left"
          size={24}
          iconColor="black"
          onPress={() => navigation.goBack()}
        />
        <View style={styles.header}></View>
        <View style={styles.bodyContainer}>
          <View style={styles.avatarContainer}>
            <Avatar.Image source={{ uri: image }} size={130} />
          </View>
          <Text> {username} </Text>
          <Text> {bio} </Text>
          <Button
            onPress={() => followUser()}
            text={getFollowStatus() === true ? "Unfollow" : "Follow"}
            // text="follow"
            type="TERITARY"
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
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {},
  header: {
    alignItems: "flex-end",
    padding: 20,
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
  },
});
