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
import MapView, { Marker } from "react-native-maps";
import {
  getDocs,
  collection,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { LogBox } from 'react-native';
import { db, auth } from "../firebase";
import { Avatar } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { EvilIcons } from "@expo/vector-icons";
import Apploader from "../components/Apploader";
const Explore = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [userList, setUser] = useState([]);
  const [groupList, setGroup] = useState([]);
  const [scrapbooks, setScrapbooks] = useState([]);
  LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop']);
  // setSearch(value)
  const [Loading, setLoading] = useState(true);
  const colors = ["red" , "#003f5d" , "#065535" , "#62156c" , "black" , "white" , "#ff1493" , "orange" , "aquamarine"]
  useEffect(() => {
    fetchUserData();
    fetchGroupData();
    fetchScrapbook();
    // return () => {};
  }, []);
  useEffect(() => {}, [userList]);
  useEffect(() => {
    setLoading(false);
  }, [groupList, userList]);
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
        //console.log(newUserDataArray);
      })
      .catch((err) => {
        if (unsubscribed) return;
        console.error("Failed to retrieve data", err);
      });
    return () => (unsubscribed = true);
  };

  const fetchGroupData = async () => {
    let temp = [];
    await getDocs(collection(db, "users")).then((item) => {
      item.forEach(async (doc) => {
        await getDocs(collection(db, "users", doc.id, "Groups")).then(
          (data) => {
            data.forEach((group) => {
              
              temp.push(group.data());
              // console.log(group.data());
              // console.log("BLEHHHH");
            });
          }
        );
      });
    });
    setGroup(temp);
    // console.log(temp);
  };

  // const Placemarker = ({item}) => {
  //   const randomColor = ;
  //   console.log(item)
  //   // return (
  //   //   <Marker 
  //   //   
  //   //   pinColor= {colors[randomColor]}
  //   //   onPress={navigation.navigate("Post" , {item: item})} 
  //   //   />
  //   // )
  // }

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
          <Image style={styles.avatar} source={{ uri: item.profilePicsrc }} />
          <Text style={styles.username}> {item.username}</Text>
          <Image style={styles.avatar} source={{ uri: item.groupIcon }} />
          <Text style={styles.username}> {item.groupname}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ItemSeparatorView = () => {
    return <View style={{ height: 0.5, width: "100%" }} />;
  };

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

          <MapView style={{ height: "100%", width: "100%" }} >
          {/* <FlatList
              style={styles.feed}
              data={scrapbooks}
              renderItem={({ item }) => Placemarker(item)}
              showsVerticalScrollIndicator={false}
              initialScrollIndex={scrapbooks.length + 1}
            /> */}
            {scrapbooks.map((val) => {
              const latlong = val.location.coords.latitude &&
               val.location.coords.longitude?
               {latitude:parseFloat(val.location.coords.latitude),longitude: parseFloat(val.location.coords.longitude)} : {latitude:0,longitude:0}
              return(
              <Marker
              key={val.id}
              pinColor={colors[Math.floor(Math.random() * colors.length)]}
              coordinate={latlong}
              title = {val.title}
              onPress={()=>navigation.navigate("Post", {item:val})}
              />)
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
  container: {
    backgroundColor: "#8cdbf3",
    height: "100%",
    width: "100%",
  },
  searchBox: {
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 50,
    padding: 15,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    backgroundColor: "#ffffff",
  },
  avatar: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  user: {
    // position: "relative",
    flex: 1,
    flexDirection: "row",
    padding: 20,
    backgroundColor: "#E6E6FA",
    borderRadius: 10,
    zIndex: 1,
  },
  avatar: {
    position: "absolute",
    // left: 20,
    // top: 20
  },
  username: {
    // position: "absolute",
  },
});
