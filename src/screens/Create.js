import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";

import { AntDesign } from "@expo/vector-icons";

const Create = () => {
  return (null
    // <SafeAreaView style={styles.container}>
    //   <View style={styles.header}>
    //     <TouchableOpacity>
    //       <AntDesign name="left" size={24} color="black" />
    //     </TouchableOpacity>
    //     <TouchableOpacity>
    //       <Text>Post</Text>
    //     </TouchableOpacity>
    //   </View>
    // </SafeAreaView>
  );
};

export default Create;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "blue",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
});
