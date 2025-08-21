import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonLayout from '../../components/CommonLayout';
import { useAnalytics } from '../../hooks/useAnalytics';

const { width } = Dimensions.get('window');

interface ApiCourse {
  id: number;
  name: string;
  description: string;
  url: string;
  image_path: string;
  status: number;
  created_at: string;
  updated_at: string;
}

type Course = {
  id: string;
  title: string;
  headerImage: any;
  videoUrl: string;
  topics: string[];
};

export default function CourseDetail() {
  const { id, courseData } = useLocalSearchParams();
  const router = useRouter();
  const [showVideo, setShowVideo] = useState(false);
  const [course, setCourse] = useState<ApiCourse | null>(null);
  
  // Initialize analytics hook
  const { trackEvent, trackCourseComplete } = useAnalytics();

  // Parse course data from params or use fallback
  useEffect(() => {
    if (courseData && typeof courseData === 'string') {
      try {
        const parsedCourse = JSON.parse(courseData);
        setCourse(parsedCourse);
      } catch (error) {
        console.error('Error parsing course data:', error);
        // Fallback to legacy course data
        setLegacyCourse();
      }
    } else {
      // Fallback to legacy course data
      setLegacyCourse();
    }
  }, [id, courseData]);

  const setLegacyCourse = () => {
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
    const legacyCourse = safeId ? courses[safeId] : undefined;
    
    if (legacyCourse) {
      // Convert legacy course to API format
      const apiCourse: ApiCourse = {
        id: parseInt(legacyCourse.id),
        name: legacyCourse.title,
        description: `Learn about ${legacyCourse.title}`,
        url: legacyCourse.videoUrl,
        image_path: '', // Will use local image
        status: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setCourse(apiCourse);
    }
  };

  // Handle PDF download/view
  const handleViewPdf = async () => {
    if (course?.url && course.url !== 'https://apshwp.ap.gov.in/storage/') {
      try {
        await trackEvent('course_pdf_opened', {
          course_id: course.id,
          course_name: course.name,
        });
        console.log('course url', course.url);
        await WebBrowser.openBrowserAsync(course.url);
      } catch (error) {
        Alert.alert('Error', 'Could not open the course material');
      }
    } else {
      Alert.alert('Coming Soon', 'This course material will be available soon');
    }
  };

  // Handle quiz navigation
  const handleQuizStart = async () => {
    await trackEvent('quiz_start_from_course', {
      course_id: course?.id,
      course_name: course?.name,
    });
    router.push(`/course/quiz/${course?.id}`);
  };

  if (!course) {
    return (
      <CommonLayout title="Course Not Found" showBackButton={true}>
        <View style={styles.center}>
          <Text>Course not found.</Text>
        </View>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout title={course.name} showBackButton={true}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.headerContainer}>
          <Image
            source={
              course.image_path && course.image_path !== ''
                ? { uri: course.image_path }
                : require('../../../assets/images/app-images/illustration_1.png')
            }
            style={styles.headerImage}
            resizeMode="cover"
          />

          {/* Curved white overlay */}
          <View style={styles.overlayPanel}>
            <Text style={styles.courseTitle}>
              {course.name}
            </Text>

            {/* Course Description */}
            {course.description && (
              <Text style={styles.courseDescription}>
                {course.description}
              </Text>
            )}

            {/* Course Actions */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleViewPdf}
              >
                <Ionicons name="document-text-outline" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>View Course Material</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleQuizStart}
              >
                <Ionicons name="help-circle-outline" size={20} color="#3D5CFF" />
                <Text style={styles.secondaryButtonText}>Take Quiz</Text>
              </TouchableOpacity>
            </View>

            {/* Course Status */}
            <View style={styles.statusSection}>
              <View style={styles.statusRow}>
                <View style={[
                  styles.statusDot, 
                  { backgroundColor: course.status === 2 ? '#4CAF50' : '#FF9800' }
                ]} />
                <Text style={styles.statusText}>
                  Status: {course.status === 2 ? 'Available' : 'Coming Soon'}
                </Text>
              </View>
              
              <Text style={styles.lastUpdated}>
                Last updated: {new Date(course.updated_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </CommonLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 12,
    lineHeight: 24,
  },
  courseDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
  },
  
  // Action buttons
  actionButtons: {
    marginBottom: 30,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3D5CFF',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3D5CFF',
  },
  secondaryButtonText: {
    color: '#3D5CFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Status section
  statusSection: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#6B7280',
  },

  // Legacy styles (kept for compatibility)
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
