import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function CourseScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>E-Modules</Text>

      <TouchableOpacity
        onPress={() => router.push('/course/1')}
        style={styles.card}
      >
        <Image
          source={require('../../../assets/images/app-images/illustration_1.png')}
          style={styles.image}
        />
        <Text style={styles.title}>
          E-Module on Metabolic Health (NCDs Prevention)
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/course/2')}
        style={styles.card}
      >
        <Image
          source={require('../../../assets/images/app-images/illustration_1.png')}
          style={styles.image}
        />
        <Text style={styles.title}>Road Safety Module</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/course/3')}
        style={styles.card}
      >
        <Image
          source={require('../../../assets/images/app-images/illustration_1.png')}
          style={styles.image}
        />
        <Text style={styles.title}>Heart Health Awareness</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    color: '#0D0D26',
    fontWeight: '500',
  },
});
