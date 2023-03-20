import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Button as But,
} from "react-native";
import Checkbox from "expo-checkbox";
import React, { useState, useEffect, useRef } from "react";
import { Feather } from "@expo/vector-icons";
import { IconButton, Title } from "react-native-paper";
import { popFromStack } from "../components/NavigationMethod";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { db } from "../firebase";
import { getStorage } from "firebase/storage";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../firebase";
import uuid from "react-native-uuid";
import Apploader from "../components/Apploader";
import { AntDesign } from "@expo/vector-icons";
import { rotateX } from "react-native-flip-page/src/transform-utils";
import { Camera, CameraType } from "expo-camera";
import Tags from "react-native-tags";
import { Dropdown } from "react-native-element-dropdown";
import * as Location from "expo-location";
import { MaterialIcons } from '@expo/vector-icons'; 

const CreateScrapbook = ({ navigation, route }) => {
  const [title, setTitle] = useState("");
  const [scrapbookCover, setScrapbookCover] = useState(null);
  const [hasPerm, setPerm] = useState(null);
  const [Username, setUser] = useState("");
  const [groupId, setGroupId] = useState("");
  const [Url, setUrl] = useState(null);
  const [Loading, setLoading] = useState(false);
  const UUID = uuid.v4();
  const storage = getStorage();
  const [hasCameraPerm, setCameraPerm] = useState(null);
  const camRef = useRef(null);
  const [tagsarray, setTagsArray] = useState([]);
  const [value, setValue] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [locPerm, setLocPerm] = useState(null);
  const [location, setLocation] = useState("");
  const [locationSet, setLocationSet] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [pos, setPos] = useState("");
  const [checkLocation, setCheckLocation] = useState(false);
  const [hide, setHide] = useState(false);
  const [admin, setAdmin] = useState("");
  const [pressed, setPressed] = useState(true);

  useEffect(() => {
    console.log("hello", route.params.item);
    console.log("beech", route.params.uid);
    async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Grant Loc");
      }
      const gallery = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setPerm(gallery.status === "granted");
      setLocPerm(await Location.getForegroundPermissionsAsync());
      // const camera = await ImagePickerrequest
    };
    getUD();
  }, []);

  useEffect(() => {
    console.log("hello");
    setLocationSet(true);
    suplementary();
  }, [location]);

  useEffect(() => {
    console.log(locationName);
  }, [locationName]);

  // useEffect(() => {
  //   console.log(pos);
  // }, [pos]);

  useEffect(() => {
    console.log(groupId);
  }, [groupId]);
  useEffect(() => {}, [Username]);

  useEffect(() => {}, [tagsarray]);

  useEffect(() => {}, [Url]);

  useEffect(() => {
    console.log(hide);
  }, [hide]);

  useEffect(() => {
    if (title.length == 16) {
      alert("You cannot exceed 15 characters");
    }
  }, [title]);

  const data = [
    { label: "Fiction", value: "Fiction" },
    { label: "Fact", value: "Fact" },
    { label: "Opinion", value: "Opinion" },
  ];

  useEffect(() => {
    console.log(value);
  }, [value]);

  // const handleChange = event => {
  //   const result = event.target.value.replace(/[^a-z]/gi,'');

  //   setMessage(result);
  // };
  const askPermissionsAsync = async () => {
    await Camera.getCameraPermissionsAsync();
    await ImagePicker.requestCameraPermissionsAsync();
  };
  const suplementary = async () => {
    setLocationName(
      await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })
    );
  };
  // const AddTag = async () => {

  // }
  const getUD = async () => {
    let ref;
    {
      if (route.params.group) {
        ref = doc(db, "users", route.params.uid, "Groups", route.params.item);
        await getDoc(ref).then((item) => {
          setUser(item.data().groupname);
          setUrl(item.data().groupIcon);
          setGroupId(item.data().groupId);
          setAdmin(item.data().admin);
        });
      } else {
        ref = doc(db, "users", auth.currentUser.uid);
        await getDoc(ref).then((item) => {
          setUser(item.data().username);
          setUrl(item.data().profilePicsrc);
        });
      }
    }
  };
  const takeImage = async () => {
    await askPermissionsAsync();
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
      maxHeight: 600,
      maxWidth: 800,
      minCompressSize: 900,
      compressQuality: 70,
    });

    if (!result.canceled) {
      setScrapbookCover(result.assets[0].uri);
    }
  };
  if (hasCameraPerm === false) {
    return <Text> No access to Internal Storage </Text>;
  }
  const renderLabel = () => {
    if (value || isFocus) {
      return null;
    }
    return null;
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
      maxHeight: 600,
      maxWidth: 800,
      minCompressSize: 900,
      compressQuality: 70,
    });

    if (!result.canceled) {
      setScrapbookCover(result.assets[0].uri);
    }
  };
  if (hasPerm === false) {
    return <Text> No access to Internal Storage </Text>;
  }
  const addLoc = async () => {
    setLocation(await Location.getCurrentPositionAsync());
  };

  const handleUpload = async () => {
    setLoading(true);
    if (route.params.group) {
      await setDoc(
        doc(
          db,
          "users",
          route.params.uid,
          "Groups",
          route.params.item,
          "Scrapbooks",
          UUID
        ),
        {
          title: title,
          images: [],
          likes: 0,
          likesArray: [],
          comments: [],
          uid: auth.currentUser.uid,
          groupname: Username,
          groupIcon: Url,
          groupId: groupId,
          docId: UUID,
          tags: tagsarray,
          type: value,
          dateCreated: serverTimestamp(),
          locationEnabled: locationSet,
          location: location,
          locationName: locationName,
          hide: hide,
        }
      )
        .then(setLoading(false))
        .catch((error) => {
          console.log(error);
        });
    } else {
      await setDoc(doc(db, "users", auth.currentUser.uid, "Scrapbooks", UUID), {
        title: title,
        images: [],
        likes: 0,
        likesArray: [],
        comments: [],
        feedback: [],
        uid: auth.currentUser.uid,
        username: Username,
        profilepic: Url,
        docId: UUID,
        tags: tagsarray,
        type: value,
        dateCreated: serverTimestamp(),
        locationEnabled: locationSet,
        location: location,
        locationName: locationName,
        hide: hide,
      })
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    console.log(scrapbookCover);
    navigation.navigate("CreateNext", {
      item: UUID,
      item2: scrapbookCover,
      item3: route.params.uid,
      group: route.params.item,
    });
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <IconButton
        icon="chevron-left"
        size={24}
        iconColor="black"
        onPress={async () => {
          popFromStack();
        }}
      /> */}
      <View style={styles.textCont}>
        <Text style={styles.heading}> Select the Scrapbook Cover Image : </Text>
        <View>
        </View>
      </View>
      <View style={styles.droppy}>
        {renderLabel()}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Content Type" : "..."}
          searchPlaceholder="Scrapbook Content"
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setValue(item.value);
            setIsFocus(false);
          }}
          // renderLeftIcon={() => (
          //   // <AntDesign
          //   //   style={styles.icon}
          //   //   color={"purple"}
          //   //   name={isFocus ? "downcircle" : "upcircle"}
          //   //   size={20}
          //   // />
          // )}
        />
      </View>
      <View style={styles.coverContainer}>
        <TouchableOpacity style={styles.plusButton} onPress={pickImage}>
          <Image style={styles.coverImage} source={{ uri: scrapbookCover }} />
          <Text> Add cover page </Text>
          <MaterialIcons name="add-photo-alternate" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={takeImage} style={{bottom: 100, right: 1}}>
        <MaterialIcons name="add-a-photo" size={22} color="black" />
          </TouchableOpacity>

        {/* <View style={styles.bottomCont}> */}
        <Text style={styles.bottomTxt}> Enter a Scrapbook Title </Text>
        {/* </View> */}

        <InputBox
          value={title}
          maxLength={15}
          setValue={setTitle}
          placeholder="Title"
          style={styles.title}
        />
        <View>
          <Text>Tags:</Text>
          <Tags
            createTagOnReturn
            initialText=""
            textInputProps={{
              placeholder: "Tags",
            }}
            onChangeTags={(tag) => {
              tag[tag.length - 1] = "#" + tag[tag.length - 1];
              setTagsArray(tag);
            }}
            containerStyle={{
              justifyContent: "center",
              backgroundColor: "f2f2f2",
              width: "90%",
            }}
            inputStyle={{
              backgroundColor: "#f2f2f2",
              width: "100%",
              height: "30%",
              borderRadius: 10,
            }}
            renderTag={({
              tag,
              index,
              onPress,
              deleteTagOnPress,
              readonly,
            }) => (
              <TouchableOpacity key={`${tag}-${index}`} onPress={onPress}>
                <Text>{` ${tag} `}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={{ flexDirection: "row", right: "20%" }}>
          {pressed ? (
            <IconButton
              icon="map-marker-star-outline"
              color="green"
              size={24}
              onPress={addLoc}
            />
          ) : (
            <IconButton
              icon="map-marker-star-outline"
              color={"red"}
              size={24}
              disabled={true}
            />
          )}
          <Text style={{ top: "4%", right: 10 }}>Add my location</Text>
        </View>
        
        <View style={styles.checkboxContainer}>
        {locationName?
          <Checkbox
            value={hide}
            onValueChange={setHide}
            style={styles.checkbox}
          />:""
        }
          <Text style={styles.label}> Hide this scrapbook </Text>
        </View>


        <Button text="Submit" onPress={handleUpload} />
      </View>
      {Loading ? <Apploader /> : null}
    </SafeAreaView>
  );
};

export default CreateScrapbook;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#FFFFFF",
    height: "100%",
    width: "100%",
  },
  coverContainer: {
    height: 500,
    alignItems: "center",
  },
  plusButton: {
    width: "90%",
    height: "50%",
    borderRadius: 10,
    borderWidth: 1,
    // marginTop: 10,
    // marginBottom: 10,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  coverImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  textCont: {
    position: "relative",
    paddingBottom: "15%",
    paddingTop: "20%",
  },
  heading: {
    paddingTop: "20%",
    position: "absolute",
    left: "1.4%",
    fontSize: 20,
    fontWeight: "500",
  },
  bottomCont: {
    top: "1%",
    right: "25%",
    paddingBottom: "4%",
  },
  bottomTxt: {
    top: "1%",
    right: "23%",
    // paddingBottom: "4%",
    fontWeight: "600",
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  },
  dropdown: {
    marginRight: 203,
    marginLeft: 20,
    bottom: 30,
  },
  checkbox: {},
  label: {},
  checkboxContainer: {
    // top: 60,
    flexDirection: "row",
    // marginLeft:20
    right: "16.5%",
  },
});
