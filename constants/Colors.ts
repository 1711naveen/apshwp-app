/**
 * Colors used throughout the app.
 * This allows for consistent theming and easy color changes.
 */

export const Colors = {
  // Primary brand colors
  primary: '#F26A21',           // Main brand color (orange)
  primaryDark: '#D4571A',       // Darker shade for pressed states
  primaryLight: '#F58A4A',      // Lighter shade for backgrounds
  
  // Secondary colors
  secondary: '#2E86AB',         // Blue accent
  secondaryDark: '#1E5F7A',     // Darker blue
  secondaryLight: '#4BA3C7',    // Lighter blue
  
  // Status colors
  success: '#4CAF50',           // Green for success states
  warning: '#FF9800',           // Orange for warnings
  error: '#F44336',             // Red for errors
  info: '#2196F3',              // Blue for info
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Text colors
  text: {
    primary: '#212121',         // Main text color
    secondary: '#757575',       // Secondary text color
    disabled: '#BDBDBD',        // Disabled text color
    inverse: '#FFFFFF',         // Text on dark backgrounds
  },
  
  // Background colors
  background: {
    primary: '#FFFFFF',         // Main background
    secondary: '#F5F5F5',       // Secondary background
    tertiary: '#FAFAFA',        // Tertiary background
    dark: '#121212',            // Dark background
  },
  
  // Border colors
  border: {
    light: '#E0E0E0',
    medium: '#BDBDBD',
    dark: '#757575',
  },
  
  // Shadow colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(0, 0, 0, 0.3)',
  },
  
  // Legacy colors (for backward compatibility)
  // These will be gradually replaced
  blue: '#F26A21',             // Replacing blue with primary orange
  lightBlue: '#F58A4A',        // Light version of primary
  darkBlue: '#D4571A',         // Dark version of primary
} as const;

// Theme variants
export const ThemeColors = {
  light: {
    primary: Colors.primary,
    background: Colors.background.primary,
    surface: Colors.white,
    text: Colors.text.primary,
    textSecondary: Colors.text.secondary,
    border: Colors.border.light,
  },
  dark: {
    primary: Colors.primary,
    background: Colors.background.dark,
    surface: Colors.gray[800],
    text: Colors.text.inverse,
    textSecondary: Colors.gray[300],
    border: Colors.gray[700],
  },
} as const;

export default Colors;
