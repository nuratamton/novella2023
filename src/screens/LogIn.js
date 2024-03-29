import {
  KeyboardAvoidingView,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import Logo from "../../assets/images/novella_logo.png";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/core";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Apploader from "../components/Apploader";
const LogIn = () => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [data, setData] = useState(true);
  const [Logging, setLogging] = useState(false);

  const navigation = useNavigation();

  const handleLogIn = async () => {
    setLogging(true);
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.warn("Logged In: ", user.email);
      })
      .catch((error) => alert("Incorrect login details entered!"));
    setLogging(false);
  };

  useEffect(() => {}, [data]);
  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="padding">
        <View style={styles.container}>
          <Image
            source={Logo}
            style={[
              styles.logo,
              { height: windowHeight * 0.3 },
              { width: windowWidth * 0.8 },
            ]}
            resizeMode="contain"
          />
          <InputBox value={email} setValue={setEmail} placeholder="Email" />
          <View style={styles.passwordContainer}>
            <InputBox
              value={password}
              setValue={setPassword}
              placeholder="Password"
              secure={data ? true : false}
              style={styles.passwordInput}
            />
            {data ? (
              <MaterialCommunityIcons
                style={{
                  marginLeft: "75%",
                  position: "absolute",
                  marginBottom: "20%",
                  left: '90%',
                 
                }}
                name={"eye-off"}
                color="gray"
                size={25}
                paddingHorizontal="12%"
                onPress={() => setData(!data)}
              />
            ) : (
              <MaterialCommunityIcons
                style={{
                  marginLeft: "75%",
                  position: "absolute",
                  marginBottom: "20%",
                  left: '90%'

                }}
                name={"eye"}
                color="gray"
                size={25}
                paddingHorizontal="12%"
                onPress={() => setData(!data)}
              />
            )}
          </View>

          <TouchableOpacity onPress={() => navigation.replace("forgotPass")}>
            <Text style={styles.forgotPassword}> Forgot Password </Text>
          </TouchableOpacity>

          <Button onPress={handleLogIn} text="Login" />
          <Button
            onPress={() => navigation.replace("Signup")}
            text="New Member? Sign Up"
            type="SECONDARY"
            text_type="SECONDARY"
          />
          {Logging ? <Apploader /> : null}
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default LogIn;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    padding: 100,
    width: "100%",
    height: "100%",
  },
  logo: {
    maxWidth: 500,
    maxHeight: 300,
    marginBottom: 30,
  },
  forgotPassword: {
    color: "#949391",
    left: 100,
  },
  passwordContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  eyeicon: {
    position: "absolute",
  },
});
