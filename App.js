import { StyleSheet } from "react-native";
import RootStack from "./src/routes";
import { LogBox } from 'react-native';
import { useEffect } from "react"
import * as Location from 'expo-location';

export default function App() {
  useEffect(()=>{
    async () => {
      await Location.requestForegroundPermissionsAsync()
    }
  },[])
  LogBox.ignoreLogs(['Warning: Async Storage has been extracted from react-native core']);
  return (
    
    <RootStack/>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
});
