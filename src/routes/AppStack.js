import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

import { AntDesign } from "@expo/vector-icons";

import Feed from "../screens/Feed";
import Explore from "../screens/Explore";
import Create from "../screens/Create";
import Notifications from "../screens/Notifications";
import UserProfile from "../screens/UserProfile";

const Tab = createMaterialBottomTabNavigator();

const AppStack = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Feed"
          component={Feed}
          options={{
            tabBarLabel: false,
            tabBarIcon: () => <AntDesign name="home" size={25} color="black" />,
          }}
        />
        <Tab.Screen
          name="Explore"
          component={Explore}
          options={{
            tabBarLabel: false,
            tabBarIcon: () => (
              <AntDesign name="search1" size={25} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="Create"
          component={Create}
          options={{
            tabBarLabel: false,
            tabBarIcon: () => (
              <AntDesign name="pluscircle" size={27} color="purple" />
            ),
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={Notifications}
          options={{
            tabBarLabel: false,
            tabBarIcon: () => (
              <AntDesign name="bells" size={25} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="UserProfile"
          component={UserProfile}
          options={{
            tabBarLabel: false,
            tabBarIcon: () => <AntDesign name="user" size={25} color="black" />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;

const styles = StyleSheet.create({});
