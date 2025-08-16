# Google Analytics Implementation Guide

## 🎯 What's Been Implemented

Your React Native Expo app now has Google Analytics (Firebase Analytics) fully integrated with comprehensive event tracking throughout the application.

## 📦 Packages Installed

- `@react-native-firebase/app` - Core Firebase functionality
- `@react-native-firebase/analytics` - Firebase Analytics
- `expo-build-properties` - Native build configuration

## 📁 Files Created/Modified

### New Files:
- `/app/services/AnalyticsService.ts` - Main analytics service
- `/app/hooks/useAnalytics.ts` - React hooks for analytics
- `/app/components/AnalyticsTestDashboard.tsx` - Testing dashboard (optional)
- `google-services.json` - **REPLACE THIS** with your actual Firebase config file

### Modified Files:
- `app.json` - Added Firebase and build plugins
- `package.json` - Added analytics dependencies
- `app/AppInitializer.tsx` - Analytics initialization and app-level events
- `app/auth/login.js` - Login/logout event tracking
- `app/(tabs)/home.tsx` - Screen view and user tracking
- `app/(tabs)/course/[id].tsx` - Course view, video play, topic interaction events
- `app/(tabs)/course/quiz/[id].tsx` - Quiz start, completion tracking
- `app/(tabs)/course/quiz/result.tsx` - Result view and sharing events

## 🔧 Setup Instructions

### 1. Replace Firebase Config File
**IMPORTANT**: Replace the placeholder `google-services.json` in your project root with the actual file from your Firebase Console.

### 2. Prebuild the App
Since we've added native dependencies, you need to prebuild:

```bash
npx expo prebuild --clean
```

**Note**: If you get an error about iOS deployment target, make sure your app.json has:
```json
{
  "expo": {
    "android": {
      "googleServicesFile": "./google-services.json"
    },
    "plugins": [
      [
        "expo-build-properties",
        {
          "ios": {
            "deploymentTarget": "15.1"
          }
        }
      ]
    ]
  }
}
```

### 3. Build and Test

For development:
```bash
# Android
npx expo run:android

# iOS  
npx expo run:ios
```

For production:
```bash
# Using EAS Build
npx expo build --platform android
npx expo build --platform ios
```

## 📊 Analytics Events Being Tracked

### App-Level Events:
- `app_first_launch` - First time app is opened
- `app_open` - App opened (with login status)
- `app_error` - App initialization errors

### User Events:
- `login` - User login with method
- `sign_up` - User registration (ready for implementation)

### Screen Views:
- All major screens automatically tracked
- Custom screen classes for better organization

### Course & Learning Events:
- `course_view` - Course detail page visits
- `topic_view` - Individual topic interactions
- `video_play` - Video content engagement
- `quiz_start` - Quiz initiation
- `quiz_complete` - Quiz completion with score data
- `quiz_result_view` - Result page views

### User Actions:
- `share` - Content sharing events
- `search` - Search functionality (ready for implementation)
- `quiz_button_click` - Quiz CTA interactions

## 🔍 Analytics Dashboard

### Firebase Console
View your analytics data at: https://console.firebase.google.com/
- Navigate to your project → Analytics → Events

### Test Dashboard (Optional)
We've created a test dashboard component at `/app/components/AnalyticsTestDashboard.tsx`
You can add it to your app temporarily for testing events.

## 📈 Key Metrics You Can Track

### User Engagement:
- Screen views and user flow
- Time spent in app
- Course completion rates
- Quiz participation and scores

### Learning Analytics:
- Most popular courses
- Video engagement rates
- Quiz performance by topic
- User learning progress

### Technical Metrics:
- App crashes and errors
- Login success rates
- Feature usage patterns

## 🛠️ Using Analytics in Your Code

### Basic Event Logging:
```typescript
import AnalyticsService from '../services/AnalyticsService';

// Log custom event
await AnalyticsService.logEvent('custom_event', {
  custom_parameter: 'value'
});

// Log screen view
await AnalyticsService.logScreenView('ScreenName');

// Set user properties
await AnalyticsService.setUserId('user123');
await AnalyticsService.setUserProperty('user_type', 'premium');
```

### Using React Hooks:
```typescript
import { useAnalyticsScreenView } from '../hooks/useAnalytics';

// Automatic screen view tracking
useAnalyticsScreenView('MyScreen');
```

### Predefined Events:
```typescript
// Login/Signup
await AnalyticsService.logLogin('google');
await AnalyticsService.logSignUp('email');

// Learning Events
await AnalyticsService.logCourseView('course_1', 'Course Name');
await AnalyticsService.logQuizStart('quiz_1', 'Quiz Name');
await AnalyticsService.logQuizComplete('quiz_1', 'Quiz Name', 8, 10);

// Engagement
await AnalyticsService.logVideoPlay('video_1', 'Video Name');
await AnalyticsService.logShare('course', 'course_1');
```

## 🚨 Important Notes

### Privacy & Compliance:
- Analytics is enabled by default
- Consider adding a privacy policy
- Implement consent management if required in your region
- User data is processed according to Google's privacy policies

### Performance:
- Analytics events are queued and sent in batches
- Minimal impact on app performance
- Events may take time to appear in Firebase Console (usually 24-48 hours)

### Testing:
- Use Firebase DebugView for real-time event testing
- Enable debug mode: `adb shell setprop debug.firebase.analytics.app YOUR_PACKAGE_NAME`

## 📞 Next Steps

1. **Replace** the placeholder `google-services.json` with your actual Firebase config
2. **Prebuild** your app: `npx expo prebuild --clean`
3. **Test** the analytics implementation using Firebase DebugView
4. **Deploy** your app and monitor analytics in Firebase Console
5. **Add more custom events** as needed for your specific use cases

## 🔧 Troubleshooting

### Common Issues:
1. **Events not showing**: Check if `google-services.json` is correct
2. **Build errors**: Run `npx expo prebuild --clean`
3. **Missing events**: Events may take 24-48 hours to appear in console
4. **Debug mode**: Use DebugView for real-time testing

Your app now has comprehensive analytics tracking! 🎉
