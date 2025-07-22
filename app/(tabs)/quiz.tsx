import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function QuizScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Quiz</Text>
        <Image
          source={{ uri: 'https://i.pravatar.cc/100?img=64' }}
          style={styles.profile}
        />
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Test Your Knowledge with Quizzes</Text>
        <Text style={styles.bannerSubtitle}>
          You’re just looking for a playful way to learn new facts.
        </Text>
        <TouchableOpacity style={styles.playButton}>
          <Text style={styles.playText}>Play Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color="#888" style={{ marginLeft: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Find Course"
          placeholderTextColor="#aaa"
        />
        <Ionicons name="options-outline" size={20} color="#888" style={{ marginRight: 10 }} />
      </View>

      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {['HIV/ AIDS Prevention', 'Substance Abuse', 'Mental Health', 'NCDs', 'Child Rights'].map((title, index) => (
          <View key={index} style={styles.categoryCard}>
            <Image
              source={{ uri: 'https://via.placeholder.com/64x64.png?text=Icon' }}
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>{title}</Text>
          </View>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Recent Activity</Text>
      {[26, 20, 25].map((score, i) => (
        <View key={i} style={styles.activityCard}>
          <Image
            source={{ uri: 'https://via.placeholder.com/48.png?text=Quiz' }}
            style={styles.activityImage}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.activityTitle}>HIV/ AIDS Prevention</Text>
            <Text style={styles.activitySub}>30 Question</Text>
          </View>
          <View style={[styles.scoreCircle, { backgroundColor: getScoreColor(score) }]}>
            <Text style={styles.scoreText}>{score}/30</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const getScoreColor = (score:number) => {
  if (score >= 25) return '#00BCD4';
  if (score >= 20) return '#FFEB3B';
  return '#F44336';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D0D26',
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  banner: {
    backgroundColor: '#001F6D',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bannerSubtitle: {
    color: '#ddd',
    fontSize: 13,
    marginBottom: 16,
  },
  playButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  playText: {
    fontWeight: 'bold',
    color: '#001F6D',
  },
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryCard: {
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 10,
    borderColor: '#3D5CFF',
    borderWidth: 1,
  },
  categoryImage: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#0D0D26',
    textAlign: 'center',
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activityImage: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D0D26',
  },
  activitySub: {
    fontSize: 12,
    color: '#A0A0B2',
  },
  scoreCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontWeight: 'bold',
    color: '#fff',
  },
});
