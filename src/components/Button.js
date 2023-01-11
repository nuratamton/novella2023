import { View, Text, StyleSheet, Dimensions, TouchableOpacity} from "react-native";
import React from "react";


const Button = ({onPress, text, type = "PRIMARY"}) => {
  const windowWidth = Dimensions.get("window").width;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, styles[`container_${type}`] ,{ width: windowWidth * 0.9 }]}>
      <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
    </TouchableOpacity>
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
    
  },

  text_PRIMARY:{
    fontWeight: "bold",
  },
  text_TERTIARY:{

  }
});

export default Button;
