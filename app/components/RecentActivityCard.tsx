import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface Props {
  title: string;
  questionCount: string;
  score: string;
  scoreColor: string;
}

export default function RecentActivityCard({
  title,
  questionCount,
  score,
  scoreColor,
}: Props) {
  return (
    <View style={styles.card}>
      <Image
        source={require('../../assets/images/app-images/illustration_1.png')}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{questionCount}</Text>
      </View>
      <View
        style={[styles.scoreContainer, { borderColor: scoreColor }]}
      >
        <Text style={[styles.score, { color: scoreColor }]}>{score}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
  },
  image: { width: 50, height: 50, borderRadius: 8 },
  textContainer: { flex: 1, marginLeft: 10 },
  title: { fontSize: 14, color: '#1E1E1E', fontWeight: 'bold' },
  subtitle: { fontSize: 12, color: '#666' },
  scoreContainer: {
    borderWidth: 2,
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  score: { fontWeight: 'bold' },
});
