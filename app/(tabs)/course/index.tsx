import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'; 
import CommonLayout from '../../components/CommonLayout';
import { useAnalytics } from '../../hooks/useAnalytics';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

interface Course {
  id: number;
  name: string;
  description: string;
  url: string;
  image_path: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export default function CourseScreen() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Initialize analytics hook
  const { trackEvent, trackCourseStart } = useAnalytics();

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      const response = await fetch('https://apshwp.ap.gov.in/api/courses');
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.data);
        await trackEvent('courses_loaded', { course_count: data.data.length });
      } else {
        Alert.alert('Error', 'Failed to load courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      Alert.alert('Network Error', 'Please check your internet connection and try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchCourses();
  };

  // Handle course selection
  const handleCoursePress = async (course: Course) => {
    await trackCourseStart(course.id.toString(), course.name);

    await trackEvent('course_card_pressed', {
      course_id: course.id,
      course_name: course.name,
    });

    
    // Navigate to course detail with course data
    router.push({
      pathname: '/course/[id]',
      params: { 
        id: course.id.toString(),
        courseData: JSON.stringify(course)
      }
    });
  };

  // Loading state
  if (loading) {
    return (
      <CommonLayout title="E-Modules">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3D5CFF" />
          <Text style={styles.loadingText}>Loading courses...</Text>
        </View>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout title="E-Modules">
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {courses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No courses available</Text>
          </View>
        ) : (
          courses.map((course, index) => (
            <TouchableOpacity
              key={course.id}
              onPress={() => handleCoursePress(course)}
              style={styles.courseCard}
            >
              <View style={styles.cardImageContainer}>
                <Image
                  source={{ uri: course.image_path }}
                  style={styles.courseImage}
                />
                <View style={styles.gradientOverlay} />
                
                {/* Course Badge */}
                {/* <View style={styles.courseBadge}>
                  <Text style={styles.courseBadgeText}>E-Module</Text>
                </View> */}
              </View>

              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle} numberOfLines={2}>
                  {course.name}
                </Text>
                
                {course.description ? (
                  <Text style={styles.courseDescription} numberOfLines={2}>
                    {course.description}
                  </Text>
                ) : null}

                <View style={styles.courseFooter}>
                  <View style={styles.statusContainer}>
                    <View style={[
                      styles.statusDot, 
                      { backgroundColor: course.status === 2 ? '#4CAF50' : '#FF9800' }
                    ]} />
                    <Text style={styles.statusText}>
                      {course.status === 2 ? 'Available' : 'Coming Soon'}
                    </Text>
                  </View>

                  <View style={styles.playButtonSmall}>
                    <Text style={styles.playButtonText}>Start Learning</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </CommonLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 16,
  },
  
  // Loading states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#A0A0B2',
    textAlign: 'center',
  },

  // Course card styles
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  cardImageContainer: {
    position: 'relative',
    height: 200,
  },
  courseImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  courseBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#3D5CFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  courseBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Course info styles
  courseInfo: {
    padding: 20,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D0D26',
    marginBottom: 8,
    lineHeight: 24,
  },
  courseDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  playButtonSmall: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Legacy styles (kept for compatibility)
  card: {
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    color: '#0D0D26',
    fontWeight: '500',
  },
});
