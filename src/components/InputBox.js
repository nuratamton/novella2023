import { View, Text, TextInput, StyleSheet, Dimensions } from "react-native";
import React from "react";

const InputBox = ({ value, setValue, placeholder, secure = false, ref }) => {
  const windowWidth = Dimensions.get("window").width;

  return (
    <View style={[styles.container, { width: windowWidth * 0.9 }]}>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        secureTextEntry={secure}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f2f2",
    maxWidth: 500,
    borderColor: "#f2f2f2",
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
    margin: 10,
  },
  input: {},
});

export default InputBox;
