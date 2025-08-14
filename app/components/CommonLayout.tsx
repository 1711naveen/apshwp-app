import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from './AppHeader';

interface CommonLayoutProps {
    children: React.ReactNode;
    title: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    headerBackgroundColor?: string;
}

export default function CommonLayout({
    children,
    title,
    showBackButton = false,
    onBackPress,
    headerBackgroundColor = "#F2F2F5"
}: CommonLayoutProps) {
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: headerBackgroundColor }]}>
            <AppHeader
                title={title}
                showBackButton={showBackButton}
                onBackPress={onBackPress}
            />
            <View style={styles.content}>
                {children}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});
