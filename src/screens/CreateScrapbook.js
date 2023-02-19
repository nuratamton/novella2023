import { StyleSheet,Text,View,SafeAreaView,TouchableOpacity,Image } from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { IconButton, Title } from "react-native-paper";
import { popFromStack } from "../components/NavigationMethod";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import * as ImagePicker from "expo-image-picker";
import { db } from "../firebase";
import { getStorage,ref,uploadBytesResumable,getDownloadURL } from "firebase/storage";
import { getDocs,collection,doc,setDoc,collectionGroup, getDoc, documentId } from "firebase/firestore";
import { auth } from "../firebase";
import uuid from "react-native-uuid";
import Apploader from '../components/Apploader';
import { AntDesign } from '@expo/vector-icons'; 


const CreateScrapbook = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [scrapbookCover, setScrapbookCover] = useState(null);
  const [hasPerm, setPerm] = useState(null);
  const [Username, setUser] = useState("");
  const [Url, setUrl] = useState(null); 
  const [Loading , setLoading] = useState(false);
  const UUID = uuid.v4();
  const storage = getStorage();



  useEffect(() => {
    (async () => {
      const gallery = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setPerm(gallery.status === "granted");
    });
    getUD()
  }, []);

  useEffect(() => {
    console.log(Username)
  }, [Username])

  useEffect(() => {
    console.log(Url)
  }, [Url])

  const getUD = async () => {
    const ref = doc(db, "users" , auth.currentUser.uid)
    await getDoc(ref).then((item) => {
      setUser(item.data().username);
      setUrl(item.data().profilePicsrc)
  })

  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
      maxHeight: 600,
      maxWidth: 800,
      minCompressSize: 900,
      compressQuality: 70,
    });

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
  const metadata = {
    contentType: 'image/jpeg'
  };
  

  const handleUpload = async () => {
    setLoading(true)
    await setDoc(doc(db, "users", auth.currentUser.uid, "Scrapbooks", UUID), {
      title: title,
      images: [],
      likes: 0,
      likesArray: [],
      comments: [],
      uid: auth.currentUser.uid,
      username: Username,
      profilepic: Url,
      docId: UUID,
    })
      .then(() => {
        setLoading(false)
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(scrapbookCover)
    navigation.navigate("CreateNext" , {item:UUID , item2:scrapbookCover});
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <IconButton
        icon="chevron-left"
        size={24}
        iconColor="black"
        onPress={async () => {
          popFromStack();
        }}
      /> */}
      <View style={styles.textCont}>
      <Text style={styles.heading}> Select the Scrapbook Cover Image : </Text>
      </View>
      <View style={styles.coverContainer}>
        <TouchableOpacity style={styles.plusButton} onPress={pickImage}>
          <Image style={styles.coverImage} source={{ uri: scrapbookCover }} />
          <Text> Add cover page </Text>
          <Feather name="plus" size={24} color="black" />
        
          
        </TouchableOpacity>
      <View style={styles.bottomCont}>
        <Text style={styles.bottomTxt}> Enter a Scrapbook Title </Text>
      </View>
      <InputBox value={title} setValue={setTitle} placeholder="Title" style={styles.title} />
      <Button text="Submit" onPress={handleUpload} />
      </View>
      {Loading ? <Apploader/> : null }
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
    height: "50%",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 10,
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
  textCont: {
    position:'relative',
    paddingBottom:"15%",
    paddingTop:"20%",

  },
  heading:{
    paddingTop:"20%",
    position:'absolute',
    left:"1.4%",
    fontSize: 20,
    fontWeight:'500'
  },
  bottomCont: {
    top:'1%',
    right:'25%',
    paddingBottom:"4%",
  },
  bottomTxt: {
    fontWeight:"600"
  },
});
