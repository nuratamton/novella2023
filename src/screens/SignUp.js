import {
    KeyboardAvoidingView,
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import Logo from "../../assets/images/novella_logo.png";
  import InputBox from "../components/InputBox";
  import Button from "../components/Button";
  import { auth } from "../firebase";
  import {
    createUserWithEmailAndPassword,
  } from "firebase/auth";
  import { useNavigation } from "@react-navigation/core";
  
  const SignUp = () => {
    const windowWidth = Dimensions.get("window").width;
    const windowHeight = Dimensions.get("window").height;
  
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confpassword, setConfPassword] = useState("");

    const navigation = useNavigation();
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          navigation.replace("Accountcr");
        }
      });
  
      return unsubscribe;
    }, []);
  
    const handleSignUp = () => {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          console.log(user.email);
        })
        .catch((error) => alert(error.message));
    };
  
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
          <Button
            onPress={handleSignUp}
            text=" Sign Up"
          />
          <Button
          onPress={() => navigation.replace("Login")}
          text="Existing Member? Log In"
          type="SECONDARY"
          text_type = "SECONDARY"
          style={[
          { width: windowWidth * 10 }]}
        />
        </View>
      </KeyboardAvoidingView>
    );
  };
  
  export default SignUp;
  
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
  