import { StyleSheet, Text, View , FlatList, Dimensions, TouchableOpacity } from "react-native";
import React, { useEffect, useState} from "react";
import { Card, Avatar, IconButton } from "react-native-paper";
import Button from "../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-virtualized-view";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";

const GroupProfile = ({ navigation, route }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [groupname, setGroupname] = useState("");
  const [desc, setDesc] = useState("");
  const [groupIcon, setGroupIcon] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [members, setMembers] = useState([]);
  const [scrapbooks, getScrapbooks] = useState([]);
  const [memberPresent, setMemberPresent] = useState(false);

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
    setMembers(groupDoc.data().members);
  };

  const Scrapbooks = async () => {
    let temp = [];
    const ref = collection(db, "users", route.params.uid, "Groups", route.params.item, "Scrapbooks");
    console.log(ref)
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
    Scrapbooks()
  }, []);

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
      </Card>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SafeAreaView style={styles.container}>
        <View style={{flexDirection:"row", justifyContent:"space-between"}}>
          <IconButton
            icon="chevron-left"
            size={24}
            iconColor="black"
            onPress={() => navigation.goBack()}
          />
          <IconButton
 
            icon="plus-circle"
            size={24}
            iconColor="purple"
            onPress={() => navigation.navigate("CreateScrapbook", {item: route.params.item, group: true})}
          />
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

          <Button type="TERITARY" text_type="TERTIARY" text={"Member"} />

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
