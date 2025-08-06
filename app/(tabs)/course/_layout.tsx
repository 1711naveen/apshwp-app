import { Stack } from 'expo-router';

export default function CourseLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: true,
          title: 'Courses'
        }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerShown: false 
        }} 
      />
    </Stack>
  );
}
