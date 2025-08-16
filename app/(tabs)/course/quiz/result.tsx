import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CommonLayout from '../../../components/CommonLayout';
// import AnalyticsService from '../../../services/AnalyticsService';

export default function QuizResult() {
  const router = useRouter();
  const { score, total } = useLocalSearchParams();

  // Track result view
  useEffect(() => {
    // AnalyticsService.logScreenView('QuizResult', 'ResultScreen');
    // AnalyticsService.logEvent('quiz_result_view', {
    //   score: Number(score),
    //   total: Number(total),
    //   percentage: (Number(score) / Number(total)) * 100
    // });
  }, [score, total]);

  const handleShare = () => {
    // AnalyticsService.logShare('quiz_result', `quiz_score_${score}_${total}`);
    // Add your share functionality here
  };

  return (
    <CommonLayout title="Quiz Result">
      <View style={styles.container}>
        <View style={styles.circle}>
          <Text style={styles.scoreLabel}>Your Score</Text>
          <Text style={styles.scoreValue}>{score}/{total}</Text>
        </View>

        <Text style={styles.congrats}>Congratulation</Text>
        <Text style={styles.subtext}>Great job, Student Name! You Did It</Text>

        <TouchableOpacity style={styles.button} onPress={handleShare}>
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // AnalyticsService.logEvent('quiz_result_back_home');
            router.push('/course');
          }}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </CommonLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#3D5CFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 5,
    borderColor: '#A0C4FF',
  },
  scoreLabel: {
    color: '#fff',
    fontSize: 14,
  },
  scoreValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  congrats: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3D5CFF',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#1E1E1E',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3D5CFF',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 50,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
