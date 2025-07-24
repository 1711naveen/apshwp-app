import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

export default function Page1() {
  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={() => {}}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Illustration */}
      <Image
        source={require('../../assets/images/app-images/e-learning.png')}
        style={styles.illustration}
      />

      {/* Heading */}
      <Text style={styles.title}>E-Learning</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Explore Our Newly Launched{'\n'}
        E-Learning Zone And Get Certified{'\n'}
        Today In Various Modules
      </Text>

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        <View style={styles.activeDot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
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
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  skipText: {
    color: '#A0A0B2',
    fontSize: 14,
  },
  illustration: {
    width: width * 0.75,
    height: width * 0.75,
    resizeMode: 'contain',
    marginTop: 60,
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
    lineHeight: 22,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 40,
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
});
