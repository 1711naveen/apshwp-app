import { Link } from "expo-router";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function Splash2() {
  return (
    <View style={styles.container}>
      {/* Andhra Pradesh State Emblem */}
      <Image
        source={require("../../assets/images/app-images/Sathi-logo-1.png")}
        style={styles.apEmblem}
        resizeMode="contain"
      />

      {/* Title */}
      <Text style={styles.title}>
        School Health and{"\n"}Wellness Programme
      </Text>

      {/* Main Photo */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/images/app-images/matri-splesh.png")}
          style={styles.mainPhoto}
          resizeMode="cover"
        />
      </View>

      {/* Partners Section */}
      <View style={styles.partnersWrapper}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 80, // << add bigger space for dots
  },
  apEmblem: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginTop: 20,
  },
  imageContainer: {
    width: width * 0.9,
    height: width * 0.9,
    borderTopLeftRadius: width * 0.45,
    borderTopRightRadius: width * 0.45,
    overflow: "hidden",
    backgroundColor: "#eee",
    marginTop: 30,
  },
  mainPhoto: {
    width: "100%",
    height: "100%",
  },
  partnersWrapper: {
    marginTop: 30,
    alignItems: "center",
  },
  partnersContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#000",
    marginHorizontal: 10,
  },
  partnersText: {
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
  partnerLogosRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 30,
    marginTop: 10,
  },
  partnerLogo: {
    width: 60,
    height: 60,
  },
});
