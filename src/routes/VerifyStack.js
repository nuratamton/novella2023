import { StyleSheet, Text, View } from "react-native";
import React from "react";
import EmailVerification from "../screens/EmailVerification";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const VerifyStack = () => {
  return ( 
    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
           options={{ headerShown: false}}
           name="EmailVerification"
          component={EmailVerification}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default VerifyStack;

const styles = StyleSheet.create({});