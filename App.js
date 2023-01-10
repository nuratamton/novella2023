import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import { AuthProvider } from './src/contexts/authContext';
import LogIn from './src/screens/LogIn';

export default function App() {
  return (

    <SafeAreaView style={styles.container}>
      < LogIn />
      <StatusBar style="auto" />
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
