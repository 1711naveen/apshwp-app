import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, Button } from "react-native";

export default function Home() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Hi, Kristin</Text>
      <Text style={styles.subtitle}>Let’s start learning</Text>

      <View style={styles.progressContainer}>
        <Text>Learned today</Text>
        <Text style={styles.timeText}>46 min / 60 min</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What do you want to learn today?</Text>
        <Button title="Get Started" onPress={() => {}} />
      </View>

      <View style={styles.learningPlan}>
        <Text style={styles.sectionTitle}>Learning Plan</Text>
        <Text>Packaging Design 40/48</Text>
        <Text>Product Design 6/24</Text>
      </View>

      <View style={styles.meetup}>
        <Text style={styles.sectionTitle}>Meetup</Text>
        <Text>Off-line exchange of learning experiences</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8,
  },
  timeText: {
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#cce7ff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  learningPlan: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  meetup: {
    backgroundColor: "#e6ccff",
    padding: 20,
    borderRadius: 10,
  },
});
