import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBox() {
  return (
    <View style={styles.box}>
      <Ionicons name="search" size={20} color="#A1A1A1" />
      <TextInput
        placeholder="Find Course"
        placeholderTextColor="#A1A1A1"
        style={styles.input}
      />
      <Ionicons name="options-outline" size={20} color="#A1A1A1" />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#333',
    marginHorizontal: 8,
  },
});
