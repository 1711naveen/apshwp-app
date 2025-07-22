import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function QuizHome() {
  const router = useRouter();

  const categories = [
    { id: 'hiv', title: 'HIV/ AIDS Prevention', img: require('../../../../assets/images/app-images/illustration_1.png'), active: true },
    { id: 'substance', title: 'Substance Abuse', img: require('../../../../assets/images/app-images/illustration_2.png') },
    { id: 'mental', title: 'Mental Health', img: require('../../../../assets/images/app-images/illustration_3.png') },
    { id: 'ncds', title: 'NCDs', img: require('../../../../assets/images/app-images/illustration_1.png') },
    { id: 'childrights', title: 'Child Rights', img: require('../../../../assets/images/app-images/illustration_2.png') },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quiz</Text>
        <Image
          source={require('../../../../assets/images/app-images/illustration_3.png')}
          style={styles.avatar}
        />
      </View>

      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        {categories.map((cat, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(`/course/quiz/${cat.id}`)}
            style={styles.card}
          >
            <Image source={cat.img} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{cat.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1E1E1E' },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E1E1E',
    marginVertical: 10,
  },
  categories: { marginBottom: 20 },
  card: {
    marginRight: 12,
    alignItems: 'center',
    width: 120,
  },
  cardImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#1E1E1E',
    fontWeight: 'bold',
  },
});
