import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import { addDoc, collection, setDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import { Dropdown } from 'react-native-element-dropdown';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { Button as ButtonDate } from "react-native-paper";
import Apploader from "../components/Apploader";
import { IconButton } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const EditProfile = ({ navigation, route }) => {
   const [username, setUsername] = useState("");
   const [existingUsername, setExistingUsername] = useState("");
  const [name, setName] = useState("");
  // const [birthDate, setBirthDate] = useState("Date Of Birth");
  const [value, setValue] = useState(null);
  const [bio, setBio] = useState("");
  const [profilePic, setprofilePic] = useState("");
  const [Loading , setLoading] = useState(false);
  const [hasPerm, setPerm] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  // const [Url, setUrl] = useState(
  //   "https://blogifs.azureedge.net/wp-content/uploads/2019/03/Guest_Blogger_v1.png"
  // );
  // const [Loading, setLoading] = useState(false);
  const storage = getStorage();
  const uid = auth.currentUser.uid;
  const data = [
    { label: 'Public', value: 'Public' },
    { label: 'Private', value: 'Private' },

  ]

  const storageRef = ref(storage, "/images/Profile Picture/" + uid);

  useEffect(() => {
    (async () => {
      const gallery = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setPerm(gallery.status === "granted");
    })
    async () => {
      const Uref = doc(db, "users", uid);
      const userDoc = await getDoc(Uref);

      setExistingUsername(userDoc.data().username)

      // setUsername(userDoc.data().username);
      // setBio(userDoc.data().bio);
      // setprofilePic(userDoc.data().profilePicsrc);
      // setName(userDoc.data().name);
      // setAccountType(userDoc.data().accountType);
    }

  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setprofilePic(result.assets[0].uri);
    }
  };

  if (hasPerm === false) {
    return <Text> No access to Internal Storage </Text>;
  }

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };
  const HandleInfo = async () => {
    setLoading(true);
    if (profilePic) {
      const imga = await fetch(profilePic);
      const bytes = await imga.blob();
      await uploadBytesResumable(storageRef, bytes).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then(async (downloadURL) => {
          await setDoc(doc(db, "users", auth.currentUser.uid), {
            profilePicsrc: downloadURL,
          }, {merge:true})
        });
      });
    }

    if(username !== ""){
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        username: username,
      }, )
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });

    }
    if (name !== ""){
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        name: name,
      }, )
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });
    }
    if (accountType !== ""){
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        accountType: value,
      }, )
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });
    }
    if (bio !== ""){
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        bio: bio,
      }, )
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });
    }
    
    setLoading(false);
    navigation.navigate("UserProfile" , {item: true});
  };
  return (
    <>
      <KeyboardAvoidingView behavior="padding" style={{backgroundColor: "#ffffff"}}>
        <ScrollView style = {{backgroundColor: "#ffffff", height: '100%'}}>
          <SafeAreaView>
            <IconButton
              icon="chevron-left"
              size={24}
              iconColor="black"
              onPress={() => navigation.goBack()}
            />
            <View style={styles.container}>
              <View style={styles.avatarContainer}>
                <TouchableOpacity style={styles.plusButton} onPress={pickImage}>
                  <Image style={styles.avatar} source={{ uri: profilePic }} />
                  <Feather name="plus" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <InputBox
                value={username}
                setValue={setUsername}
                placeholder="Username"
                secure={false}
              />
              <InputBox value={name} setValue={setName} placeholder="Name" />
              <InputBox value={bio} setValue={setBio} placeholder="Bio" />
              <View style={styles.droppy}>
        {renderLabel()}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? 'blue' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />
      </View>

              <Button onPress={HandleInfo} text="Update" />
            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
      {Loading ? <Apploader /> : null}
    </>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 100,
  },
  logo: {
    maxWidth: 500,
    maxHeight: 300,
    marginBottom: 30,
  },
  plusButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    marginBottom: 30,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  dateButton: {
    width: windowWidth * 0.9,
    maxWidth: 500,
    borderColor: "#f2f2f2",
    borderWidth: 1,
    borderRadius: 15,
    paddingTop: 10,
    paddingBottom: 10,
    margin: 10,
    display: "flex",
    alignItems: "flex-start",
  },
  droppy: {
    top:10,
    right:110,
  },
});
