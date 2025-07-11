import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";

export default function FlowchartStep({ icon, label }) {
  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.icon} resizeMode="contain" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 80,
    marginVertical: 4,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 6,
  },
  label: {
    fontSize: 10,
    textAlign: "center",
    color: "#333",
  },
});
