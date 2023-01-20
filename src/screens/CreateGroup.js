import { StyleSheet, Text, View , SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { popFromStack } from "../components/NavigationMethod"
const CreateGroup = () => {
  return (
    <SafeAreaView>
      <TouchableOpacity onPress = {() => popFromStack()}>
      <Text>CreateGroup</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default CreateGroup

const styles = StyleSheet.create({})