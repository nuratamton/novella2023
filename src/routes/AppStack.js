import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { NavigationContainer , createNavigationContainerRef} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { BlurView } from "expo-blur";

import { AntDesign } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import Feed from "../screens/Feed";
import Explore from "../screens/Explore";
import Create from "../screens/Create";
import Notifications from "../screens/Notifications";
import UserProfile from "../screens/UserProfile";

import Post from "../screens/Post";

import CreateScrapbook from "../screens/CreateScrapbook";
import CreateGroup from "../screens/CreateGroup";

import CreateModal from "../components/CreateModal";
import { createStackNavigator } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
export const navRef = createNavigationContainerRef();
const AppStack = () => {
  CreateStack = () => {
    return (
      <Stack.Navigator>
        {/* <Stack.Screen
        // options={{ headerShown: false }}
        name="CreateModal"
        component={CreateModal}
      /> */}
        <Stack.Screen
          options={{ headerShown: false }}
          name="CreateScrapbook"
          component={CreateScrapbook}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="CreateGroup"
          component={CreateGroup}
        />
      </Stack.Navigator>
    );
  };

  FeedStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Feed" component={Feed} />
        {/* <Stack.Screen name = "Post" component={Post} options={{presentation: "modal"}}/> */}
      </Stack.Navigator>
    );
  };

  TabStack = () => {
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarLabel: ({ focused }) => {
            let label;
            return (label = focused ? (
              <Octicons name="dot-fill" size={10} color="black" />
            ) : null);
          },
          tabBarStyle: { position: "absolute" },
          tabBarBackground: () => (
            <BlurView
              tint="light"
              intensity={100}
              style={StyleSheet.absoluteFill}
            />
          ),
        }}
      >
        <Tab.Screen
          name="FeedStack"
          component={FeedStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => {
              let label;
              return (label = focused ? (
                <Ionicons name="ios-home" size={24} color="black" />
              ) : (
                <Ionicons name="ios-home-outline" size={24} color="black" />
              ));
            },
          }}
        />
        <Tab.Screen
          name="Explore"
          component={Explore}
          options={{
            tabBarIcon: ({}) => (
              <AntDesign name="search1" size={25} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="CreateModal"
          component={CreateModal}
          // component={CreateStack}
          style={styles.button}
          options={{
            tabBarButton: () => <CreateModal />,
            // tabBarIcon: () => (
            //   <AntDesign name="pluscircle" size={30} color="purple" />
            // ),
          }}
        />
        <Tab.Screen
          name="Notifications"
          component={Notifications}
          options={{
            tabBarIcon: () => (
              <AntDesign name="bells" size={25} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="UserProfile"
          component={UserProfile}
          options={{
            tabBarIcon: ({ focused }) => {
              let label;
              return (label = focused ? (
                <Ionicons name="person" size={25} color="black" />
              ) : (
                <Ionicons name="person-outline" size={25} color="black" />
              ));
            },
          }}
        />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer ref={navRef}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="TabStack" component={TabStack} />
        <Stack.Screen
          name="Post"
          component={Post}
          options={{ presentation: "modal" }}
        />
        <Stack.Screen name="CreateModal" component={CreateModal} />
        <Stack.Screen name="CreateScrapbook" component={CreateScrapbook} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;

const styles = StyleSheet.create({});
