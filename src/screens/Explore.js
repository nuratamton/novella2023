import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import { SearchBar } from 'react-native-elements';
import {
  HeaderSearchBar,
  HeaderClassicSearchBar
} from "react-native-header-search-bar";
import InputBox from '../components/InputBox';
import { FlatList } from 'react-native-gesture-handler';

const Explore = () => {
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


  return (
    <SafeAreaView style={styles.container}>
      <Text>Explore</Text>
      <InputBox value={name} setValue={setName} placeholder="Search" />
      <FlatList
          style={styles.list}
          data={users}
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