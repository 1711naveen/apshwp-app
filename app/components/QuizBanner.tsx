import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function QuizBanner() {
  return (
    <View style={styles.banner}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Test Your Knowledge with Quizzes</Text>
        <Text style={styles.subtitle}>
          You’re just looking for a playful way to learn new facts, our quizzes are designed to entertain and educate.
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Play Now</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={require('../../assets/images/app-images/illustration_3.png')}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    backgroundColor: '#10275A',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    color: '#D6DFFF',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#10275A',
    fontWeight: 'bold',
    fontSize: 12,
  },
  image: {
    width: 80,
    height: 80,
    marginLeft: 10,
  },
});
