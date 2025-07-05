import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SuccessScreen() {
  const handleDone = () => {
    // Example: Go back to home or login screen
    router.replace('/');
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalBox}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={32} color="#fff" />
        </View>

        <Text style={styles.title}>Success</Text>
        <Text style={styles.subtitle}>
          Congratulations, you have completed your registration!
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleDone}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 27, 45, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3D5CFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    color: '#0D0D26',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    color: '#A0A0B2',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#3D5CFF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
