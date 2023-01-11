import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/core";
import Button from "../components/Button";
import { auth } from "../firebase";

const Feed = () => {
  const navigation = useNavigation();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
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
