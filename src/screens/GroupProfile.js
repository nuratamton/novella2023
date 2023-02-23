import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState, FlatList } from "react";
import { Card, Avatar, IconButton } from "react-native-paper";
import Button from "../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-virtualized-view";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const GroupProfile = ({ navigation, route }) => {
  const [groupname, setGroupname] = useState("");
  const [desc, setDesc] = useState("");
  const [groupIcon, setGroupIcon] = useState("");
  const [memberCount, setMemberCount] = useState(0)

  const getGroupDetails = async () => {
    const Uref = doc(
      db,
      "users",
      route.params.uid,
            "Groups",
      route.params.item
    );
    console.log(route.params.item);
    const groupDoc = await getDoc(Uref);
    setGroupname(groupDoc.data().groupname);
    setDesc(groupDoc.data().description);
    setGroupIcon(groupDoc.data().groupIcon);
    setMemberCount(groupDoc.data().memberCount);
  };

  

  useEffect(() => {
    getGroupDetails();
  }, []);

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
          <Text> {groupname} </Text>
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.avatarContainer}>
            <Avatar.Image source={{ uri: groupIcon }} size={100} />
          </View>
          <View style={styles.infoContainer}>
          <View style={styles.followerCount}>
       
            <Text>{memberCount} </Text>
            <Text> Members </Text>
          </View>
          {/* <View style={styles.followingCount}>
            <Text>{FollowingCount}</Text>
            <Text>Following</Text>
          </View> */}
        </View>
          <Text> {""} </Text>
          <Text> {desc} </Text>

          <Button text={"Member"} />
        </View>
        {/* <FlatList
        style={styles.feed}
        data={scrapbooks}
        renderItem={({ item }) => renderPost(item)}
        keyExtractor={(itemm) => itemm.id}
        showsVerticalScrollIndicator={false}
        numColumns={2}
      /> */}
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
  },
  infoContainer: {
    padding: 10,
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
    bottom: 10,
  },
  followingCount: {
    position: "absolute",
    alignItems: "center",
    left: 50,
    bottom: 10,
  },
});
