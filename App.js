import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView } from "react-native";
import SignUp from "./src/screens/SignUp";
import LogIn from "./src/screens/LogIn";
import Feed from "./src/screens/Feed";
import AccountCreate from "./src/screens/AccountCreate";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator>
      <Stack.Screen options={{headerShown: false}} name="Signup" component={SignUp} />
        <Stack.Screen options={{headerShown: false}} name="Login" component={LogIn} />
        <Stack.Screen options={{headerShown: false}} name="Feed" component={Feed} />
        <Stack.Screen options={{headerShown: false}} name="Accountcr" component={AccountCreate} /> 
      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
