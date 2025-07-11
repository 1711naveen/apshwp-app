import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      {/* Government of India Emblem */}
      <Image
        source={require('../../assets/images/app-images/government-of-india.png')}
        style={styles.govEmblem}
        resizeMode="contain"
      />
      <Text style={styles.govText}>Government Of India</Text>

      {/* Andhra Pradesh State Emblem */}
      <Image
        source={require('../../assets/images/app-images/Sathi-logo-1.png')}
        style={styles.apEmblem}
        resizeMode="contain"
      />

      {/* Partner Section */}
      <View style={styles.partnersContainer}>
        <View style={styles.divider} />
        <Text style={styles.partnersText}>Partners Logo</Text>
        <View style={styles.divider} />
      </View>

      {/* Partner Logos */}
      <View style={styles.partnerLogosRow}>
        <Image
          source={require('../../assets/images/app-images/pepfar.png')}
          style={styles.partnerLogo}
          resizeMode="contain"
        />
        <Image
          source={require('../../assets/images/app-images/unicef-logo.png')}
          style={styles.partnerLogo}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

export default SplashScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 40,
  },
  govEmblem: {
    width: 60,
    height: 60,
  },
  govText: {
    marginTop: 5,
    fontSize: 12,
    color: '#000',
  },
  apEmblem: {
    width: 240,
    height: 240,
  },
  partnersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#000',
    marginHorizontal: 10,
  },
  partnersText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  partnerLogosRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    marginTop: 20,
  },
  partnerLogo: {
    width: 60,
    height: 60,
  },
});
