import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Button from "../components/Button";
import { auth } from "../firebase";
import { sendEmailVerification } from "firebase/auth";
import { IconButton } from 'react-native-paper';
const EmailVerification = () => {
  const [disablebutton, setdisable] = useState(false);
  const [limit , setlimit] = useState(0);

  return (
    <View style={styles.container}>
      <IconButton
      icon="chevron-left" 
      size={24} 
      iconColor="black"
      onPress={ async () => {
        await auth.signOut();
        
       }
      } 
      />
      <Text style={styles.text}> Verify Your Email </Text>
      <Button
        onPress={ () => { 
          auth.currentUser.reload()
          console.warn('Checking') 
        }}
        text="Press to Continue"
      />
      <Button
        text="Resend Mail"
        type="SECONDARY"
        text_type="SECONDARY"
        disabled={disablebutton}
        onPress={ () => {
          if(limit < 11) {
            sendEmailVerification(auth.currentUser);
            setlimit(limit +1);
          }
          else{
            console.warn("chill out buddy, no more emails for you......");
            setdisable(true);
            
          }
        }
      }
      />
    </View>
  );
};

export default EmailVerification;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 100,
    paddingTop: 300,
  },
  text: {},
});