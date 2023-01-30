import { StyleSheet, Text, View , SafeAreaView, Dimensions, FlatList, Image} from 'react-native'
import React ,{ useEffect , useState }from 'react'
import { db } from "../firebase";
import { getStorage,ref,uploadBytesResumable,getDownloadURL } from "firebase/storage";
import { getDocs,collection,doc,setDoc,collectionGroup , arrayUnion} from "firebase/firestore";
import Button from "../components/Button";
import { auth } from "../firebase";
import * as ImagePicker from "expo-image-picker";
import Apploader from '../components/Apploader';
// import Carousel from 'react-native-snap-carousel';
import { Button as ButtonDate } from "react-native-paper";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const CreateNext = ({navigation , route}) => {



  
    const [Url, setUrl] = useState(null);
    const [LoadingPP, setLoadingPP] = useState(false);
    const [Loadingimg, setLoadingimg] = useState(false);
    const [statechange , setstatechange] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [LoadingUp , setLoadingUp] = useState(false);
    const [Urls, addUrls] = useState([]);
    const [hasPerm, setPerm] = useState(null);
    const [disable, setDisable] = useState(false);
    const storage = getStorage();

    const width = windowWidth * 0.7;
    const height = width * 1.54;
    


    useEffect(() => {
      console.warn(selectedImages.length)

    }, [selectedImages])
    useEffect(() => {
      console.warn(Urls)

    }, [Urls])

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
        setSelectedImages(oldArray => [...oldArray,result.assets[0].uri])

      }
    };
    if (hasPerm === false) {
      return <Text> No access to Internal Storage </Text>;
    }
  

    const upload = async () => {
      console.warn('success1')
  
      const name = route.params.item2.substring(route.params.item2.lastIndexOf('/') +1 )

      const storageRef = ref(storage, "images/Scrapbook Cover/" + name);
      const imga = await fetch(route.params.item2);
      console.warn('success2')
      const bytes = await imga.blob();
      await uploadBytesResumable(storageRef, bytes).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then((downloadURL) => {
        setUrl(downloadURL);
        })
      })
      setLoadingPP(false)
      console.warn('success3')
    }
    useEffect(() => {
      setLoadingPP(true)
      upload();
        
    }, []);


    const uploadSelected = () => { 
      setDisable(true)
      console.log('here')
      selectedImages.forEach(async (item) => {
        console.log(item)
        const name = item.substring(item.lastIndexOf('/') +1 )
        const storageRef = ref(storage, "images/Scrapbook images/" + name );
        const imga = await fetch(item);
        const bytes = await imga.blob();
        await uploadBytesResumable(storageRef, bytes).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            console.log("Download URL" + downloadURL)
            addUrls(prev=> [...prev, downloadURL])
          })
        })
        await setDoc(doc(db, "users", auth.currentUser.uid, "Scrapbooks", route.params.item), {
          CoverImg: Url,
          images: Urls,
        }, {merge:true})
          .then(() => {
            setLoadingimg(false)
          })
          .catch((error) => {
            console.log(error);
          });
      })
      setDisable(false)
      console.warn(Urls)
      //navigation.navigate('UserProfile')
    }
  return (
    <>
    <View style={styles.swiperContainer}>
    <Button onPress={() => pickImage()}/>
    <Button type="TERITARY" onPress={() => {
      setLoadingimg(true)
      uploadSelected()}} style={styles.button}/>
      <FlatList
      data={selectedImages}
      horizontal 
      pagingEnabled
      keyExtractor={(_, index) => index.toString()}
      renderItem={({item}) => { 
        return <View style={{width: windowWidth , justifyContent:'center' , alignItems: 'center'}}> 
              <Image source={{uri: item}} style={{
                width: width,
                height: height,
                resizeMode: 'contain',
                borderRadius: 50,
              }}/>
          </View>

      }}
      
      />

    {LoadingPP && Loadingimg ? <Apploader/> : null}
    {!LoadingPP && Loadingimg ? <Apploader/> : null}
    {(LoadingPP && !Loadingimg) && statechange? <Apploader/> : null}
    {LoadingUp && LoadingPP ? <Apploader/> : null}
    </View>
    </>

  )
}

export default CreateNext

const styles = StyleSheet.create({
  swiperContainer: {
    flex: 1, 
    backgroundColor: '#fff'
  },
  button: {
    width: windowWidth * 0.9,
    maxWidth: 500,
    borderColor: "#f2f2f2",
    borderWidth: 1,
    borderRadius: 15,
    paddingTop: 10,
    paddingBottom: 10,
    margin: 10,
    display: "flex",
    alignItems: "flex-start",
  },

})