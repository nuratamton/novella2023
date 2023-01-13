import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/core";
const EmailVerification = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}> Verify Your Email </Text>
      <Button
        onPress={() => navigation.replace("Login")}
        text="Press to Continue"
      />
    </View>
  );
};

export default EmailVerification;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 100,
    paddingTop: 300,
  },
  text: {},
});
