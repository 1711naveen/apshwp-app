import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import QuizBanner from '../../../components/QuizBanner';
import SearchBox from '../../../components/SearchBox';
import CategoryCard from '../../../components/CategoryCard';
import RecentActivityCard from '../../../components/RecentActivityCard';

export default function QuizHome() {
  const categories = [
    { title: 'HIV/ AIDS Prevention', img: require('../../../../assets/images/app-images/illustration_1.png'), active: true },
    { title: 'Substance Abuse', img: require('../../../../assets/images/app-images/illustration_2.png') },
    { title: 'Mental Health', img: require('../../../../assets/images/app-images/illustration_3.png') },
    { title: 'NCDs', img: require('../../../../assets/images/app-images/illustration_1.png') },
    { title: 'Child Rights', img: require('../../../../assets/images/app-images/illustration_2.png') },
  ];

  const activities = [
    { title: 'HIV/ AIDS Prevention', questionCount: '30 Question', score: '26/30', scoreColor: '#FF3D71' },
    { title: 'HIV/ AIDS Prevention', questionCount: '30 Question', score: '20/30', scoreColor: '#F5C118' },
    { title: 'HIV/ AIDS Prevention', questionCount: '30 Question', score: '25/30', scoreColor: '#3D5CFF' },
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

      <QuizBanner />

      <SearchBox />

      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        {categories.map((cat, index) => (
          <CategoryCard
            key={index}
            title={cat.title}
            image={cat.img}
            isActive={cat.active}
          />
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {activities.map((act, index) => (
        <RecentActivityCard
          key={index}
          title={act.title}
          questionCount={act.questionCount}
          score={act.score}
          scoreColor={act.scoreColor}
        />
      ))}
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
});
