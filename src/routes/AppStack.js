import { StyleSheet, Text, View } from "react-native";
import React from "react";

import { NavigationContainer } from "@react-navigation/native";
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

import CreateScrapbook from "../screens/CreateScrapbook";
import CreateGroup from "../screens/CreateGroup";

import CreateModal from "../components/CreateModal";
import { createStackNavigator } from "@react-navigation/stack";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// function CreateStack({navigation}) {
//   <NavigationContainer>
//     <Stack.Navigator>
//     <Stack.Screen
//         // options={{ headerShown: false }}
//         name="CreateModal"
//         component={CreateModal}
//       />
//       <Stack.Screen
//         // options={{ headerShown: false }}
//         name="CreateScrapbook"
//         component={CreateScrapbook}
//       />
//       <Stack.Screen
//         // options={{ headerShown: false }}
//         name="CreateGroup"
//         component={CreateGroup}
//       />
//     </Stack.Navigator>
//   </NavigationContainer>;
// };

const AppStack = () => {
  CreateStack = () => {
    return(
      <Stack.Navigator>
    <Stack.Screen
        // options={{ headerShown: false }}
        name="CreateModal"
        component={CreateModal}
      />
      <Stack.Screen
        // options={{ headerShown: false }}
        name="CreateScrapbook"
        component={CreateScrapbook}
      />
      <Stack.Screen
        // options={{ headerShown: false }}
        name="CreateGroup"
        component={CreateGroup}
      />
    </Stack.Navigator>
      )
    

  }
 


  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
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
          name="Feed"
          component={Feed}
          options={{
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
          name="CreateStack"
          children={this.CreateStack}
          // component={CreateStack}
          style={styles.button}
          options={{
            // tabBarButton: () => <CreateModal />,
            tabBarIcon: () => (
              <AntDesign name="pluscircle" size={30} color="purple" />
            ),
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
    </NavigationContainer>
  );
};

export default AppStack;

const styles = StyleSheet.create({});
