import { Colors, ThemeColors } from '../constants/Colors';

/**
 * Custom hook for accessing theme colors
 * This makes it easy to use colors throughout the app
 */
export const useTheme = () => {
  // For now, we'll use light theme by default
  // This can be extended to support dark mode with state management
  const isDark = false;
  
  const theme = isDark ? ThemeColors.dark : ThemeColors.light;
  
  return {
    colors: Colors,
    theme,
    isDark,
  };
};

/**
 * Helper function to get colors without hook
 * Useful in StyleSheet.create() calls
 */
export const getColors = () => Colors;

export default useTheme;
