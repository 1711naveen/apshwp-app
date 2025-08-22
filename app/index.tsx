import { LogLevel, OneSignal } from 'react-native-onesignal';
import AppInitializer from "./AppInitializer";

export default function Index() {

  // Enable verbose logging for debugging (remove in production)
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);

  // Initialize with your OneSignal App ID
  OneSignal.initialize('cc572199-d8e1-47e1-b2fb-e1041fd51f6e');
  
  // Use this method to prompt for push notifications.
  // We recommend removing this method after testing and instead use In-App Messages to prompt for notification permission.
  OneSignal.Notifications.requestPermission(true);

  return <AppInitializer />;
}