import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import CommonLayout from '../../components/CommonLayout';

export default function CourseScreen() {
  const router = useRouter();

  return (
    <CommonLayout title="E-Modules">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
    </CommonLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
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
