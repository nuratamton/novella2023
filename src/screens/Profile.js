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
import Button from "../components/Button";
import { db, auth } from "../firebase";
import { IconButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
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

const Profile = ({ navigation, route }) => {
  const currentUserId = auth.currentUser.uid;
  const uid = route.params.item;

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const [scrapbooks, getScrapbooks] = useState([]);
  const [onFollowClick, setOnFollowClick] = useState(false);
  const [username, setusername] = useState("Default");
  const [name, setName] = useState("Name");
  // const [followersCount, setFollowersCount]= useState(0)
  const [bio, setbio] = useState("Bio");
  const [image, setimage] = useState(
    "https://blogifs.azureedge.net/wp-content/uploads/2019/03/Guest_Blogger_v1.png"
  );

  const getUserDetails = async () => {
    const Uref = doc(db, "users", route.params.item);
    const userDoc = await getDoc(Uref);

    const Iref = doc(db, "users", currentUserId);
    const myDoc = await getDoc(Iref);

    setusername(userDoc.data().username);
    setbio(userDoc.data().bio);
    setimage(userDoc.data().profilePicsrc);
    setName(userDoc.data().name);
    // setFollowers(userDoc.data().followers);
    // setMyFollowing(myDoc.data().following);
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
          subtitleStyle={styles.cardSubTitle}
          leftStyle={styles.profilePicture}
        />
      </Card>
    );
  };

  const followUser = async (userDoc) => {
    //  our id:  currentUserId
    // follow person id:   uid

    const currDoc = doc(db, "users", currentUserId);
    const currGet = await getDoc(currDoc).then(async (QuerySnapshot) => {
      if (QuerySnapshot.data().following.includes(uid)) {
        await updateDoc(doc(db, "users", uid), {
          followers: arrayRemove(currentUserId),
          followerCount: increment(-1),
        });
        await updateDoc(doc(db, "users", currentUserId), {
          following: arrayRemove(uid),
          followingCount: increment(-1),
        });
        setOnFollowClick(false);
      } else {
        await updateDoc(doc(db, "users", uid), {
          followers: arrayUnion(currentUserId),
          followerCount: increment(1),
        });
        await updateDoc(doc(db, "users", currentUserId), {
          following: arrayUnion(uid),
          followingCount: increment(1),
        });
        setOnFollowClick(true);
      }
    });
  };

  const getFollowStatus = () => {
    let status = false;
    if (onFollowClick === true) {
      status = true;
    } else {
      status = false;
    }
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
        <View style={styles.header}>
          <Text> {username} </Text>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.avatarContainer}>
            <Avatar.Image source={{ uri: image }} size={100} />
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.followerCount}>
              {/* {currDoc = doc(db, "users", currentUserId)} */}
              <Text>10</Text>
              <Text>Followers</Text>
            </View>
            <View style={styles.followingCount}>
              <Text>10</Text>
              <Text>Following</Text>
            </View>
          </View>
          <Text> {name} </Text>
          <Text> {bio} </Text>
          <Button
            onPress={() => followUser()}
            text={getFollowStatus() ? "Unfollow" : "Follow"}
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
