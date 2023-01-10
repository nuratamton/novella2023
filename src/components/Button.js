import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import React from "react";

const Button = ({onPress, text, type = "PRIMARY"}) => {
  const windowWidth = Dimensions.get("window").width;

  return (
    <Pressable onPress={onPress} style={[styles.container, styles[`container_${type}`] ,{ width: windowWidth * 0.9 }]}>
      <Text style={[styles.text, ]}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container:{
    alignItems: "center",
   
    maxWidth: 500,
    padding: 20,
    margin: 20,

    borderRadius: 15,
  },

  container_PRIMARY:{
    backgroundColor: "#E1E0FF",
  },
  
  container_TERITARY:{
  },

  text: {
    fontWeight: "bold",
    fontStyle: "normal",
  },
});

export default Button;
