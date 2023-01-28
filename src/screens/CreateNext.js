import { StyleSheet, Text, View } from 'react-native'
import React ,{ useEffect , useState }from 'react'
import { db } from "../firebase";
import { getStorage,ref,uploadBytesResumable,getDownloadURL } from "firebase/storage";
// import { getDocs,collection,doc,setDoc,collectionGroup } from "firebase/firestore";
import Button from "../components/Button";
import { auth } from "../firebase";
import * as ImagePicker from "expo-image-picker";
import Apploader from '../components/Apploader';
const CreateNext = ({navigation , route}) => {
    const [Url, setUrl] = useState(null);
    const [images, getImages] = useState([]);
    const [LoadingPP, setLoadingPP] = useState(false);
    const [Loadingimg, setLoadingimg] = useState(false);
    const [statechange , setstatechange] = useState(false);
    const ImageGallery = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit:10,
        aspect: [4, 3],
        quality: 0.1,
        maxHeight: 600,
        maxWidth: 800,
        minCompressSize: 900,
        compressQuality: 70,
      });
      console.warn(result)
    
      if (!result.canceled) {
        console.log(result);
        result.assets.forEach((doc) => {
          getImages((prev) => [...prev , doc.uri]);
        })
      }
    };

    const upload = async () => {
      const storage = getStorage();
      console.warn('success1')
  
      const name = route.params.item2.substring(route.params.item2.lastIndexOf('/') +1 )

      const storageRef = ref(storage, "images/Scrapbook Cover/" + name);
      const imga = await fetch(route.params.item2);
      console.warn('success2')
      const bytes = await imga.blob();
      await uploadBytesResumable(storageRef, bytes).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
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
  return (
    <>
    <Button onPress={ImageGallery}/>
    {LoadingPP && Loadingimg ? <Apploader/> : null}
    {!LoadingPP && Loadingimg ? <Apploader/> : null}
    {(LoadingPP && !Loadingimg) && statechange? <Apploader/> : null}
    </>
  )
}

export default CreateNext

const styles = StyleSheet.create({})