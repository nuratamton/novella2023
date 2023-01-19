import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import Button from "../components/Button";
import { auth } from "../firebase";

const UserProfile = () => {
  const handleSignOut = () => {
    signOut(auth)
   .then(() => {
     console.log("Logged out")
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

export default UserProfile;

const styles = StyleSheet.create({});
