import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import React, { useState } from "react";
import Logo from "../../assets/images/novella_logo.png";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import { AuthProvider } from "../contexts/authContext";

const LogIn = () => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // testing button
  const signInPressed = () => {
    console.warn("Logged In");
  }

  const forgotPasswordPressed =() => {
    console.warn("forgot password pressed");
  }

  const signUpPressed =() => {
    AuthProvider
      .createUserWithEmailAndPassword(email,password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log(user.email)
      })
      .catch(error => alert(error.message))
    console.warn("Sign Up is pressed hard my guy");
  }



  return (
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
      <InputBox value = {email} setValue = {setEmail} placeholder="Email" secure={false}/>
      <InputBox value = {password} setValue = {setPassword} placeholder="Password" secure={true}/>
      <Button onPress = {signInPressed} text="Login"/>
      <Button onPress = {forgotPasswordPressed} text="Forgot Password" type = "TERTIARY"/>
      <Button onPress = {signUpPressed} text="New Member? Sign Up" type = "TERTIARY"></Button>
    </View>
  );
};

export default LogIn;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  logo: {
    maxWidth: 1000,
    maxHeight: 300,
    marginBottom: 30

  },
});
