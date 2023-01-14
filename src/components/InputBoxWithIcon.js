import { StyleSheet, Dimensions } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";

const InputBoxIc = ({ value, setValue, placeholder }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [TextEntry, setSecureTextEntry] = useState(true);
  const [icon, setIcon] = useState("eye-off");

  return (
    <TextInput
      style={[
        styles.container,
        { width: windowWidth * 0.9 },
        { height: windowHeight * 0.035 },
      ]}
      value={value}
      mode="outlined"
      theme={{ colors: { primary: "#f2f2f2", underlineColor: "#f2f2f2" } }}
      onChangeText={setValue}
      placeholder={placeholder}
      secureTextEntry={TextEntry}
      right={
        <TextInput.Icon
          top={7}
          left={8}
          size={26}
          icon={icon}
          onPress={() => {
            setSecureTextEntry(!TextEntry);
            if (TextEntry === false) setIcon("eye");
            else setIcon("eye-off");
          }}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F2F2F2",
    maxWidth: 500,
    borderColor: "#F2F2F2",
    borderWidth: 1,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    padding: 15,
    margin: 10,
  },
  input: {},
});

export default InputBoxIc;
