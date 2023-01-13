import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";
import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const RootStack = () => {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        // User is signed out
        setUser(undefined);
      }
    });
    return unsubscribe;
  }, []);

  return user ? <AppStack /> : <AuthStack />;
};

export default RootStack;

const styles = StyleSheet.create({});
