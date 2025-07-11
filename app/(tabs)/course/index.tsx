import React from 'react';
import { ScrollView } from 'react-native';
import Card from '../../components/Card';

export default function CourseScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Card
        image={require('../../../assets/images/app-images/illustration_1.png')}
        title="Metabolic Health (NCDs Prevention)"
        courseId="metabolic-health"
      />

      <Card
        image={require('../../../assets/images/app-images/illustration_2.png')}
        title="Heart Health Awareness"
        courseId="heart-health"
      />

      <Card
        image={require('../../../assets/images/app-images/illustration_3.png')}
        title="Diabetes Prevention"
        courseId="diabetes-prevention"
      />
    </ScrollView>
  );
}
