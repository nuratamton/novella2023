import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import React, { useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Card, Avatar } from "react-native-paper";
import { postId } from "./Feed";

const Post = ({ navigation, route }) => {
  const scrollx = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get("screen");

  const widthCard = width * 0.7;
  const heightCard = widthCard * 1.54;

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <StatusBar hidden />
      <View style={StyleSheet.absoluteFillObject}>
        {route.params.item.images.map((item, index) => {
          const inputRange = [
            (index - 1) * width,
            index*width,
            (index + 1) * width
          ]
          const opacity = scrollx.interpolate({
            inputRange,
            outputRange: [0, 1, 0]
          })
          return (
            <Animated.Image
              key={`image-${index}`}
              source={{ uri: item }}
              style={[StyleSheet.absoluteFillObject, {
                    opacity
              }]}
              blurRadius={50}
            />
          );
        })}
      </View>
      <Animated.FlatList
        data={route.params.item.images}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollx } } }],
          { useNativeDriver: true }
        )}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        renderItem={({ item }) => {
          return (
            <View
              style={{ width, justifyContent: "center", alignItems: "center",
              shadowColor: '#000',
              shadowOpacity: 0.7,
              shadowOffset: {
                width: 0,
                height: 0, 
              },
              shadowRadius: 30

             }}
            >
              <Image
                source={{ uri: item }}
                style={{
                  width: widthCard,
                  height: heightCard,
                  resizeMode: "cover",
                  borderRadius: 20,
                }}
              />
            </View>
          );
        }}
      />
      {/* <Card style={styles.posts}>
       <TouchableOpacity onPress={() => navigation.navigate('Post')}>
         <Card.Cover source={{ uri: postId.postImage }} resizeMode= "cover"/>
       </TouchableOpacity>
       <TouchableOpacity onPress={() => navigation.goBack()} title="Dismiss">
        <Ionicons name="chevron-back-outline" size={24} color="black" />
       </TouchableOpacity>
       <Card.Title */}
      {/* style={styles.postHeader}
         title={postId.userName}
         subtitle={postId.postTime}
         subtitleStyle={styles.cardSubTitle}
         right={(props) => ( */}
      {/* <Text>{post.postTime}</Text>
          )}
         left={(props) => ( */}
      {/* <Avatar.Image source={{ uri: postId.userImage }} size={25} />
         )}
       />
     </Card */}
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({});
