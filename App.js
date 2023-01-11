import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, SafeAreaView } from "react-native";
import Feed from "./src/screens/Feed";
import LogIn from "./src/screens/LogIn";
import SignUp from "./src/screens/SignUp";
import AccountCreate from "./src/screens/AccountCreate";
import ForgotPassword from "./src/screens/ForgotPassword";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Signup"
          component={SignUp}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LogIn}
        />
        <Stack.Screen name="forgotPass" component={ForgotPassword} />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Accountcr"
          component={AccountCreate}
        />

        <Stack.Screen
          options={{ headerShown: false }}
          name="Feed"
          component={Feed}
        />
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
