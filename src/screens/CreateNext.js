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
  getDocs,
  collection,
  doc,
  setDoc,
  collectionGroup,
  arrayUnion,
} from "firebase/firestore";
import Button from "../components/Button";
import { auth } from "../firebase";
import * as ImagePicker from "expo-image-picker";
import Apploader from "../components/Apploader";
// import Carousel from 'react-native-snap-carousel';
import { Button as ButtonDate } from "react-native-paper";

const CreateNext = ({ navigation, route }) => {
  const [Url, setUrl] = useState(null);
  const [LoadingPP, setLoadingPP] = useState(false);
  const [Loadingimg, setLoadingimg] = useState(false);
  const [statechange, setstatechange] = useState(false);
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
      console.log(result);
      const name = result.assets[0].uri.substring(
        result.assets[0].uri.lastIndexOf("/") + 1
      );
      const storageRef = ref(storage, "images/Scrapbook images/" + name);
      await fetch(result.assets[0].uri).then(async (res) => {
        await res.blob().then(async (byt) => {
          await uploadBytesResumable(storageRef, byt).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
              console.log("Download URL" + downloadURL);
              setSelectedImages((oldArray) => [...oldArray, downloadURL]);
            });
          });
        });
      });
    }
  };
  if (hasPerm === false) {
    return <Text> No access to Internal Storage </Text>;
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
    setLoadingPP(false);
    console.warn("success3");
  };
  useEffect(() => {
    setLoadingPP(true);
    upload();
  }, []);

  const uploadSelected = async () => {
    await setDoc(
      doc(db, "users", auth.currentUser.uid, "Scrapbooks", route.params.item),
      {
        CoverImg: Url,
        images: selectedImages,
      },
      { merge: true }
    )
      .then(() => {
        setLoadingimg(false);
      })
      .catch((error) => {
        console.log(error);
      });
    navigation.navigate("UserStack");
  };
  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
     
      </View>
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
        <Button onPress={() => pickImage()} />
          <Button
            type="TERITARY"
            onPress={() => {
              setLoadingimg(true);
              uploadSelected();
            }}
            style={styles.button}
          />

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
          style={{ position: "absolute", bottom: 80, marginLeft: 60 }}
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

    </>
  );
};

export default CreateNext;

const styles = StyleSheet.create({});
