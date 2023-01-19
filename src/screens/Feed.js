import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  View,
  Image,
} from "react-native";
import React from "react";
import { signOut } from "firebase/auth";
import Button from "../components/Button";
import { auth } from "../firebase";
import Logo from "../../assets/images/novella.png";

const Feed = () => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.header,
          { height: windowHeight * 0.1 },
          { width: windowWidth },
        ]}
      >
        <Image source={Logo} style={[styles.logo, {height: windowHeight * 0.07}, {width: windowWidth*0.09}]} resizeMode="contain" />
        <TouchableOpacity>
          <Text>Post</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Feed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
   
  },
  logo: {
    justifyContent: "space-around",
    alignContent: "center",
    maxWidth: 100,
    maxHeight: 100,
    marginBottom: 30,
    left: 10,
    bottom: 15

  },
});
