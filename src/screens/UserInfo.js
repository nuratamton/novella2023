import { StyleSheet, Text, View, Dimensions, KeyboardAvoidingView, Image } from "react-native";
import React, { useState } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import { addDoc , collection } from "firebase/firestore";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";
import {Logo} from "../../assets/images/novella.png"
import InputBox from "../components/InputBox";
import Button from "../components/Button";



const UserInfo = () => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;    
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [accountType, setAccountType] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setprofilePic] = useState(null);

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
      hideDatePicker();
    };

  const HandleInfo = async () => {
    await addDoc(collection(db,"users") , {
        username: username,
        name: name,
        birthDate: birthDate,
        accountType: accountType,
        bio: bio,

    }).then(() => {
        console.warn("Dunzo")
    }).catch((error) => {
        console.log(error);
    });

    

  }
  return (
    <KeyboardAvoidingView behavior="padding">
      <View style={styles.container}>
        <Image
          source={Logo}
          style={[
            styles.logo,
            { height: windowHeight * 0.3 },
            { width: windowWidth * 0.8 },
          ]}
          resizeMode="contain"
        />
        <InputBox
          value={profilePic}
          setValue={setprofilePic}
          placeholder="ProfilePic"
        />
        <InputBox
          value={username}
          setValue={setUsername}
          placeholder="Username"
          secure={false}
        />
        <InputBox
          value={name}
          setValue={setName}
          placeholder="Name"
        />
        {/* <InputBox
          value={birthDate}
          setValue={setBirthDate}
          placeholder="BirthDate"
        /> */}

        <View>
        <Button title="Show Date Picker" onPress={showDatePicker} />
        <DateTimePickerModal
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
        <InputBox
          value={bio}
          setValue={setBio}
          placeholder="Bio"
        />
        
        <Button onPress={HandleInfo} text=" Sign Up" />
        <Button
          onPress={() => navigation.replace("Login")}
          text="Existing Member? Log In"
          type="SECONDARY"
          text_type="SECONDARY"
          style={[{ width: windowWidth * 10 }]}
        />
      </View>
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
});
