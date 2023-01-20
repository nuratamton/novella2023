import { StyleSheet, Text, View } from "react-native";
import React from "react";

import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import VerifyStack from "./VerifyStack";
import MainStack from "./MainStack";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { onIdTokenChanged } from "firebase/auth/react-native";

const RootStack = () => {
  const Stack = createStackNavigator();
  const [user, setUser] = useState(auth.currentUser);
  const [isVerified , setisVerified] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(undefined);
      }
      onIdTokenChanged(auth, (user) => {
        if(user){
          setisVerified(user.emailVerified);
        }
      } )
    });
    return unsubscribe;
  }, []);

  if(user === undefined) {
    return <AuthStack/>
  } else if (!isVerified && user !== undefined){
    return <VerifyStack/>
  }else if (user !== undefined && isVerified) {
    return <AppStack/>     
  }
};

export default RootStack;

const styles = StyleSheet.create({});