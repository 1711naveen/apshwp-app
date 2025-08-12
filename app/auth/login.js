
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('8874752747');
  const [password, setPassword] = useState('Shivam@421');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Function to speak welcome message
  const speakWelcomeMessage = (userName) => {
    try {
      const welcomeMessage = `Welcome ${userName}`;
      Speech.speak(welcomeMessage, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8,
        voice: undefined, // Will use default voice
      });
    } catch (speechError) {
      console.log('Speech error:', speechError);
      // Speech fails silently, won't affect login flow
    }
  };

  const handleLogin = async () => {
    try {
      console.log('Attempting login with:', { login: email, password: password });

      const response = await fetch('https://apshwp.ap.gov.in/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          login: email,
          password: password,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check if login was successful
      if (!data.token) {
        Alert.alert('Login Failed', data.message || 'Invalid credentials. Please check your login details.');
        return;
      }

      try {
        // Decode the JWT token
        // const decoded = jwtDecode(data.token);

        // // Save token and decoded data to AsyncStorage
        // await AsyncStorage.setItem('authToken', data.token);
        // await AsyncStorage.setItem('userInfo', JSON.stringify(decoded));
      
        // Get user's name for welcome message
        // const userName = decoded.name || decoded.username || 'User';
        const userName = data.user.name;

        // Speak welcome message
        speakWelcomeMessage(userName);

        Alert.alert('Login Success', `Welcome ${userName}!`);

        // Navigate to home screen
        router.replace('/(tabs)/home');
      } catch (decodeError) {
        console.error('Token decode error:', decodeError);
        Alert.alert('Error', 'Invalid token received from server.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.message.includes('Network request failed')) {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBox}>
          <Text style={styles.title}>Log In</Text>
        </View>

        <View style={styles.formBox}>
          <Text style={styles.label}>Phone Number / Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number or email"
            value={email}
            onChangeText={setEmail}
            keyboardType="default"
            autoCapitalize="none"
          />

          <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeButton}
            >
              <Ionicons
                name={isPasswordVisible ? 'eye-off' : 'eye'}
                size={24}
                color="#888"
              />
            </TouchableOpacity>
          </View>

          <Pressable onPress={() => Alert.alert('Forgot password pressed')}>
            <Text style={styles.forgotPassword}>Forget password?</Text>
          </Pressable>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <Text style={styles.signupText}>
            Don’t have an account?{' '}
            <Link href="/auth/signup" style={styles.signupLink}>
              Sign up
            </Link>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F5',
    paddingTop: 60,
  },
  topBox: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0D0D26',
  },
  formBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 30,
    flex: 1,
  },
  label: {
    color: '#0D0D26',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eyeButton: {
    paddingHorizontal: 10,
  },
  forgotPassword: {
    color: '#3D5CFF',
    fontSize: 12,
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#3D5CFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    marginTop: 30,
    textAlign: 'center',
    color: '#A0A0B2',
    fontSize: 14,
  },
  signupLink: {
    color: '#3D5CFF',
    fontWeight: 'bold',
  },
});
