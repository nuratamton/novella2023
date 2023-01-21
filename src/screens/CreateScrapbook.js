import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { IconButton, Title } from "react-native-paper";
import { popFromStack } from "../components/NavigationMethod";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import * as ImagePicker from "expo-image-picker";
import { db } from "../firebase";
import { getDocs, collection, doc , setDoc } from "firebase/firestore";
import { auth } from "../firebase";

const CreateScrapbook = () => {
  const [title, setTitle] = useState("");
  const [scrapbookCover, setScrapbookCover] = useState(null);
  const [hasPerm, setPerm] = useState(null);
  const [coverPic,setcoverPic] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [Username, setUser] = useState("");
  const storageRef = ref(storage, "/images/Scrapbook Cover/"+uid);

  useEffect(() => {
    (async () => {
      const gallery = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setPerm(gallery.status === "granted");
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setScrapbookCover(result.assets[0].uri);
    }
  };
  if (hasPerm === false) {
    return <Text> No access to Internal Storage </Text>;
  }

  const test = async () => {
    const ref = collection(db, "users");
    const testvar = await getDocs(ref);
    testvar.forEach((doc) => {
      setUser(doc.data().username);
    });
  };

  const handleUpload = async () => {
    await uploadBytes(storageRef, );
    const ref = collection(db, "users",auth.currentUser.uid,"Scrapbook")
    const uniqueId = ref.doc().id
    await setDoc(doc(db, ref, uniqueId) ,{
      title:title

    })
      .then(() => {
        console.warn("Dunzo");
      })
      .catch((error) => {
        console.log(error);
      });
    navigation.navigate("Feed");
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <IconButton
        icon="chevron-left"
        size={24}
        iconColor="black"
        onPress={async () => {
          popFromStack();
        }}
      />
      <View style={styles.coverContainer}>
        <TouchableOpacity style={styles.plusButton} onPress={pickImage}>
          <Image style={styles.coverImage} source={{ uri: scrapbookCover }} />
          <Feather name="plus" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <InputBox value={title} setValue={setTitle} placeholder="Title" />
      <Button text="Upload" onPress={handleUpload} />
    </SafeAreaView>
  );
};

export default CreateScrapbook;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#FFFFFF",
    height: "100%",
    width: "100%",
  },
  coverContainer: {
    alignItems: "center",
  },
  plusButton: {
    width: "90%",
    height: "70%",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 30,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
  },
  coverImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});
