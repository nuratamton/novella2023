import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import  { auth } from '../firebase.js'
import { BlurView } from 'expo-blur';

const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Logged out");
      })
      .catch((error) => alert(error.message));
    console.log(auth.currentUser);
  };

const CustomDrawer = props => {
  return (
    
    <View style={{flex: 1}}>
      
      {/* <BlurView tint="light" intensity={100} style={StyleSheet.absoluteFill} /> */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: '#8200d6'}}>
        <ImageBackground
          source={require('../../assets/images/default_profile.png')}
          style={{padding: 20}}>
          <Image
            source={require('../../assets/images/default_profile.png')}
            style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}
          />
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              fontFamily: 'Roboto-Medium',
              marginBottom: 5,
            }}>
            John Doe
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Roboto-Regular',
                marginRight: 5,
              }}>
              280 Coins
            </Text>
            <FontAwesome5 name="coins" size={14} color="#fff" />
          </View>
        </ImageBackground>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{paddingBottom: 70, borderTopWidth: 1, borderTopColor: '#ccc'}}>
        <TouchableOpacity onPress={() => {auth.signOut()}} style={{paddingVertical: 15}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="exit-outline" size={22} color='red' />
            <Text
              style={{
                fontSize: 17,
                marginLeft: 5,
                color: "red"
              }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;