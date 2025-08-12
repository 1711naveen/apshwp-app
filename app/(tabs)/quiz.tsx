import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import QuizDetail from '../components/QuizDetail';

interface Choice {
  id: number;
  label: string;
  status: string;
}

interface Question {
  id: number;
  name: string;
  description: string;
  image: string;
  answer_id: number;
  choices: Choice[];
}

interface Quiz {
  id: number;
  name: string;
  quize_image: string;
  description: string;
  status: string;
  questions: Question[];
}

interface ApiResponse {
  data: Quiz[];
  message: string;
}

export default function QuizScreen() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://apshwp.ap.gov.in/api/quizzes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: ApiResponse = await response.json();

        if (result.data && Array.isArray(result.data)) {
          // Filter only published quizzes
          const publishedQuizzes = result.data.filter(quiz => quiz.status === 'PUBLISHED');
          setQuizzes(publishedQuizzes);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQuizStart = (quiz: Quiz) => {
    console.log(`Starting quiz: ${quiz.name}`);
    if (quiz.questions && quiz.questions.length > 0) {
      setSelectedQuiz(quiz);
    } else {
      // Handle quiz with no questions
      console.log('This quiz has no questions available');
    }
  };

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    console.log(`Quiz completed! Score: ${score}/${totalQuestions}`);
    // Here you could save the score to your backend or local storage
  };

  const handleQuizClose = () => {
    setSelectedQuiz(null);
  };

  return (
    <>
      <ScrollView style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
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
            placeholder="Find Quiz"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons name="options-outline" size={20} color="#888" style={{ marginRight: 10 }} />
        </View>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3D5CFF" />
            <Text style={styles.loadingText}>Loading quizzes...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                setLoading(true);
                // Re-fetch data
              }}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              Available Quizzes ({filteredQuizzes.length})
              {searchQuery ? ` - Filtered by "${searchQuery}"` : ''}
            </Text>

            {filteredQuizzes.map((quiz) => (
              <TouchableOpacity key={quiz.id} style={styles.quizCard}>
                <View style={styles.quizCardHeader}>
                  {quiz.quize_image ? (
                    <Image
                      source={{ uri: `https://apshwp.ap.gov.in/public/storage/${quiz.quize_image}` }}
                      style={styles.quizImage}
                    />
                  ) : (
                    <View style={styles.quizImagePlaceholder}>
                      <Ionicons name="help-circle-outline" size={24} color="#3D5CFF" />
                    </View>
                  )}
                  <View style={styles.quizInfo}>
                    <Text style={styles.quizTitle}>{quiz.name}</Text>
                    <Text style={styles.quizQuestionCount}>
                      {quiz.questions?.length || 0} Questions
                    </Text>
                    <Text style={styles.quizStatus}>Status: {quiz.status}</Text>
                  </View>
                </View>



                <View style={styles.quizFooter}>
                  {/* <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyText}>
                      {quiz.questions?.length > 15 ? 'Advanced' :
                        quiz.questions?.length > 8 ? 'Intermediate' : 'Beginner'}
                    </Text>
                  </View> */}
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => handleQuizStart(quiz)}
                  >
                    <Text style={styles.startButtonText}>Start Quiz</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
            {filteredQuizzes.length === 0 && (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>
                  {searchQuery ? 'No quizzes found' : 'No quizzes available'}
                </Text>
                <Text style={styles.emptySubtext}>
                  {searchQuery ? 'Try a different search term' : 'Check back later for new quizzes'}
                </Text>
              </View>
            )}
          </>
        )}

      </ScrollView>
      {/* Quiz Detail Modal */}
      <Modal
        visible={selectedQuiz !== null}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        {selectedQuiz && (
          <QuizDetail
            quiz={selectedQuiz}
            onClose={handleQuizClose}
            onComplete={handleQuizComplete}
          />
        )}
      </Modal>
    </>
  );
}

const getScoreColor = (score: number) => {
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
  // Loading and Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3D5CFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Quiz Card Styles
  quizCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  quizCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quizImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  quizImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D0D26',
    marginBottom: 4,
  },
  quizQuestionCount: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  quizStatus: {
    fontSize: 12,
    color: '#3D5CFF',
  },
  quizDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  quizFooter: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  difficultyBadge: {
    backgroundColor: '#E8F1FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 12,
    color: '#3D5CFF',
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#3D5CFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 8,
  },
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});
