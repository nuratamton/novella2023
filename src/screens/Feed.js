import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/core";
import Button from "../components/Button";
import { auth } from "../firebase";

const Feed = () => {
  const navigation = useNavigation();

const handleSignOut = async() => {
    await signOut(auth)
      .then(() => {
        console.log("Logged out")
        // navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
      console.log(auth.currentUser)
  };

  return (
    <KeyboardAvoidingView behavior="padding">
      <View>
        <Text>Feed Screen</Text>
        <Button onPress={handleSignOut} text="Sign out noob" />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Feed;

const styles = StyleSheet.create({});
