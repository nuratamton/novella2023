import { StyleSheet } from "react-native";
import RootStack from "./src/routes";
import { LogBox } from 'react-native';



export default function App() {
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
