import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('Cooper_Kristin@gmail.com');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: email,     // use email field as username for testing
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Login Failed', errorData.message || 'Something went wrong.');
        return;
      }

      const data = await response.json();
      console.log('Login Success:', data);

      Alert.alert('Success', `Welcome, ${data.username}!`);
      // Save token or user info here if needed
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBox}>
        <Text style={styles.title}>Log In</Text>
      </View>

      <View style={styles.formBox}>
        <Text style={styles.label}>Your Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
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

        {/* <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or login with</Text>
          <View style={styles.line} />
        </View> */}

        {/* <View style={styles.socialContainer}>
          <Pressable
            style={styles.socialButton}
            onPress={() => Alert.alert('Google login pressed')}
          >
            <Image
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png',
              }}
              style={styles.socialIcon}
            />
          </Pressable>

          <Pressable
            style={styles.socialButton}
            onPress={() => Alert.alert('Facebook login pressed')}
          >
            <Image
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png',
              }}
              style={styles.socialIcon}
            />
          </Pressable>
        </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  orText: {
    marginHorizontal: 10,
    color: '#A0A0B2',
    fontSize: 12,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
  },
  socialIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
});
