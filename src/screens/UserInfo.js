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
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import { addDoc, collection, setDoc, doc } from "firebase/firestore";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";
import { Logo } from "../../assets/images/novella_logo.png";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import { getStorage, ref, uploadBytesResumable , getDownloadURL} from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { BorderlessButton } from "react-native-gesture-handler";
import { Button as ButtonDate} from "react-native-paper";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const UserInfo = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("Date Of Birth");
  const [accountType, setAccountType] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setprofilePic] = useState(null);
  const [hasPerm, setPerm] = useState(null);
  const [Url , setUrl] = useState("");
  const storage = getStorage();
  const uid = auth.currentUser.uid;

  const storageRef = ref(storage, "/images/Profile Picture/" + uid);

  useEffect(() => {
    (async () => {
      const gallery = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setPerm(gallery.status === "granted");
    })();
  }, []);

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

  if (hasPerm === false) {
    return <Text> No access to Internal Storage </Text>;
  }

  const navigation = useNavigation();

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    setBirthDate(date);
    hideDatePicker();
  };

  const HandleInfo = async () => {
    await uploadBytesResumable(storageRef, profilePic);
    const url = await getDownloadURL(storageRef);
    while(url === null){
      url = await getDownloadURL(storageRef);
    }
    setUrl(url);
    await setDoc(doc(db, "users", auth.currentUser.uid), {
      username: username,
      name: name,
      Date: birthDate,
      accountType: accountType,
      bio: bio,
      email: auth.currentUser.email,
      followers: [],
      following: [],
      profilePicsrc: url ,

    })
      .then(() => {
        console.warn("Dunzo");
      })
      .catch((error) => {
        console.log(error);
      });

    navigation.navigate("EmailVerification");
  };
  return (
    <KeyboardAvoidingView>
      <ScrollView>
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

          <View>
            <TouchableOpacity onPress={showDatePicker} >
            <ButtonDate buttonColor="#f2f2f2"  textColor= "#6E6E6E" style={styles.dateButton} labelStyle={{textAlign: 'left'}} >
            <Text style={{textAlign:"left" , fontWeight: 'normal'}}> {birthDate.toString().substring(4,15)} </Text>
            </ButtonDate>
            </TouchableOpacity>
            <DateTimePickerModal
              title="Date Of Birth"
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>

          <InputBox
            value={accountType}
            setValue={setAccountType}
            placeholder="AccountType"
          />
          <InputBox value={bio} setValue={setBio} placeholder="Bio" />

          <Button onPress={HandleInfo} text="Submit" />
          <Button
            onPress={() => navigation.replace("Login")}
            text="Existing Member? Log In"
            type="SECONDARY"
            text_type="SECONDARY"
            style={[{ width: windowWidth * 10 }]}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default UserInfo;

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
    paddingBottom:10,
    margin: 10,
    display:'flex',
    alignItems:'flex-start',

  },
});
