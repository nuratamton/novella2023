import {
  KeyboardAvoidingView,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import Logo from "../../assets/images/novella_logo.png";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import {auth} from '../firebase'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';

const LogIn = () => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredentials => {
      const user = userCredentials.user;
      console.log(user.email)
    })
    .catch(error => alert(error.message))
  }

  const handleLogIn = () => {
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredentials => {
      const user = userCredentials.user;
      console.log("Logged In: ",user.email)
    })
    .catch(error => alert(error.message))
  }

  const forgotPasswordPressed = () => {
    console.warn("forgot password pressed");
  };

  // const signUpPressed = () => {
  //   AuthProvider(email, password)
  //     .then((userCredentials) => {
  //       const user = userCredentials.user;
  //       console.log(user.email);
  //     })
  //     .catch((error) => alert(error.message));
  //   console.warn("Sign Up is pressed hard my guy");
  // };

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
        <Button onPress={handleLogIn} text="Login" />
        <Button
          onPress={forgotPasswordPressed}
          text="Forgot Password"
          type="TERTIARY"
        />
        <Button
          onPress={handleSignUp}
          text="New Member? Sign Up"
          type="TERTIARY"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default LogIn;

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
