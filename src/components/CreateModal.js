import { StyleSheet, Text, View, TouchableOpacity} from "react-native";
import Modal from "react-native-modal";
import { Button } from "react-native-elements";
import React, { useState } from "react";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

const CreateModal = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  // const navigation = useNavigation();
  return (
    <>
      <Button
        onPress={() => {
          setModalVisible(!modalVisible);
        }}
        buttonStyle={styles.createButton}
        icon={<AntDesign name="pluscircle" size={33} color="purple" />}
      />

      <View style ={styles.container}>
      <BlurView  tint='dark' intensity={100} style={StyleSheet.absoluteFill}/>
        <Modal
          isVisible={modalVisible}
          backdropOpacity={0.1}
          onBackdropPress={() => setModalVisible(false)}
          
          style={styles.modal}
          
        >
          <TouchableOpacity onPress={() => navigation.navigate('CreateScrapbook')}>
            <View style={styles.create_option1}>
            <Text> Create Scrapbook</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider}>
            <Text>                               </Text> 
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('CreateStack', { screen: 'CreateGroup' })}>
            <View style={styles.create_option2}>
            <Text> Create Group</Text>
            </View>
          </TouchableOpacity>

        </Modal>
      </View>
    </>
  );
};

export default CreateModal;

const styles = StyleSheet.create({
  createButton: {
    backgroundColor: "FFF",
  },
  container: {
    
    position: "relative",
    alignItems: "center",
    //backgroundColor: "white"
    
  },
  modal: {
    flex: 0,
    borderRadius: 20,
    height: "15%",
    width: "35%",
    backgroundColor: "white",
    position: "absolute",
    left: "27%",
    bottom: "7%",
    alignItems: "center",
    justifyContent: "center",
  },

    create_option1: {
    flexDirection: "row",
    // paddingBottom: 20,
    
  },

  divider: {

    borderBottomColor: "grey",
    borderBottomWidth: StyleSheet.hairlineWidth
  },

  create_option2: {
    flexDirection: "row",
    paddingTop:15,

  }
});
