import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AnalyticsService from '../services/AnalyticsService';
import CommonLayout from './CommonLayout';

export default function AnalyticsTestDashboard() {
  const [events, setEvents] = useState<string[]>([]);

  const logTestEvent = async (eventName: string, params?: any) => {
    try {
      await AnalyticsService.logEvent(eventName, params);
      const newEvent = `${new Date().toLocaleTimeString()}: ${eventName} ${params ? JSON.stringify(params) : ''}`;
      setEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep last 10 events
      Alert.alert('Success', `Event "${eventName}" logged successfully!`);
    } catch (error) {
      Alert.alert('Error', `Failed to log event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <CommonLayout title="Analytics Test Dashboard">
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Test Analytics Events</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => logTestEvent('test_button_click', { source: 'dashboard' })}
          >
            <Text style={styles.buttonText}>Test Custom Event</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => logTestEvent('screen_view', { screen_name: 'test_screen' })}
          >
            <Text style={styles.buttonText}>Test Screen View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => AnalyticsService.logLogin('test')}
          >
            <Text style={styles.buttonText}>Test Login Event</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => AnalyticsService.logQuizStart('test_quiz', 'Test Quiz')}
          >
            <Text style={styles.buttonText}>Test Quiz Start</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.clearButton]}
            onPress={clearEvents}
          >
            <Text style={styles.buttonText}>Clear Events</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.eventContainer}>
          <Text style={styles.eventTitle}>Recent Events:</Text>
          {events.length === 0 ? (
            <Text style={styles.noEvents}>No events logged yet</Text>
          ) : (
            events.map((event, index) => (
              <View key={index} style={styles.eventItem}>
                <Text style={styles.eventText}>{event}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </CommonLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#3D5CFF',
  },
  buttonContainer: {
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#3D5CFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventContainer: {
    marginTop: 20,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  noEvents: {
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  eventItem: {
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 6,
    marginBottom: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#3D5CFF',
  },
  eventText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
  },
});
