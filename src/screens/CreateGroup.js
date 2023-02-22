import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import { addDoc, collection, setDoc, doc } from "firebase/firestore";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import Apploader from "../components/Apploader";
import { async } from "@firebase/util";
import { popFromStack } from "../components/NavigationMethod";
import uuid from "react-native-uuid";

const CreateGroup = ({ navigation }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [groupName, setGroupName] = useState("");
  const [desc, setDesc] = useState("");
  const [birthDate, setBirthDate] = useState("xoxoDOB");
  const [accountType, setAccountType] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setprofilePic] = useState("");
  const [hasPerm, setPerm] = useState(null);
  const [Url, setUrl] = useState(
    "https://blogifs.azureedge.net/wp-content/uploads/2019/03/Guest_Blogger_v1.png"
  );
  const [Loading, setLoading] = useState(false);
  const storage = getStorage();
  const uid = auth.currentUser.uid;
  const UUID = uuid.v4();
  const storageRef = ref(storage, "/images/Profile Picture/" + uid);

  const createGroup = async () => {
    if (profilePic) {
      const imga = await fetch(profilePic);
      const bytes = await imga.blob();
      await uploadBytesResumable(storageRef, bytes).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then(async (downloadURL) => {
          console.log(downloadURL);
          await setDoc(doc(db, "users", auth.currentUser.uid, "Groups", UUID), {
            groupIcon: downloadURL,
          })
        });
      });
    }
    await setDoc(doc(db, "users", auth.currentUser.uid, "Groups", UUID), {
      groupId: UUID,
      admin: auth.currentUser.uid,
      groupname: groupName,
      description: desc,
      accountType: accountType,
      members: []
    }, {merge: true});
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setprofilePic(result.assets[0].uri);
    }
  };

  return (
    <>
      <ScrollView style={{ backgroundColor: "white" }}>
        <KeyboardAvoidingView>
          <View style={styles.textCont}>
            <Text style={styles.heading}> Create a new group :</Text>
          </View>
          <View style={styles.container}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity style={styles.plusButton} onPress={pickImage}>
                <Image style={styles.avatar} source={{ uri: profilePic }} />
                <Feather name="plus" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <InputBox
              value={groupName}
              setValue={setGroupName}
              placeholder="Group Name"
              secure={false}
            />
            <InputBox
              value={desc}
              setValue={setDesc}
              placeholder="Description"
            />
            <InputBox
              value={accountType}
              setValue={setAccountType}
              placeholder="AccountType"
            />
          </View>
          <Button
            onPress={() =>{createGroup(), navigation.navigate("AddMembers", {docId: UUID})}}
            text="Create"
         
 />
        </KeyboardAvoidingView>
      </ScrollView>
      {Loading ? <Apploader /> : null}
    </>
  );
};

export default CreateGroup;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    // height:"100%",
    backgroundColor: "#ffffff",
    alignItems: "center",
    padding: 50,
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
  avatarContainer: {
    paddingBottom: 50,
  },
  textCont: {
    backgroundColor: "white",
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
});
