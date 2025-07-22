import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type Course = {
  id: string;
  title: string;
  headerImage: any;
  videoUrl: string;
  topics: string[];
};

export default function CourseDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const courses: Record<string, Course> = {
    "1": {
      id: "1",
      title: 'Metabolic Health (NCDs Prevention)',
      headerImage: require('../../../assets/images/app-images/illustration_1.png'),
      videoUrl: 'https://www.youtube.com/embed/O0lBFHqPZ4Y',
      topics: [
        'Introduction to Metabolic health',
        'What is Metabolic Dysfunction?',
        'Improving Metabolic Health',
        'Dangers of Substance Abuse',
      ],
    },
    "2": {
      id: "2",
      title: 'Road Safety Module',
      headerImage: require('../../../assets/images/app-images/illustration_2.png'),
      videoUrl: 'https://www.youtube.com/embed/K8aBf9hG2oA',
      topics: [
        'Introduction to Road Safety',
        'Safe Driving Practices',
        'Road Signs and Rules',
        'Emergency Handling',
      ],
    },
    "3": {
      id: "3",
      title: 'Heart Health Awareness',
      headerImage: require('../../../assets/images/app-images/illustration_3.png'),
      videoUrl: 'https://www.youtube.com/embed/Ym5FVLrG3jw',
      topics: [
        'Heart Anatomy Basics',
        'Risk Factors for Heart Disease',
        'Healthy Lifestyle Tips',
        'Preventive Measures',
      ],
    },
  };

  const safeId = Array.isArray(id) ? id[0] : id;
  const course = safeId ? courses[safeId] : undefined;

  const [showVideo, setShowVideo] = useState(false);

  if (!course) {
    return (
      <View style={styles.center}>
        <Text>Course not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll}>
      {/* Header Image */}
      <View style={styles.headerContainer}>
        <Image
          source={course.headerImage}
          style={styles.headerImage}
          resizeMode="cover"
        />

        {/* Curved white overlay */}
        <View style={styles.overlayPanel}>
          <Text style={styles.courseTitle}>
            {course.title}
          </Text>

          {/* Topics list */}
          {course.topics.map((topic, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.topicRow}
                onPress={() => {
                  if (index === 0) {
                    setShowVideo(!showVideo);
                  } else {
                    console.log(`Clicked topic ${index + 1}: ${topic}`);
                  }
                }}
              >
                <Text style={styles.topicNumber}>
                  {String(index + 1).padStart(2, '0')}
                </Text>
                <Text style={styles.topicText}>{topic}</Text>

                {/* Play button */}
                <View style={styles.playButton}>
                  <Ionicons name="play" size={18} color="#fff" />
                </View>
              </TouchableOpacity>

              {/* Show video after first topic */}
              {index === 0 && showVideo && (
                <View style={styles.videoContainer}>
                  <WebView
                    source={{ uri: course.videoUrl }}
                    style={styles.video}
                  />
                </View>
              )}
            </View>
          ))}

          {/* QUIZ BUTTON */}
          <TouchableOpacity
            style={styles.quizButton}
            onPress={() => router.push(`/course/quiz/${course.id}`)}
          >
            <Text style={styles.quizButtonText}>Start Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    position: 'relative',
    backgroundColor: '#fff',
  },
  headerImage: {
    width: width,
    height: 220,
  },
  overlayPanel: {
    backgroundColor: '#fff',
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 50,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D0D26',
    marginBottom: 20,
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  topicNumber: {
    color: '#A0A0B2',
    fontWeight: 'bold',
    width: 30,
    fontSize: 16,
  },
  topicText: {
    flex: 1,
    color: '#0D0D26',
    fontSize: 14,
  },
  playButton: {
    backgroundColor: '#3D5CFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    height: 200,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  quizButton: {
    marginTop: 30,
    backgroundColor: '#3D5CFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  quizButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
