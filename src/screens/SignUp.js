import {
  KeyboardAvoidingView,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Logo from "../../assets/images/novella_logo.png";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/core";
import { FontAwesome } from "@expo/vector-icons";
import Apploader from '../components/Apploader';
const SignUp = () => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confpassword, setConfPassword] = useState("");
  const [Loading , setLoading] = useState(false);
  const navigation = useNavigation();

  const disallowed = ["~", "`", "!","#","$","%","^","&","*","(",")","_","-","+","=","{","[","}","]","|","/\//g",":",";","\"","'","<",",",">","/","?"]
  

  const handleSignUp = async (error) => {
    setLoading(true)
    if (password !== confpassword) {
      alert("Passwords do not match");
    } else if (password.length < 6) {
      alert("Please enter a password which is at least 6 characters long")
    } else if (disallowed.some(v => password.includes(v))){
      alert("Please enter a password which is does not contain special characters")
    } else {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          console.log(user.email);
        })
        .then(async () => {
          await sendEmailVerification(auth.currentUser)
            .then(() => {
              alert("Verification Email Sent!");
              setLoading(false)
            })
            .catch((error) => {
              alert(error.message);
            });
        });
    }
  };

  return (
    <>
    <ScrollView>
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
            value={email}
            setValue={setEmail}
            placeholder="Email"
            secure={false}
          />
          <InputBox
            value={password}
            setValue={setPassword}
            placeholder="Password"
            secure={true}
          />
          <InputBox
            value={confpassword}
            setValue={setConfPassword}
            placeholder="Confirm Password"
            secure={true}
          />
          <Button onPress={handleSignUp} text=" Sign Up" />
          <Button
            onPress={() => navigation.replace("Login")}
            text="Existing Member? Log In"
            type="SECONDARY"
            text_type="SECONDARY"
            style={[{ width: windowWidth * 10 }]}
          />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
    {Loading ? <Apploader/> : null }
    </>
  );
};

export default SignUp;

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
});
