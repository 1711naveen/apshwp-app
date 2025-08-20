import analytics from '@react-native-firebase/analytics';
import { Stack, usePathname } from "expo-router";
import { useEffect } from 'react';

export default function RootLayout() {
  const pathname = usePathname();

  useEffect(() => {
    // Track screen views automatically
    const trackScreen = async () => {
      try {
        // Remove leading slash and convert to readable format
        let screenName = pathname === '/' ? 'home' : pathname.substring(1);
        
        // Convert paths to readable screen names
        screenName = screenName
          .replace(/\(/g, '') // Remove opening parentheses
          .replace(/\)/g, '') // Remove closing parentheses
          .replace(/\//g, '_') // Replace slashes with underscores
          .replace(/-/g, '_'); // Replace hyphens with underscores
        
        console.log('Tracking screen:', screenName);
        
        await analytics().logScreenView({
          screen_name: screenName,
          screen_class: screenName,
        });
      } catch (error) {
        console.error('Analytics error:', error);
      }
    };

    trackScreen();
  }, [pathname]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  )
}
