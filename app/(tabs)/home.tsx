import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import EModuleCard from "../components/EModuleCard";
import Flowchart from "../components/Flowchart";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const { width } = Dimensions.get("window");

const modules = [
  {
    id: "1",
    title: "Metabolic Health (NCDs Prevention)",
    image: require("../../assets/images/app-images/illustration_1.png"),
  },
  {
    id: "2",
    title: "Road Safety",
    image: require("../../assets/images/app-images/illustration_2.png"),
  },
  {
    id: "3",
    title: "Heart Health Awareness",
    image: require("../../assets/images/app-images/illustration_3.png"),
  },
];

export default function Home() {
  const [name, setName] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setName(user.name);
      }
    };
    loadUser();
  }, []);
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, {name}</Text>
          <Text style={styles.subGreeting}>Let’s start learning</Text>
        </View>
        {/* Optional profile picture */}
        <Image
          source={require("../../assets/images/app-images/Avatar.png")}
          style={styles.avatar}
        />
      </View>

      {/* Flowchart Box */}
      <View style={styles.flowchartBox}>
        <Text style={styles.flowchartTitle}>Calling All Adolescents and Youth!</Text>
        <Flowchart />
      </View>

      {/* E-Module Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>E-Module</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Scroll of E-Modules */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moduleScroll}
      >
        {modules.map((mod) => (
          <EModuleCard
            key={mod.id}
            title={mod.title}
            image={mod.image}
            onPress={() => {
              console.log("Pressed:", mod.title);
            }}
          />
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F5",
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0D0D26",
  },
  subGreeting: {
    fontSize: 14,
    color: "#A0A0B2",
    marginTop: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ddd",
  },
  flowchartBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginTop: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  flowchartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  flowchartImage: {
    width: "100%",
    height: 180,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0D0D26",
  },
  viewAll: {
    color: "#3D5CFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  moduleScroll: {
    paddingBottom: 20,
  },
});
