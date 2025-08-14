import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HomeLayoutProps {
    children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
    return (
        <SafeAreaView style={styles.container}>
            {children}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F2F2F5",
    },
});
