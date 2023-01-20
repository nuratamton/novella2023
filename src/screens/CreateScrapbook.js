import { StyleSheet, Text, View , TouchableOpacity, SafeAreaView} from 'react-native'
import React from 'react'
import { popFromStack } from "../components/NavigationMethod"
const CreateScrapbook = () => {
  return (
    <SafeAreaView>
      <TouchableOpacity onPress = {() => popFromStack()}>
      <Text>CreateScrapbook</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default CreateScrapbook

const styles = StyleSheet.create({
  
})