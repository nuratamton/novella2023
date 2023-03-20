import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  FlatList,
  Image,
  Animated,
  StatusBar,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "../firebase";
import * as ImagePicker from "expo-image-picker";
import Apploader from "../components/Apploader";
import { AntDesign } from "@expo/vector-icons";
import { IconButton } from 'react-native-paper'
import { Camera, CameraType } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const CreateNext = ({ navigation, route }) => {
  const [Url, setUrl] = useState(null);
  const [Loading, setLoading] = useState(false)
  const [selectedImages, setSelectedImages] = useState([]);
  const [LoadingUp, setLoadingUp] = useState(false);
  const [hasPerm, setPerm] = useState(null);
  const [disable, setDisable] = useState(false);

  const storage = getStorage();

  const scrollx = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get("screen");
  const widthCard = width * 0.7;
  const heightCard = widthCard * 1.54;

  const topRef = useRef();
  const bottomRef = useRef();
  const [actIndex, setactIndex] = useState(0);
  const setActiveIndex = (index) => {
    setactIndex(index);
    topRef?.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
    if (index * (80 + 12) - 80 / 2 > width / 2) {
      bottomRef?.current?.scrollToOffset({
        offset: index * (80 + 12) - width / 2 + 80 / 2,
        animated: true,
      });
    } else {
      bottomRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };

  useEffect(() => {
    console.warn(selectedImages);
  }, [selectedImages]);
  const askPermissionsAsync = async () => {
    await Camera.getCameraPermissionsAsync();
    await ImagePicker.requestCameraPermissionsAsync()
    
    };
    const takeImage = async () => {
      await askPermissionsAsync()
      let result = await ImagePicker.launchCameraAsync({
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
        const name = result.assets[0].uri.substring(
          result.assets[0].uri.lastIndexOf("/") + 1
        );
        const storageRef = ref(storage, "images/Scrapbook images/" + name);
        await fetch(result.assets[0].uri).then(async (res) => {
          await res.blob().then(async (byt) => {
            await uploadBytesResumable(storageRef, byt).then((snapshot) => {
              getDownloadURL(snapshot.ref).then((downloadURL) => {
                setSelectedImages((oldArray) => [...oldArray, downloadURL]);
              });
            });
          });
        });
      }
      setLoading(false)
    };
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
      const name = result.assets[0].uri.substring(
        result.assets[0].uri.lastIndexOf("/") + 1
      );
      const storageRef = ref(storage, "images/Scrapbook images/" + name);
      await fetch(result.assets[0].uri).then(async (res) => {
        await res.blob().then(async (byt) => {
          await uploadBytesResumable(storageRef, byt).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
              setSelectedImages((oldArray) => [...oldArray, downloadURL]);
            });
          });
        });
      });
    }
    setLoading(false)
  };
  if (hasPerm === false) {
    <Text> 
      No access to Internal Storage
    </Text>

  }

  const upload = async () => {
    console.warn("success1");

    const name = route.params.item2.substring(
      route.params.item2.lastIndexOf("/") + 1
    );

    const storageRef = ref(storage, "images/Scrapbook Cover/" + name);
    const imga = await fetch(route.params.item2);
    console.warn("success2");
    const bytes = await imga.blob();
    await uploadBytesResumable(storageRef, bytes).then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then((downloadURL) => {
        setUrl(downloadURL);
      });
    });
    console.warn("success3");
  };
  useEffect(() => {
    upload();
  }, []);

  const uploadSelected = async () => {

    if (route.params.group) {
      await setDoc(
        doc(db, "users", route.params.item3, "Groups", route.params.group, "Scrapbooks", route.params.item),
        {
          timestamp: serverTimestamp(),
          CoverImg: Url,
          images: selectedImages,
        },
        { merge: true }
      )
        .then(() => {
        })
        .catch((error) => {
          console.log(error);
        });
      navigation.navigate("GroupProfile", {itemCheck: true});
    }

    else{
    await setDoc(
      doc(db, "users", route.params.item3, "Scrapbooks", route.params.item),
      {
        timestamp: serverTimestamp(),
        CoverImg: Url,
        images: selectedImages,
      },
      { merge: true }
    )
      .then(() => {
      })
      .catch((error) => {
        console.log(error);
      });
    navigation.navigate("UserStack", {screen: 'UserProfile'} , {itemCheck: true});
  };
}
  return (
    <>
      {/* <View style={{ flex: 1, backgroundColor: "#FFF" }}>
     
      </View> */}
        <StatusBar hidden />
        <View style={StyleSheet.absoluteFillObject}>
         
          {selectedImages.map((item, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const opacity = scrollx.interpolate({
              inputRange,
              outputRange: [0, 1, 0],
            });
            return (
              <Animated.Image
                key={`image-${index}`}
                source={{ uri: item }}
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    opacity,
                  },
                ]}
                blurRadius={50}
              />
            );
          }
          )}
        </View>
        <IconButton
        icon="image-plus"
        size={25}
        iconColor="black"
        style={{alignItems: "center" , left:1, marginTop: 40, marginLeft: 30}}
        onPress={async () => {
          setLoading(true)
          pickImage();
        }}
      />
      <View>
          <TouchableOpacity onPress= {takeImage}>
            <AntDesign name="camera" size={24} color="black" />
          </TouchableOpacity>
      </View>
        {/* <IconButton onPress={() => pickImage()} /> */}
        {/* <Button onPress={() => pickImage()} /> */}


        <Animated.FlatList
          ref={topRef}
          data={selectedImages}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollx } } }],
            { useNativeDriver: true }
          )}
          onMomentumScrollEnd={(ev) => {
            setActiveIndex(Math.floor(ev.nativeEvent.contentOffset.x / width));
          }}
          keyExtractor={(_, index) => index.toString()}
          horizontal={true}
          pagingEnabled
          showsHorizontalScrollIndicatior={false}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  width,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOpacity: 0.7,
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowRadius: 30,
                }}
              >
                <Image
                  source={{ uri: item }}
                  style={{
                    width: widthCard,
                    height: heightCard,
                    resizeMode: "cover",
                    borderRadius: 20,
                  }}
                />
              </View>
            );
          }}
        />
        <Animated.FlatList
          ref={bottomRef}
          data={selectedImages}
          keyExtractor={(item) => item.toString()}
          showsHorizontalScrollIndicator={false}
          style={{ position: "absolute", bottom: 120, marginLeft: 60 }}
          contentContainerStyle={{
            paddingHorizontal: 10,
            justifyContent: "center",
          }}
          horizontal
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => setActiveIndex(index)}>
                <Image
                  source={{ uri: item }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    marginRight: 10,
                    borderWidth: 2,
                    borderColor: actIndex === index ? "#fff" : "transparent",
                  }}
                />
              </TouchableOpacity>
            );
          }}
        />

      <View style = {styles.container}>
        
         <TouchableOpacity style = {styles.text} onPress={() => {
              uploadSelected();
            }}>
                        {selectedImages.map((item, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];
            const opacity = scrollx.interpolate({
              inputRange,
              outputRange: [0, 1, 0],
            });
            return (
              <Animated.Image
                key={`image-${index}`}
                source={{ uri: item }}
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    opacity,
                  },
                ]}
                blurRadius={50}
              />
            );
          }
          )}
            <Text style={styles.textStyle}>
               Upload
            </Text>
         </TouchableOpacity>
      </View>
      {Loading? <Apploader/> : null}

    </>
  );
};

export default CreateNext;

const styles = StyleSheet.create({
  backIcon: {
    right: '90%',
    bottom: '60%'
 
   },
   container: {
    paddingTop: "20%",
    alignItems: 'center',
 },
 text: {
    borderWidth: 7,
    paddingTop: 10,
    paddingBottom: "5%",
    paddingLeft: 100,
    paddingRight: 100,
    backgroundColor: '#fff',
    borderRadius: 10,
    bottom: "10%",
    zIndex:3,
    marginBottom:20,
 },
 textStyle:{
  top:2,
  fontWeight:"800",
  fontSize: 20,
  color: '#FFF'
 },

});
