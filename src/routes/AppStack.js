import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

import {
  NavigationContainer,
  createNavigationContainerRef
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator, DrawerItem, DrawerContentScrollView,
  DrawerItemList, } from "@react-navigation/drawer";

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
import Profile from "../screens/Profile";

import Post from "../screens/Post";

import CreateScrapbook from "../screens/CreateScrapbook";
import CreateGroup from "../screens/CreateGroup";
import CreateNext from "../screens/CreateNext";
import CreateModal from "../components/CreateModal";
import EditProfile from "../screens/EditProfile";

import { createStackNavigator } from "@react-navigation/stack";
import DrawerModel from "../screens/DrawerModel";
import CustomDrawer from "../components/CustomDrawer"

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

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
        initialRouteName="Feed"
      >
        <Stack.Screen name="Feed" component={Feed} />
        {/* <Stack.Screen name = "Post" component={Post} options={{presentation: "modal"}}/> */}
      </Stack.Navigator>
    );
  };

  function UserStack() {
    return (
      // <Drawer.Navigator
      //   screenOptions={{ headerShown: false, drawerPosition: "right", drawerType: "front" }}
      //   initialRouteName="UserProfile"
      //   drawerContent={props=>{<CustomDrawer {...props} />
      //     // <DrawerContentScrollView {...props}>
      //     //   <DrawerItemList {...props} />
      //     //   <DrawerItem label = "Sign Out" onPress={() => props.navigation.replace("Login")}/>
      //     // </DrawerContentScrollView>
      //   }
      //   }
      // >
      
      //   <Drawer.Screen name="UserProfile" component={UserProfile} initialParams={{ item: false }} />
      //   <Drawer.Screen name="DrawerModel" component={DrawerModel} />
  
      // </Drawer.Navigator>


      <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        drawerType: "front", 
        headerShown: false,
        drawerPosition: "right",
        drawerActiveBackgroundColor: '#aa18ea',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
        },
      }}>

    <Drawer.Screen name="UserProfile" component={UserProfile} initialParams={{ item: false }} />
    </Drawer.Navigator>

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
          name="UserStack"
          component={UserStack}
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
          options={{ presentation: "modal", headerMode: "float"}}
        />
        <Stack.Screen name="CreateModal" component={CreateModal} />
        <Stack.Screen name="CreateScrapbook" component={CreateScrapbook} />
        <Stack.Screen name="CreateGroup" component={CreateGroup} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="CreateNext" component={CreateNext} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppStack;

const styles = StyleSheet.create({});
