import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { db, auth } from "../firebase";
import React, { useEffect, useState } from "react";
import { getDocs,getDoc,collection,doc,setDoc,collectionGroup } from "firebase/firestore";
const util = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [scrapbooks, getScrapbooks] = useState([]);
  const getUserDetails = async () => {
    const Uref = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(Uref);
    setUserDetails(userDoc.data());
    console.log(userDoc.data())
  }
  return (
    <View>
      <Text>util</Text>
    </View>
  )
}

export default util

const styles = StyleSheet.create({})