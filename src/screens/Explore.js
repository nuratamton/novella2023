import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import { getDocs, collection, query, where } from "firebase/firestore";
import { LogBox } from "react-native";
import { db, auth } from "../firebase";
import { Avatar } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { EvilIcons } from "@expo/vector-icons";
import Apploader from "../components/Apploader";

const Explore = ({ navigation }) => {

  // useStates
  const [data, setData] = useState([]);
  const [scrapbooks, setScrapbooks] = useState([])
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [userList, setUser] = useState([]);
  const [groupList, setGroup] = useState([]);
  const [Loading, setLoading] = useState(true);
  const colors = [
    "red",
    "#003f5d",
    "#065535",
    "#62156c",
    "#ff1493",
    "orange",
    "aquamarine",
  ];

  // to ignore warnings
  LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop']);

  // on load of the page, load these functions
  useEffect(() => {
    fetchUserData();
    fetchGroupData();
    fetchScrapbook();
  }, []);

  // change in userList, reload the page
  useEffect(() => {}, [userList]);

  // set Loading screen to false once group list and user list is loaded
  useEffect(() => {
    setLoading(false);
  }, [groupList, userList]);

  // data or tapped changed, reload the page
  useEffect(() => {}, [data]);

  useEffect(() => {
    // console.log(scrapbooks)
  }, [scrapbooks]);

  const fetchScrapbook = async () => {
    const ref = collection(db,"users")
    await getDocs(ref).then((item)=>{
      item.forEach(async (userDoc) => {
        const scrapRef = collection(db,"users",userDoc.id,"Scrapbooks")
        await getDocs(query(scrapRef,where("locationEnabled", "==", true))).then((doc)=>{
          doc.forEach((scrapbook) => {
            setScrapbooks((prev)=> [...prev, scrapbook.data()])
          })
        })
      })
    })
  }

  // function to fetch all users data
  const fetchUserData = async () => {
    let unsubscribed = false;
    // goes to users collection
    const Uref = collection(db, "users");
    // every user
    await getDocs(query(Uref, where("email", "!=", auth.currentUser.email)))
      .then((querySnapshot) => {
        if (unsubscribed) return;
        const newUserDataArray = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        // setting data variable to newUserDataArray
        setUser(newUserDataArray);
      })
      .catch((err) => {
        if (unsubscribed) return;
        console.error("Failed to retrieve data", err);
      });
    return () => (unsubscribed = true);
  };

  // function to fetch groups
  const fetchGroupData = async () => {
    let temp = [];
    await getDocs(collection(db, "users")).then((item) => {
      item.forEach(async (doc) => {
        await getDocs(collection(db, "users", doc.id, "Groups")).then(
          (data) => {
            data.forEach((group) => {
              temp.push(group.data());
            });
          }
        );
      });
    });
    setGroup(temp);
  };

  // function which filters out the search data on what is typed in the search box
  const searchFilter = (text) => {
    setData(userList.concat(groupList));
    if (text) {
      const newData = data.filter((item) => {
        let itemData;
        {
          item.username
            ? (itemData = item.username
                ? item.username.toUpperCase()
                : "".toUpperCase())
            : (itemData = item.groupname
                ? item.groupname.toUpperCase()
                : "".toUpperCase());
        }
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
      setSearch(text);
    } else {
      setFilteredData(data);
      setSearch(text);
    }
  };

  //To render username and profile pic on search
  const ItemView = ({ item }) => {

    return (
      <TouchableOpacity
        onPress={() => {
          item.id
            ? navigation.navigate("Profile", { item: item.id })
            : navigation.navigate("GroupProfile", {
                item: item.groupId,
                uid: item.admin,
              });
        }}
      >
        <View style={styles.user}>

          {/* if a field called profilePicsrc exists display it else display groupIcon*/}
          {/* to handle for both individual user and group search */}
          {item.profilePicsrc ? (
            <Avatar.Image
              style={styles.avatar}
              source={{ uri: item.profilePicsrc }}
            />
          ) : (
            <Avatar.Image
              style={styles.avatar}
              source={{ uri: item.groupIcon }}
            />
          )}
          {/* similar condition to display username or groupname */}
          {item.username ? (
            <Text style={styles.username}> {item.username}</Text>
          ) : (
            <Text style={styles.username}> {item.groupname}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // separator between each result displayed on search
  const ItemSeparatorView = () => {
    return <View style={{ height: 0.5, width: "100%" }} />;
  };

  // main rendering of the page
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <TextInput
            style={styles.searchBox}
            placeholder="Search"
            value={search}
            onChangeText={(text) => searchFilter(text)}
          />

          {/* Cross Icon, clears all the data */}
          <EvilIcons
            style={{ marginLeft: "90%", position: "absolute", marginTop: "5%" }}
            name="close"
            size={24}
            color="black"
            onPress={() => {
              setFilteredData([]), setSearch("");
            }}
          />
          <TouchableOpacity>
            <FlatList
              style={{ zIndex: 1, overflow: "visible", borderBottomRadius: 50 }}
              data={filteredData}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={ItemSeparatorView}
              renderItem={ItemView}
            />
          </TouchableOpacity>

          {/* adds the map to the page */}
          <MapView style={{ height: "100%", width: "100%" }}>
            {/* place the scrapbook on the map with latitude and longitude */}
            {scrapbooks.map((val) => {
              const latlong =
                val.location.coords.latitude && val.location.coords.longitude
                  ? {
                      latitude: parseFloat(val.location.coords.latitude),
                      longitude: parseFloat(val.location.coords.longitude),
                    }
                  : { latitude: 0, longitude: 0 };

              return (
                <Marker
                  key={val.id}
                  pinColor={colors[Math.floor(Math.random() * colors.length)]}
                  coordinate={latlong}
                >
                  <Callout tooltip onPress={() => navigation.navigate("Post", {item:val})}>
                    <View>
                      <View style={styles.bubble}>
                        <Text style={styles.name}>{val.title}</Text>
                        {/* To add the cover image on the map */}
                        <Image
                          style={styles.image}
                          source={{ uri: val.CoverImg }}
                        />
                      </View>
                      <View style={styles.arrowBorder} />
                      <View style={styles.arrow} />
                    </View>
                  </Callout>
                </Marker>
              );
            })}
          </MapView>
        </View>
      </View>
      {Loading ? <Apploader /> : null}
    </SafeAreaView>
  );
};

export default Explore;

const styles = StyleSheet.create({
  bubble: {
    flexDirection: "row",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderColor: "#ccc",
    borderWidth: 0.5,
    padding: 15,
    width: 150,
    height: 150,
  },
  container: {
    backgroundColor: "#8cdbf3",
    height: "100%",
    width: "100%",
  },
  searchBox: {
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 15,
    padding: 15,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    backgroundColor: "#ffffff",
  },
  user: {
    flex: 1,
    flexDirection: "row",
    padding: 5,
    backgroundColor: "#E6E6FA",
    borderRadius: 10,
    zIndex: 1,
  },
  username: {
    margin: 5,
    top: 17,
  },
  name: {
    fontSize: 16,
    marginBottom: 5,
  },
  arrow: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#fff",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderTopColor: "#007a87",
    borderWidth: 16,
    alignSelf: "center",
    marginTop: -0.5,
  },
  image: {
    width: 120,
    height: 80,
    right: 26,
    top: 30,
  },
});
