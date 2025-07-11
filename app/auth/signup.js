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
  View,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSignUp = () => {
    if (!fullName || !gender || !age || !phone || !password || !state || !district) {
      Alert.alert('Please fill all required fields.');
      return;
    }
    if (!agreeTerms) {
      Alert.alert('Please agree to the terms and conditions');
      return;
    }
    Alert.alert('Sign up successful!');
    // Implement API call here
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.topBox}>
            <Text style={styles.title}>Register</Text>
            <Text style={styles.subtitle}>
              Enter your details below to create an account
            </Text>
          </View>

          <View style={styles.formBox}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter full name"
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.label}>Gender</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={gender}
                onValueChange={(value) => setGender(value)}
              >
                <Picker.Item label="-- Select Gender --" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            <Text style={styles.label}>Age</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Password</Text>
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

            <Text style={styles.label}>Email (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Text style={styles.label}>State</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={state}
                onValueChange={(value) => setState(value)}
              >
                <Picker.Item label="-- Select State --" value="" />
                <Picker.Item label="Maharashtra" value="Maharashtra" />
                <Picker.Item label="Uttar Pradesh" value="Uttar Pradesh" />
                <Picker.Item label="Tamil Nadu" value="Tamil Nadu" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            <Text style={styles.label}>District</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={district}
                onValueChange={(value) => setDistrict(value)}
              >
                <Picker.Item label="-- Select District --" value="" />
                <Picker.Item label="Mumbai" value="Mumbai" />
                <Picker.Item label="Pune" value="Pune" />
                <Picker.Item label="Lucknow" value="Lucknow" />
                <Picker.Item label="Chennai" value="Chennai" />
              </Picker>
            </View>

            <Text style={styles.label}>Referral Code (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter referral code"
              value={referralCode}
              onChangeText={setReferralCode}
            />

            <View style={styles.checkboxRow}>
              <Checkbox
                value={agreeTerms}
                onValueChange={setAgreeTerms}
                color={agreeTerms ? '#3D5CFF' : undefined}
              />
              <Text style={styles.checkboxLabel}>
                {' '}
                I consent to the use of my name, photo, and achievements on the
                official online Hall of Fame and other authorized platforms in
                recognition of my contributions and accomplishments.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSignUp}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Link href="/auth/login" style={styles.loginLink}>
                Log in
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F5',
  },
  scrollContainer: {
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
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
    alignItems: 'flex-start',
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
