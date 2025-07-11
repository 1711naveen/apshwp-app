import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function QuizDetailScreen() {
  const router = useRouter();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const question = {
    number: 1,
    total: 30,
    text: 'What does HIV stand for?',
    options: [
      'Human Infection Virus',
      'Human Immunodeficiency Virus',
      'Human Immune Virus',
      'Human Injecting Virus',
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleBlock}>
          <Text style={styles.headerTitle}>
            Quiz on HIV/ AIDS Prevention
          </Text>
          <Text style={styles.questionCount}>
            {question.total} Question
          </Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.quitText}>Quit</Text>
        </TouchableOpacity>
      </View>

      {/* Quiz Card */}
      <View style={styles.card}>
        <Text style={styles.questionNumber}>
          Question: {question.number}/{question.total}
        </Text>

        <Text style={styles.questionText}>
          {question.text}
        </Text>

        {question.options.map((opt, index) => (
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

        <TouchableOpacity>
          <Text style={styles.seeResult}>See Result ↓</Text>
        </TouchableOpacity>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.prevButton}>
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {
    fontSize: 24,
    color: '#1E1E1E',
  },
  headerTitleBlock: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E1E1E',
  },
  questionCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  quitText: {
    color: '#FF3D71',
    fontWeight: 'bold',
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
    marginBottom: 30,
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
  seeResult: {
    color: '#3D5CFF',
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 10,
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prevButton: {
    backgroundColor: '#3D5CFF',
    flex: 1,
    marginRight: 10,
    paddingVertical: 12,
    borderRadius: 8,
  },
  nextButton: {
    backgroundColor: '#3D5CFF',
    flex: 1,
    marginLeft: 10,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
