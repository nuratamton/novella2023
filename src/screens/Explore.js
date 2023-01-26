import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React, { useState , useEffect} from 'react'
import { SearchBar } from 'react-native-elements';
import { HeaderSearchBar, HeaderClassicSearchBar } from "react-native-header-search-bar";
import InputBox from '../components/InputBox';
import { FlatList } from 'react-native-gesture-handler';
import { getDocs,getDoc,collection,doc,setDoc,collectionGroup, QuerySnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";
const Explore = () => {
  const [userDataArray, setUserDataArray] = useState([]);
  useEffect(() => {
    let unsubscribed = false;
    const Uref = collection(db, "users");
    const userDoc = getDocs(Uref)
    .then((querySnapshot) => {
      if (unsubscribed) return;
      const newUserDataArray = querySnapshot.docs
      .map((doc) => ({ ...doc.data(), id: doc.id }));
      setUserDataArray(newUserDataArray);
      console.log(newUserDataArray)
    })
    .catch((err) => {
      if(unsubscribed) return;
      console.error("Failed to retrieve data", err)
    });
    return () => unsubscribed = true;
  }, []);

  const users = [
    {
      id: "1",
      userName: "nuratamton",
    },
    {
      id: "2",
      userName: "gaurangchitnis",
    },
    {
      id: "3",
      userName: "test1",
    },
    {
      id: "4",
      userName: "test2",
    },
  ]

  const [name, setName] = useState(users)

  renderPost = (user) => {
    const selectPost = () => {
      setId(user.id);
      console.warn(user.id);
    };

    return (
      <View>
        <Text> {user.username} </Text>
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <Text>Explore</Text>
      <InputBox value={name} setValue={setName} placeholder="Search" />
      <FlatList
          style={styles.list}
          data={userDataArray}
          renderItem={({ item }) => renderPost(item)}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
    </SafeAreaView>
  )
}

export default Explore

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff"
  }
})