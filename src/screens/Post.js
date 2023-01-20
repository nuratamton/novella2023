import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Card, Avatar } from "react-native-paper";
import { postId } from "./Feed";


const Post = ({ navigation }) => {
  return (
      console.warn(postId)
    //   <Card style={styles.posts}>
    //   <TouchableOpacity onPress={() => navigation.navigate('Post')}>
    //     <Card.Cover source={{ uri: postId.postImage }} resizeMode= "cover"/>
    //   </TouchableOpacity>
    //   <TouchableOpacity onPress={() => navigation.goBack()} title="Dismiss">
    //     <Ionicons name="chevron-back-outline" size={24} color="black" />
    //   </TouchableOpacity>
    //   <Card.Title
    //     style={styles.postHeader}
    //     title={postId.userName}
    //     subtitle={postId.postTime}
    //     subtitleStyle={styles.cardSubTitle}
    //     // right={(props) => (
    //     //   <Text>{post.postTime}</Text>
    //     // )}
    //     left={(props) => (
    //       <Avatar.Image source={{ uri: postId.userImage }} size={25} />
    //     )}
    //   />
    // </Card>
  
  );
};

export default Post;

const styles = StyleSheet.create({});
