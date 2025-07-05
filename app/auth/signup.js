import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function SignUpScreen() {
  const [email, setEmail] = useState('Cooper_Kristin@gmail.com');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignUp = () => {
    if (!agreeTerms) {
      Alert.alert('Please agree to the terms and conditions');
      return;
    }
    Alert.alert('Sign up successful!');
    // You can add API calls or navigation here
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBox}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.subtitle}>
          Enter your details below & free sign up
        </Text>
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

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignUp}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Creat account</Text>
        </TouchableOpacity>

        <View style={styles.checkboxRow}>
          <Checkbox
            value={agreeTerms}
            onValueChange={setAgreeTerms}
            color={agreeTerms ? '#3D5CFF' : undefined}
          />
          <Text style={styles.checkboxLabel}>
            {'  '}By creating an account you have to agree with our them &
            condication.
          </Text>
        </View>

        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Link href="/auth/login" style={styles.loginLink}>
            Log in
          </Link>
        </Text>
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
  subtitle: {
    color: '#A0A0B2',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
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
    marginBottom: 16,
  },
  eyeButton: {
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#3D5CFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxRow: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  checkboxLabel: {
    flex: 1,
    color: '#A0A0B2',
    fontSize: 12,
  },
  loginText: {
    marginTop: 30,
    textAlign: 'center',
    color: '#A0A0B2',
    fontSize: 14,
  },
  loginLink: {
    color: '#3D5CFF',
    fontWeight: 'bold',
  },
});
