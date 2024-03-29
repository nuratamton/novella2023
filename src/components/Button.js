import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  
} from "react-native";
import React from "react";

const Button = ({ onPress, text, type = "PRIMARY", text_type = "PRIMARY", icon }) => {
  const windowWidth = Dimensions.get("window").width;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        styles[`container_${type}`],
        { width: windowWidth * 0.9 },
      ]}
    >
      <Text style={[styles.text, styles[`text_${text_type}`]]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",

    maxWidth: 500,
    padding: 20,
    margin: 20,

    borderRadius: 15,
  },

  container_PRIMARY: {
    backgroundColor: "#9576f5",
    borderColor: "#8367d6",
    borderWidth: 1,
  },

  container_SECONDARY: {
    position: "relative",
    bottom: 1,

    borderWidth: 1,
  },

  container_TERITARY: {
    position: "relative",
    backgroundColor: "#9576f5",
    bottom: 1,
    // borderWidth: 1,
    padding: 10
  },

  text: {
    color: '#000000'
  },

  text_PRIMARY: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  text_TERTIARY: {
    color: "#fff",
    margin: 0,
  },
});

export default Button;
