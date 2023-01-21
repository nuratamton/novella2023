import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
// import React, { useState, useEffect } from "react";
// import { popFromStack } from "../components/NavigationMethod";
// import { Feather } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";
// import { getStorage, ref, uploadBytes } from "firebase/storage";
// import { auth } from "../firebase";
// import { db } from "../firebase";
// import {
//   addDoc,
//   collection,
//   setDoc,
//   doc,
//   getDownloadURL,
//   Firestore,
// } from "firebase/firestore";
// import { IconButton } from "react-native-paper";
// import InputBox from "../components/InputBox";
// import Button from "../components/Button";
// // import { async } from "@firebase/util";

const CreateScrapbook = async() => {
  // const [scrapbookCover, setScrapbookCover] = useState(null);
  // const [title, setTitle] = useState("");
  // const [hasPerm, setPerm] = useState(null);
  // const storage = getStorage();

  // const storageRef = ref(storage, auth.currentUser.email);
  // const docRef =doc(db, "users", auth.currentUser.uid);
  // const docSnap = await getDoc(docRef);

  // useEffect(() => {
  //   (async () => {
  //     const gallery = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     setPerm(gallery.status === "granted");
  //   })();
  // }, []);

  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });
  //   console.log(result);
  //   if (!result.canceled) {
  //     setScrapbookCover(result.assets[0].uri);
  //   }
  // };

  // if (hasPerm === false) {
  //   return <Text> No access to Internal Storage </Text>;
  // }

  // const HandleUpload= async () => {
  //   await db.collection(users).doc(auth.currentUser.uid).collection(Scrapbooks) ({
  //     title: title,
  //     email: auth.currentUser.email,
  //   })
  //     .then(() => {
  //       console.warn("Dunzo");
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  //     await uploadBytes(storageRef, scrapbookCover).then((snapshot) => {
  //       console.log('Uploaded a blob or file!');
  //     });
  //   navigation.navigate("Feed");
  // };

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
      {/* <Button text= "Upload" onPress={HandleUpload}/> */}
    </SafeAreaView>
  );
};

export default CreateScrapbook;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#FFFFFF",
    height: '100%',
    width: '100%'
  },
  coverContainer: {
    alignItems: "center",
  },
  plusButton: {
    width: "90%",
    height: "70%",
    borderRadius: 50,
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
