import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';

interface Props {
  title: string;
  image: any;
  isActive?: boolean;
}

export default function CategoryCard({ title, image, isActive }: Props) {
  return (
    <TouchableOpacity style={[styles.card, isActive && styles.activeCard]}>
      <Image source={image} style={styles.image} />
      <Text style={[styles.title, isActive && styles.activeTitle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    marginRight: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeCard: {
    borderColor: '#3D5CFF',
  },
  image: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  title: {
    fontSize: 10,
    color: '#666',
  },
  activeTitle: {
    color: '#3D5CFF',
    fontWeight: 'bold',
  },
});
