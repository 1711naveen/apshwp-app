import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';

export default function PhoneLoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('+63 ');

  const handlePressDigit = (digit) => {
    setPhoneNumber((prev) => prev + digit);
  };

  const handleBackspace = () => {
    setPhoneNumber((prev) => {
      if (prev.length > 0) {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  const handleContinue = () => {
    Alert.alert('Continue pressed!', `Phone: ${phoneNumber}`);
    // Navigate or send OTP etc.
    // router.push('/auth/verify-otp');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBox}>
        <TouchableOpacity style={styles.iconButton}>
          {/* Placeholder for any icon (e.g. close or back) */}
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/753/753345.png',
            }}
            style={{ width: 24, height: 24, tintColor: '#0D0D26' }}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Continue with Phone</Text>

        <Image
          source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/3917/3917051.png',
          }}
          style={styles.phoneImage}
        />
      </View>

      <View style={styles.formBox}>
        <Text style={styles.label}>Enter Your Phone Number</Text>

        <View style={styles.phoneRow}>
          <Text style={styles.phoneText}>{phoneNumber}</Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.keypad}>
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['0'],
          ].map((row, rowIndex) => (
            <View style={styles.keypadRow} key={rowIndex}>
              {row.map((digit) => (
                <TouchableOpacity
                  key={digit}
                  onPress={() => handlePressDigit(digit)}
                  style={styles.keypadButton}
                >
                  <Text style={styles.keypadDigit}>{digit}</Text>
                </TouchableOpacity>
              ))}

              {rowIndex === 3 && (
                <TouchableOpacity
                  onPress={handleBackspace}
                  style={styles.keypadButton}
                >
                  <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/512/109/109602.png',
                    }}
                    style={styles.backspaceIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
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
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  iconButton: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D0D26',
    marginBottom: 20,
  },
  phoneImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
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
    color: '#A0A0B2',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  phoneText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D0D26',
  },
  continueButton: {
    backgroundColor: '#3D5CFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  continueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  keypad: {
    flex: 1,
    justifyContent: 'center',
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  keypadButton: {
    backgroundColor: '#F2F2F5',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadDigit: {
    fontSize: 24,
    color: '#0D0D26',
    fontWeight: 'bold',
  },
  backspaceIcon: {
    width: 28,
    height: 28,
    tintColor: '#0D0D26',
  },
});
