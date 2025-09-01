import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { FIRST_LAUNCH_KEY, resetFirstLaunch, USER_INFO_KEY } from './utils/appStorage';
// In React Native debugger console or add to a test button:


export default function AppInitializer() {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkAppState();
    }, []);

    const checkAppState = async () => {
        try {
            // uncomment for testing
            await resetFirstLaunch();
            // Add a small delay to prevent flash
            await new Promise(resolve => setTimeout(resolve, 500));

            // Check if this is the first time launching the app
            const isFirstLaunch = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);

            if (isFirstLaunch === null) {
                // First time launching the app
                await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'false');
                setIsLoading(false);
                router.replace('/onboarding');
                return;
            }

            // Not first time, check if user is logged in
            const userInfo = await AsyncStorage.getItem(USER_INFO_KEY);

            setIsLoading(false);

            if (userInfo) {
                // User is logged in, go to home
                router.replace('/(tabs)/home');
            } else {
                // User is not logged in, go to login
                router.replace('/auth/login');
            }

        } catch (error) {
            console.error('Error checking app state:', error);
            setIsLoading(false);
            // Fallback to login if there's an error
            router.replace('/auth/login');
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3D5CFF" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    // This component doesn't render anything after routing
    return null;
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F5',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
});
