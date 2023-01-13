import { StyleSheet } from "react-native";
import React from "react";
import Feed from "../screens/Feed";
import LogIn from "../screens/LogIn";
import SignUp from "../screens/SignUp";
import EmailVerification from "../screens/EmailVerification";
import ForgotPassword from "../screens/ForgotPassword";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LogIn}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Signup"
          component={SignUp}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="forgotPass"
          component={ForgotPassword}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="EmailVerification"
          component={EmailVerification}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthStack;

const styles = StyleSheet.create({});
