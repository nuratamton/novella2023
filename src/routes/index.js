import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import VerifyStack from "./VerifyStack";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { onIdTokenChanged } from "firebase/auth/react-native";

const RootStack = () => {
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
  } else if (user !== undefined && isVerified) {
    return <AppStack/>
  } else if (user !== undefined && !isVerified){
    return <VerifyStack/>
  }
};

export default RootStack;

const styles = StyleSheet.create({});