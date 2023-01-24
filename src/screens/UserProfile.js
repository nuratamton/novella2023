import { KeyboardAvoidingView, StyleSheet, Text, View , TouchableOpacity } from "react-native";
import React , {useState}from "react";
import { signOut } from "firebase/auth";
import Button from "../components/Button";
import { auth } from "../firebase";
import { Card } from "react-native-paper";
import { getDocs, collection, doc, setDoc, collectionGroup } from "firebase/firestore";
import { ref } from "firebase/storage";
import { db } from '../firebase'
const UserProfile = () => {
  const handleSignOut = () => {
    signOut(auth)
   .then(() => {
     console.log("Logged out")
   })
   .catch((error) => alert(error.message));
   console.log(auth.currentUser)
};
const [img , setimg] = useState('');

const FetchData = async () => {
  const ref = collection(db,"users",auth.currentUser.uid,"Scrapbooks");
  const data = await getDocs(ref);
  data.forEach((item) => {
    console.log(item.data())
    setimg(item.data().CoverImg);

  });
}

  return (
    <KeyboardAvoidingView behavior="padding">
      <View>
        <Text>Feed Screen</Text>
        <Button onPress={() => FetchData() } text="Sign out noob" />
      </View>
      <Card>
      <TouchableOpacity onPress={() => navigation.navigate("Post")}>
          <Card.Cover source={{ uri: img }} resizeMode="cover" />
      </TouchableOpacity>
      </Card>


    </KeyboardAvoidingView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({});
