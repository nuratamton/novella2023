import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
const Apploader = () => {
  return (
    <View style = {[StyleSheet.absoluteFillObject , styles.container]}>
      <LottieView source={require("../../assets/135039-loader.json")} autoPlay loop speed={2}/> 
    </View>
  )
}

export default Apploader

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)'
  },
})