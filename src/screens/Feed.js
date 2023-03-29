import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
  FlatList,
  Alert,
  LogBox,
} from "react-native";
import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/novella.png";
import { Card, Avatar } from "react-native-paper";
import { getDocs, getDoc, collection, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { cond } from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";

// used somehwere because its exported
export const postID = () => {
  return { id };
};

const Feed = ({ navigation }) => {
  LogBox.ignoreLogs([
    "Require cycle: src/routes/AppStack.js -> src/components/CreateModal.js -> src/components/NavigationMethod.js -> src/routes/AppStack.js",
  ]);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const isFocused = useIsFocused();
  const [scrapbooks, getScrapbooks] = useState([]);

  useEffect(() => {
    console.log("HEREE",scrapbooks)
  }, [scrapbooks]);

  // a function retrieves all the scrapbooks of every user that the current user is following
  const fetchScrapbook = async () => {
    let tempo = []
    const currDoc = doc(db, "users", auth.currentUser.uid);
    getDoc(currDoc).then(async (QuerySnapshot) => {
      // getting the ref of each followng from the backend
      QuerySnapshot.data().following.forEach(async (element) => {
        const ref = collection(db, "users", element, "Scrapbooks");
        getDocs(ref).then((data) => {
          // for each user, get their scrapbooks and store it in scrapbooks array
          data.forEach((item) => {
            tempo.push(item.data())
          });
          getScrapbooks(tempo)
        });
      });
    });
    
  };

  // useEffect(() => {
  //   fetchScrapbook();
  // }, []);
  
  useEffect(() => {
    fetchScrapbook();
  }, [isFocused]);

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

  // allert to display the latitude and longitude as hints
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
  // function to render each item in the flatlist
  renderPost = (post) => {
    return (
      <>
      <Card style={[styles.post]}>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => navigation.navigate("Profile", { item: post.uid })}
        >
          <Card.Actions>
            {/* display profile picture of user thatn posted the scrapbook */}
            <Avatar.Image
              source={{ uri: post.profilepic ? post.profilepic : "" }}
              size={25}
            />
            {/* display the username of the user who posted the scrapbook */}
            <Text styles={styles.cardSubTitle}>{post.username}</Text>
          </Card.Actions>
        </TouchableOpacity>
        {/* if hide is false navigate to post on click */}
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
          // else call the hiddenAlert function
          <TouchableOpacity onPress={() => hiddenAlert(post.location)}>
            <Card.Cover
              source={{ uri: post.CoverImg ? post.CoverImg : "" }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        {/* Add scrapbook title */}
        <Card.Title
          style={styles.postHeader}
          title={post.title}
          titleStyle={styles.cardTitle}
          subtitleStyle={styles.cardSubTitle}
          leftStyle={styles.profilePicture}
        />
        <Text
          style={{
            color: "black",
            textAlign: "right",
            fontSize: 15,
            fontWeight: "600",
            marginRight: 10,
            marginBottom: 10,
            bottom: 37,
          }}
        >
          {/* display post type (fac, fiction or opinion ) */}
          {post.type}
        </Text>
      </Card>
      </>
    );
  };

  // main return of the page
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={Logo}
          style={[
            styles.logo,
            { height: windowHeight * 0.04 },
            { width: windowWidth * 0.09 },
          ]}
          resizeMode="contain"
        />
      </View>

      <FlatList
        style={styles.feed}
        //  getting data to be sorted according to time
        data={scrapbooks.sort(function (a, b) {
          if (a.timestamp > b.timestamp) return -1;
          if (a.timestamp < b.timestamp) return 1;
          return 0;
        })}
        renderItem={({ item }) => renderPost(item)}
        // disable scroll
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: "100%",
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 10,
    zIndex: 1,
    height: "10%",
  },
  logo: {
    justifyContent: "space-around",
    alignContent: "center",
    maxWidth: 100,
    maxHeight: 100,
    marginBottom: 30,
    left: 10,
    bottom: 4,
  },
  feed: {
    marginHorizontal: 20,
    marginBottom: 37,
  },
  post: {
    marginVertical: 8,
    backgroundColor: "white",
  },
  postHeader: {
    position: "relative",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardSubTitle: {
    position: "absolute",
    top: -4,
    left: 35,
    fontSize: 15,
    top: 0.3,
  },
  cardTitle: {
    position: "absolute",
    fontSize: 22,
    fontWeight: "600",
    left: 0.5,
    zIndex: 1,
  },
  profilePicture: {
    position: "absolute",
    left: 17,
    bottom: 10,
  },
});
