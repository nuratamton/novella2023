import { StyleSheet } from "react-native";
import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AppStack from "./AppStack";

const Stack = createStackNavigator();

const MainStack= () => {
  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator>
        {AppStack}
        {/* <Stack.Screen
          options={{ headerShown: false }}
          name="AppStack"
          children={AppStack}
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainStack;

const styles = StyleSheet.create({});
