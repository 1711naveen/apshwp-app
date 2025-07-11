import React from "react";
import { Text, StyleSheet, View } from "react-native";

export function ArrowRight() {
  return <Text style={styles.arrow}>→</Text>;
}

export function ArrowDown() {
  return <Text style={styles.arrow}>↓</Text>;
}

export function ArrowLeft() {
  return <Text style={styles.arrow}>←</Text>;
}

const styles = StyleSheet.create({
  arrow: {
    fontSize: 18,
    marginHorizontal: 6,
    color: "#3D5CFF",
    fontWeight: "bold",
  },
});
