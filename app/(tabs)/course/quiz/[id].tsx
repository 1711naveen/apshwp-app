import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { BackHandler, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function QuizDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Example bank of questions
  const questionBank = [
    {
      text: 'What does HIV stand for?',
      options: [
        'Human Infection Virus',
        'Human Immunodeficiency Virus',
        'Human Immune Virus',
        'Human Injecting Virus',
      ],
      answerIndex: 1,
    },
    {
      text: 'Which organ does HIV mainly attack?',
      options: ['Liver', 'Brain', 'Immune System', 'Kidneys'],
      answerIndex: 2,
    },
    {
      text: 'What does NCD stand for?',
      options: ['Non-Communicable Disease', 'New Chronic Disease', 'Nerve Cell Disorder', 'None'],
      answerIndex: 0,
    },
    {
      text: 'Which is NOT an NCD?',
      options: ['Diabetes', 'Hypertension', 'Tuberculosis', 'Cancer'],
      answerIndex: 2,
    },
    {
      text: 'Which practice helps road safety?',
      options: ['Overspeeding', 'Drunk driving', 'Wearing seatbelts', 'Using phones while driving'],
      answerIndex: 2,
    },
    {
      text: 'Substance abuse can cause?',
      options: ['Good health', 'Improved memory', 'Mental disorders', 'Better sleep'],
      answerIndex: 2,
    },
    {
      text: 'Healthy weight reduces risk of?',
      options: ['NCDs', 'Air pollution', 'Accidents', 'Allergies'],
      answerIndex: 0,
    },
    {
      text: 'Child rights include?',
      options: ['Education', 'Nutrition', 'Safety', 'All of these'],
      answerIndex: 3,
    },
    {
      text: 'Mental health includes?',
      options: ['Emotional wellbeing', 'Physical pain only', 'None', 'Smoking'],
      answerIndex: 0,
    },
    {
      text: 'Which is a healthy habit?',
      options: ['Skipping meals', 'Exercising regularly', 'Smoking', 'Drinking alcohol'],
      answerIndex: 1,
    },
  ];

  // ✅ Shuffle ONCE using useMemo
  const shuffledQuestions = useMemo(() => {
    return [...questionBank].sort(() => 0.5 - Math.random()).slice(0, 10);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(10).fill(null));

  // Disable back button/gesture
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Return true to prevent default back action
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const currentQuestion = shuffledQuestions[currentIndex];

  // Load the saved answer for current question
  useState(() => {
    setSelectedIndex(userAnswers[currentIndex]);
  });

  const handlePrevious = () => {
    if (currentIndex > 0) {
      // Save current answer before going back
      const newAnswers = [...userAnswers];
      newAnswers[currentIndex] = selectedIndex;
      setUserAnswers(newAnswers);
      
      setCurrentIndex(currentIndex - 1);
      setSelectedIndex(userAnswers[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    // Save current answer
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = selectedIndex;
    setUserAnswers(newAnswers);

    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedIndex(newAnswers[currentIndex + 1]);
    } else {
      // Calculate final score
      let finalScore = 0;
      shuffledQuestions.forEach((question, index) => {
        if (newAnswers[index] === question.answerIndex) {
          finalScore++;
        }
      });
      
      // Navigate to result page
      router.push({
        pathname: '/course/quiz/result',
        params: {
          score: `${finalScore}`,
          total: '10',
        },
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Quiz on {id}</Text>

      <View style={styles.card}>
        <Text style={styles.questionNumber}>
          Question: {currentIndex + 1}/10
        </Text>

        <Text style={styles.questionText}>
          {currentQuestion.text}
        </Text>

        {currentQuestion.options.map((opt, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedIndex(index)}
            style={[
              styles.optionBox,
              selectedIndex === index && styles.selectedOptionBox,
            ]}
          >
            <Text
              style={[
                styles.optionText,
                selectedIndex === index && styles.selectedOptionText,
              ]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.prevButton,
              currentIndex === 0 && { backgroundColor: '#ccc' },
            ]}
            onPress={handlePrevious}
            disabled={currentIndex === 0}
          >
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.nextButton,
              selectedIndex === null && { backgroundColor: '#ccc' },
            ]}
            onPress={handleNext}
            disabled={selectedIndex === null}
          >
            <Text style={styles.buttonText}>
              {currentIndex === shuffledQuestions.length - 1 ? 'See Result' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D0D26',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  questionNumber: {
    fontSize: 12,
    color: '#3D5CFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    color: '#1E1E1E',
    fontWeight: '600',
    marginBottom: 20,
  },
  optionBox: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: '#F7F7F7',
  },
  selectedOptionBox: {
    backgroundColor: '#3D5CFF',
    borderColor: '#3D5CFF',
  },
  optionText: {
    fontSize: 14,
    color: '#1E1E1E',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  prevButton: {
    backgroundColor: '#6C757D',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
  },
  nextButton: {
    backgroundColor: '#3D5CFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
