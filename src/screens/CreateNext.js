import { StyleSheet, Text, View , SafeAreaView} from 'react-native'
import React ,{ useEffect , useState }from 'react'
import { db } from "../firebase";
import { getStorage,ref,uploadBytesResumable,getDownloadURL } from "firebase/storage";
// import { getDocs,collection,doc,setDoc,collectionGroup } from "firebase/firestore";
import Button from "../components/Button";
import { auth } from "../firebase";
import { ImagePicker } from 'expo-image-multiple-picker';
import Apploader from '../components/Apploader';
const CreateNext = ({navigation , route}) => {
    const [Url, setUrl] = useState(null);
    const [LoadingPP, setLoadingPP] = useState(false);
    const [Loadingimg, setLoadingimg] = useState(false);
    const [statechange , setstatechange] = useState(false);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [LoadingUp , setLoadingUp] = useState(false);
    const [Urls, addUrls] = useState([]);
    const storage = getStorage();
    const closeImagePicker = (assets) => {
      setSelectedImages([...assets]);
      console.warn(selectedImages)
      setShowImagePicker(false);
    };
  
    const ImagePickerContainer = () => {
      return (
        <>
        {LoadingPP ? setLoadingUp(true) : setLoadingUp(false)}
        <View style={styles.imagePickerContainer}>
          <ImagePicker
            onSave={(assets) => closeImagePicker(assets)}
            onCancel={() => setShowImagePicker(false)}
            multiple
            limit={6}
          />
        </View>
      </>
      );
    };

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
      console.log('here')
      setLoadingimg(true)
      selectedImages.forEach(async (item) => {
        console.log(item.uri)
        const name = item.uri.substring(item.uri.lastIndexOf('/') +1 )
        const storageRef = ref(storage, "images/Scrapbook images/" + name );
        const imga = await fetch(item.uri);
        const bytes = await imga.blob();
        await uploadBytesResumable(storageRef, bytes).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            addUrls((prev) => [...prev, downloadURL])
          })
        })
      })
      setLoadingimg(false)
      console.warn(Urls)
      //navigation.navigate('UserProfile')
    }
  return (
    <>
    {showImagePicker && <ImagePickerContainer />}
    <Button onPress={() => setShowImagePicker((pre) => !pre)}/>
    <Button type="TERITARY" onPress={() => uploadSelected()}/>
    {LoadingPP && Loadingimg ? <Apploader/> : null}
    {!LoadingPP && Loadingimg ? <Apploader/> : null}
    {(LoadingPP && !Loadingimg) && statechange? <Apploader/> : null}
    {LoadingUp && LoadingPP ? <Apploader/> : null}
    </>
  )
}

export default CreateNext

const styles = StyleSheet.create({
  imagePickerContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    zIndex: 9,
  },

})