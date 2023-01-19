import {
  KeyboardAvoidingView,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import React, { useState } from "react";
import Logo from "../../assets/images/novella_logo.png";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import { auth } from "../firebase";

import { signInWithEmailAndPassword } from "firebase/auth";

import { useNavigation } from "@react-navigation/core";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const LogIn = () => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState({
    isSecureTextEntry: true,
  });

  const navigation = useNavigation();

  const handleLogIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.warn("Logged In: ", user.email);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ height: "100%", backgroundColor: "fff" }}
    >
      <View
        style={[
          styles.container,
          { height: windowHeight },
          { width: windowWidth },
        ]}
      >
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
        <View style={styles.passwordContainer}>
          <InputBox
            value={password}
            setValue={setPassword}
            placeholder="Password"
            secure={data.isSecureTextEntry ? true : false}
            style={styles.passwordInput}
          />
          <TouchableOpacity
            onPress={() => {
              setData({
                isSecureTextEntry: !data.isSecureTextEntry,
              });
            }}
          >
            <MaterialCommunityIcons
              name={data.isSecureTextEntry ? "eye-off" : "eye"}
              color="gray"
              size={25}
              paddingHorizontal="12%"
              style={styles.eyeicon}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.replace("forgotPass")}>
          <Text style={styles.forgotPassword}> Forgot Password </Text>
        </TouchableOpacity>

        <Button onPress={handleLogIn} text="Login" />

        <Button
          onPress={() => navigation.replace("Signup")}
          text="New Member? Sign Up"
          type="SECONDARY"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default LogIn;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 100,
  },
  logo: {
    maxWidth: 500,
    maxHeight: 300,
    marginBottom: 30,
  },
  forgotPassword: {
    color: "#949391",
    left: 100,
  },
  passwordContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  eyeicon: {
    position: "absolute",
  },
});
