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
} from "firebase/firestore";
const UserProfile = ({ navigation }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [userDetails, setUserDetails] = useState(null);
  const [scrapbooks, getScrapbooks] = useState([]);
  useEffect(() => {
    (async () => {
      const Uref = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(Uref);
      const UserJson = userDoc.data();
      setUserDetails(UserJson);
      const ref = collection(db, "users", auth.currentUser.uid, "Scrapbooks");
      const data = await getDocs(ref);
      data.forEach((item) => {
        getScrapbooks((prev) => [...prev, item.data()]);
      });
    })();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Logged out");
      })
      .catch((error) => alert(error.message));
    console.log(auth.currentUser);
  };

  const posts = [
    {
      id: "1",
      userName: "chitnis",
      userImage: "https://bit.ly/dan-abramov",
      postTime: "10 mins ago",
      postText: "Stop following me",
      postImage:
        "https://iheartcraftythings.com/wp-content/uploads/2021/11/6-119.jpg",
      postTitle: "Butterfly",
    },
    {
      id: "2",
      userName: "Gaurang Chitnis",
      userImage:
        "https://w7.pngwing.com/pngs/1008/377/png-transparent-computer-icons-avatar-user-profile-avatar-heroes-black-hair-computer.png",
      postTime: "1 hour ago",
      postText:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,",
      postImage:
        "https://i1.wp.com/i.pinimg.com/originals/a3/79/ed/a379ed1bfe120e37570cec581fc824f2.jpg",
      postTitle: "Paint",
    },
    {
      id: "3",
      userName: "vnc",
      userImage:
        "https://w7.pngwing.com/pngs/312/283/png-transparent-man-s-face-avatar-computer-icons-user-profile-business-user-avatar-blue-face-heroes.png",
      postTime: "19 mins ago",
      postText: "Stop following me",
      postImage:
        "https://img.freepik.com/free-vector/abstract-background_53876-43362.jpg",
      postTitle: "Crystals",
    },
  ];

  renderPost = (post) => {
    const selectPost = () => {
      setId(post.id);
      console.warn(post.id);
    };

    return (
      <Card style={[styles.post, { width: windowWidth / 2 - 15 }]}>
        <TouchableOpacity onPress={() => navigation.navigate("Post")}>
          <Card.Cover source={{ uri: post.postImage }} resizeMode="cover" />
        </TouchableOpacity>
        <Card.Title
          style={styles.postHeader}
          title={post.postTitle}
          titleStyle={styles.cardTitle}
          // subtitle={post.userName}
          subtitleStyle={styles.cardSubTitle}
          right={(props) => <Text>{post.postTime}</Text>}
          // left={(props) => (
          //   <Avatar.Image source={{ uri: post.userImage }} size={25} />
          // )}
          leftStyle={styles.profilePicture}
        />
      </Card>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {/* <IconButton
          icon="chevron-left"
          size={24}
          iconColor="black"
          onPress={async () => {
            popFromStack();
          }}
        /> */}
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={24}
              color="black"
              style={{ alignItems: "flex-end" }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              source={{ uri: "https://bit.ly/dan-abramov" }}
              size={130}
            />
            {/* <Image source={rukia_profile} styles={styles.avatar} resizeMode="contain" /> */}
          </View>
          <Text> Nura Riaz </Text>
          <Text> Bio </Text>
          <Button
            onPress={() => navigation.replace("EditProfile")}
            text=" Edit Profile "
            type="TERITARY"
            text_type="TERTIARY"
          />
        </View>
        <FlatList
          style={styles.feed}
          data={scrapbooks}
          renderItem={({ item }) => renderPost(item)}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          numColumns={2}
        />
        <Button onPress={handleSignOut} text="Sign out noob" />
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
});
