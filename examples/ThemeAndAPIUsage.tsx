/**
 * Usage Examples for Theme Colors and API Constants
 * 
 * This file demonstrates how to use the new theme system and API constants
 * throughout your React Native app.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_ENDPOINTS } from '../constants/API';
import Colors from '../constants/Colors';
import { useTheme } from '../hooks/useTheme';
import { api } from '../utils/api';

export const ExampleComponent = () => {
  const { colors, theme } = useTheme();

  const handleLogin = async () => {
    try {
      // Method 1: Using the API utility
      const result = await api.auth.login({
        email: 'user@example.com',
        password: 'password123'
      });
      
      // Method 2: Using API_ENDPOINTS directly
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'password123'
        }),
      });
      
      console.log('Login successful', result);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const fetchCourseDetails = async (courseId: string, userId: string) => {
    try {
      // Using the API utility
      const course = await api.courses.getDetail(courseId, userId);
      
      // Or using API_ENDPOINTS directly
      const response = await fetch(API_ENDPOINTS.COURSES.DETAIL_WITH_USER(courseId, userId));
      const data = await response.json();
      
      console.log('Course data:', course);
    } catch (error) {
      console.error('Failed to fetch course:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theme & API Usage Example</Text>
      
      {/* Primary Button using theme colors */}
      <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
        <Text style={styles.primaryButtonText}>Login</Text>
      </TouchableOpacity>
      
      {/* Secondary Button */}
      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Secondary Action</Text>
      </TouchableOpacity>
      
      {/* Success Button */}
      <TouchableOpacity style={styles.successButton}>
        <Text style={styles.successButtonText}>Success Action</Text>
      </TouchableOpacity>
      
      {/* Error Button */}
      <TouchableOpacity style={styles.errorButton}>
        <Text style={styles.errorButtonText}>Error Action</Text>
      </TouchableOpacity>
      
      <View style={styles.textContainer}>
        <Text style={styles.primaryText}>Primary Text</Text>
        <Text style={styles.secondaryText}>Secondary Text</Text>
        <Text style={styles.disabledText}>Disabled Text</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  
  // Button styles using theme colors
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  
  secondaryButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  
  successButton: {
    backgroundColor: Colors.success,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  successButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  
  errorButton: {
    backgroundColor: Colors.error,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  errorButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Text styles
  textContainer: {
    padding: 16,
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  primaryText: {
    color: Colors.text.primary,
    fontSize: 16,
    marginBottom: 8,
  },
  secondaryText: {
    color: Colors.text.secondary,
    fontSize: 14,
    marginBottom: 8,
  },
  disabledText: {
    color: Colors.text.disabled,
    fontSize: 12,
  },
});

/**
 * API Usage Examples:
 * 
 * 1. Using API_ENDPOINTS constants:
 *    - API_ENDPOINTS.AUTH.LOGIN
 *    - API_ENDPOINTS.COURSES.DETAIL_WITH_USER(courseId, userId)
 *    - API_ENDPOINTS.COURSES.MARK_VIDEO_COMPLETE
 * 
 * 2. Using the API utility:
 *    - api.auth.login(credentials)
 *    - api.courses.getDetail(id, userId)
 *    - api.courses.markVideoComplete(data)
 * 
 * 3. Color Usage Examples:
 *    - Colors.primary (main brand color: #F26A21)
 *    - Colors.secondary (blue accent)
 *    - Colors.success, Colors.warning, Colors.error
 *    - Colors.text.primary, Colors.text.secondary
 *    - Colors.background.primary, Colors.background.secondary
 *    - Colors.border.light, Colors.border.medium
 * 
 * 4. Migration from old colors:
 *    - Replace '#3D5CFF' with Colors.primary
 *    - Replace '#4CAF50' with Colors.success
 *    - Replace '#FF9800' with Colors.warning
 *    - Replace '#F44336' with Colors.error
 *    - Replace hardcoded URLs with API_ENDPOINTS
 */

export default ExampleComponent;
