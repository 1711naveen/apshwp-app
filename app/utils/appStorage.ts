import AsyncStorage from '@react-native-async-storage/async-storage';

const FIRST_LAUNCH_KEY = 'isFirstLaunch';
const USER_INFO_KEY = 'userInfo';

/**
 * Utility functions for app initialization and testing
 */

// Reset first launch flag (useful for testing)
export const resetFirstLaunch = async () => {
  try {
    await AsyncStorage.removeItem(FIRST_LAUNCH_KEY);
    console.log('First launch flag reset - app will show onboarding on next start');
  } catch (error) {
    console.error('Error resetting first launch flag:', error);
  }
};

// Check if user is logged in
export const isUserLoggedIn = async () => {
  try {
    const userInfo = await AsyncStorage.getItem(USER_INFO_KEY);
    return !!userInfo;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

// Get stored user info
export const getUserInfo = async () => {
  try {
    const userInfo = await AsyncStorage.getItem(USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

// Clear all app data (useful for testing)
export const clearAllAppData = async () => {
  try {
    await AsyncStorage.multiRemove([FIRST_LAUNCH_KEY, USER_INFO_KEY, 'authToken']);
    console.log('All app data cleared');
  } catch (error) {
    console.error('Error clearing app data:', error);
  }
};

export { FIRST_LAUNCH_KEY, USER_INFO_KEY };

