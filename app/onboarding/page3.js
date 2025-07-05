import { router } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Page3() {
  const handleSignUp = () => {
    router.replace('/auth/signup');
  };

  const handleLogin = () => {
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      {/* Illustration */}
      <Image
        source={require('../../assets/images/app-images/illustration_3.png')}
        style={styles.illustration}
      />

      {/* Text Content */}
      <Text style={styles.title}>Create your own study plan</Text>
      <Text style={styles.subtitle}>
        Study according to the study plan, make study more motivated
      </Text>

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.activeDot} />
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpText}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  illustration: {
    width: width * 0.7,
    height: width * 0.7,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D0D26',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#A0A0B2',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  dot: {
    backgroundColor: 'rgba(61, 92, 255, 0.2)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#3D5CFF',
    width: 24,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
  },
  signUpButton: {
    backgroundColor: '#3D5CFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  signUpText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loginButton: {
    borderWidth: 1,
    borderColor: '#3D5CFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  loginText: {
    color: '#3D5CFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
