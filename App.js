import { StyleSheet } from "react-native";
import AuthStack from "./src/routes/AuthStack";
import AppStack from "./src/routes/AppStack";
import RootStack from "./src/routes";

export default function App() {
  return (
    <RootStack/>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
