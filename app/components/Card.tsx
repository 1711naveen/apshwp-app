import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

interface CardProps {
  image: any;
  title: string;
  courseId: string;
}

const Card: React.FC<CardProps> = ({ image, title, courseId }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/course/${courseId}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.8}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    padding: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 140,
    borderRadius: 10,
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
});
