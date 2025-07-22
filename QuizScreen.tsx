import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const quizCategories = [
    {
        id: 1,
        name: 'HIV/ AIDS Prevention',
        icon: require('./assets/hiv.png'), // Replace with your icon path
    },
    {
        id: 2,
        name: 'Substance Abuse',
        icon: require('./assets/substance.png'),
    },
    {
        id: 3,
        name: 'Mental Health',
        icon: require('./assets/mental.png'),
    },
    {
        id: 4,
        name: 'NCDs',
        icon: require('./assets/ncds.png'),
    },
    {
        id: 5,
        name: 'Child Rights',
        icon: require('./assets/child_rights.png'),
    },
];

const recentActivity = [
    {
        id: 1,
        title: 'HIV/ AIDS Prevention',
        questions: 30,
        score: 26,
    },
    {
        id: 2,
        title: 'HIV/ AIDS Prevention',
        questions: 30,
        score: 20,
    },
    {
        id: 3,
        title: 'HIV/ AIDS Prevention',
        questions: 30,
        score: 25,
    },
];

export default function QuizScreen() {
    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Quiz</Text>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/50' }} // Placeholder avatar
                        style={styles.avatar}
                    />
                </View>

                {/* Banner */}
                <View style={styles.banner}>
                    <Text style={styles.bannerTitle}>Test Your Knowledge with Quizzes</Text>
                    <Text style={styles.bannerSubtitle}>
                        You’re just looking for a playful way to learn new facts, our quizzes are designed to entertain and educate.
                    </Text>
                    <TouchableOpacity style={styles.playButton}>
                        <Text style={styles.playButtonText}>Play Now</Text>
                    </TouchableOpacity>
                </View>

                {/* Search */}
                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder="Find Course"
                        placeholderTextColor="#999"
                        style={styles.searchInput}
                    />
                    <TouchableOpacity style={styles.filterButton}>
                        <Image
                            source={require('./assets/filter.png')} // your filter icon
                            style={styles.filterIcon}
                        />
                    </TouchableOpacity>
                </View>

                {/* Categories */}
                <View style={styles.categoriesContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {quizCategories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={styles.categoryCard}
                            >
                                <Image
                                    source={category.icon}
                                    style={styles.categoryIcon}
                                />
                                <Text style={styles.categoryText}>{category.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Recent Activity */}
                <Text style={styles.recentTitle}>Recent Activity</Text>
                <View style={styles.recentList}>
                    {recentActivity.map((item) => (
                        <View key={item.id} style={styles.recentCard}>
                            <View style={styles.recentLeft}>
                                <Image
                                    source={require('./assets/hiv.png')}
                                    style={styles.recentImage}
                                />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={styles.recentQuizTitle}>
                                        {item.title}
                                    </Text>
                                    <Text style={styles.recentQuizSubtitle}>
                                        {item.questions} Question
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.scoreContainer}>
                                <Text style={styles.scoreText}>
                                    {item.score}/{item.questions}
                                </Text>
                                <View
                                    style={[
                                        styles.circle,
                                        getCircleStyle(item.score, item.questions),
                                    ]}
                                />
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

// Helper to color score indicator
const getCircleStyle = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) {
        return { backgroundColor: '#4CD7A3' }; // teal
    } else if (percentage >= 50) {
        return { backgroundColor: '#F3C14A' }; // yellow
    } else {
        return { backgroundColor: '#F2453D' }; // red
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    banner: {
        backgroundColor: '#1B3FAA',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    bannerTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bannerSubtitle: {
        color: '#fff',
        fontSize: 12,
        marginBottom: 15,
    },
    playButton: {
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    playButtonText: {
        color: '#1B3FAA',
        fontWeight: 'bold',
        fontSize: 14,
    },
    searchContainer: {
        flexDirection: 'row',
        backgroundColor: '#F5F6FA',
        borderRadius: 10,
        paddingHorizontal: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        height: 40,
        color: '#333',
    },
    filterButton: {
        padding: 8,
    },
    filterIcon: {
        width: 20,
        height: 20,
        tintColor: '#666',
    },
    categoriesContainer: {
        marginBottom: 20,
    },
    categoryCard: {
        backgroundColor: '#F5F6FA',
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
        alignItems: 'center',
        width: 80,
    },
    categoryIcon: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
        marginBottom: 5,
    },
    categoryText: {
        fontSize: 10,
        textAlign: 'center',
    },
    recentTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
    },
    recentList: {
        gap: 10,
    },
    recentCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        marginBottom: 10,
    },
    recentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recentImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    recentQuizTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 2,
    },
    recentQuizSubtitle: {
        fontSize: 12,
        color: '#777',
    },
    scoreContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    scoreText: {
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 4,
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
});
