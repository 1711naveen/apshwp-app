import { router } from 'expo-router'; // ✅ import router
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Page4() {
  const handleSignup = () => {
    router.replace('/auth/signup'); // ✅ navigate to /auth/signup.js
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Heading */}
        <Text style={styles.heading}>Calling All Adolescents and Youth!</Text>

        {/* Full Process Image */}
        <Image
          source={require('../../assets/images/app-images/process.png')}
          style={styles.processImage}
        />

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  processImage: {
    width: width * 0.9,
    height: height * 0.65,
    resizeMode: 'contain',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3D5CFF',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
