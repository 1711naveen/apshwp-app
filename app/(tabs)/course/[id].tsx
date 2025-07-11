import React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';

const fakeCourseData = {
  id: 'metabolic-health',
  title: 'Metabolic Health: Understanding NCDs Prevention',
  subtitle: 'Learn how to prevent non-communicable diseases through better metabolic health.',
  rating: 4.8,
  reviewsCount: 320,
  students: 1200,
  price: '₹999.00',
  whatYouWillLearn: [
    'Understand metabolic health basics.',
    'Identify metabolic dysfunction.',
    'Learn strategies for prevention.',
    'Understand impacts of lifestyle choices.',
  ],
  courseIncludes: [
    '10 hours on-demand video',
    '5 downloadable resources',
    'Full lifetime access',
    'Certificate of completion',
  ],
  requirements: [
    'No prior medical knowledge required.',
    'Willingness to learn about health topics.',
  ],
  description:
    'This course dives into the science of metabolic health and practical ways to prevent non-communicable diseases (NCDs). Perfect for health professionals, students, and anyone interested in wellness.',
  instructor: {
    name: 'Dr. Anjali Mehra',
    bio: 'A leading expert in metabolic health with over 15 years of experience.',
    image: require('../../../assets/images/app-images/illustration_2.png'),
  },
  sections: [
    {
      title: 'Introduction',
      lectures: [
        'Welcome to the Course',
        'Why Metabolic Health Matters',
      ],
    },
    {
      title: 'Core Concepts',
      lectures: [
        'What is Metabolic Dysfunction?',
        'Lifestyle Changes for Health',
      ],
    },
    {
      title: 'Practical Strategies',
      lectures: [
        'Designing a Healthy Routine',
        'Resources and Next Steps',
      ],
    },
  ],
};

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // In real app, fetch by id!
  const course = fakeCourseData;

  return (
    <ScrollView style={styles.container}>
      {/* Course Thumbnail */}
      <Image
        source={require('../../../assets/images/app-images/illustration_1.png')}
        style={styles.thumbnail}
      />

      {/* Title & Subtitle */}
      <View style={styles.content}>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.subtitle}>{course.subtitle}</Text>

        {/* Rating & Reviews */}
        <View style={styles.row}>
          <Text style={styles.rating}>
            ⭐ {course.rating} ({course.reviewsCount} ratings)
          </Text>
          <Text style={styles.students}>
            • {course.students} students
          </Text>
        </View>


        {/* What you'll learn */}
        <Text style={styles.sectionTitle}>What you'll learn</Text>
        {course.whatYouWillLearn.map((item, index) => (
          <Text key={index} style={styles.bullet}>
            • {item}
          </Text>
        ))}

        {/* Course Content */}
        <Text style={styles.sectionTitle}>Course Content</Text>
        {course.sections.map((section, idx) => (
          <View key={idx} style={styles.sectionBlock}>
            <Text style={styles.sectionHeader}>{section.title}</Text>
            {section.lectures.map((lecture, index) => (
              <Text key={index} style={styles.lecture}>
                - {lecture}
              </Text>
            ))}
          </View>
        ))}

        {/* Includes */}
        <Text style={styles.sectionTitle}>This course includes:</Text>
        {course.courseIncludes.map((item, index) => (
          <Text key={index} style={styles.bullet}>
            • {item}
          </Text>
        ))}

        {/* Requirements */}
        <Text style={styles.sectionTitle}>Requirements</Text>
        {course.requirements.map((item, index) => (
          <Text key={index} style={styles.bullet}>
            • {item}
          </Text>
        ))}

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{course.description}</Text>
        <Link href="/course/quiz" style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Start Quiz</Text>
          </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  thumbnail: { width: '100%', height: 200 },
  content: { padding: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { color: '#ccc', fontSize: 16, marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  rating: { color: '#ffd700', fontSize: 14, marginRight: 10 },
  students: { color: '#999', fontSize: 14 },
  price: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  buyButton: {
    backgroundColor: '#A020F0',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buyButtonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  bullet: { color: '#ccc', fontSize: 14, marginBottom: 5 },
  sectionBlock: { marginBottom: 15 },
  sectionHeader: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  lecture: { color: '#ccc', fontSize: 14, marginLeft: 10 },
  description: { color: '#ccc', fontSize: 14, marginTop: 5 },
  instructor: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  instructorImage: { width: 60, height: 60, borderRadius: 30 },
  instructorName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  instructorBio: { color: '#ccc', fontSize: 14 },
});
