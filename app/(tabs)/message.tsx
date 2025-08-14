import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CommonLayout from "../components/CommonLayout";

export default function Message() {
  return (
    <CommonLayout title="Messages">
      <View style={styles.container}>
        <Text style={styles.text}>Message Screen</Text>
        <Text style={styles.subtitle}>Messages and notifications will be displayed here.</Text>
      </View>
    </CommonLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D0D26',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
