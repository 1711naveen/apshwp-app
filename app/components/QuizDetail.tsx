import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface Choice {
    id: number;
    label: string;
    status: string;
}

interface Question {
    id: number;
    name: string;
    description: string;
    image: string;
    answer_id: number;
    choices: Choice[];
}

interface Quiz {
    id: number;
    name: string;
    quize_image: string;
    description: string;
    status: string;
    theme_id?: number;
    questions: Question[];
}

interface QuizDetailProps {
    quiz: Quiz;
    onClose: () => void;
    onComplete: (score: number, totalQuestions: number) => void;
}

export default function QuizDetail({ quiz, onClose, onComplete }: QuizDetailProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentQuestion = quiz.questions[currentQuestionIndex];

    const handleAnswerSelect = (choiceId: number) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestion.id]: choiceId,
        });
    };

    const saveQuizResponse = async (questionId: number, responseId: number) => {
        try {
            // Get user info from AsyncStorage
            const storedUser = await AsyncStorage.getItem('userInfo');
            if (!storedUser) {
                Alert.alert('Error', 'User not found. Please login again.');
                return false;
            }

            const user = JSON.parse(storedUser);
            const userId = user.id;

            // Prepare the response body
            const responseBody = {
                user_id: userId,
                quiz_id: quiz.id,
                theme_id: quiz.theme_id || 9, // Use quiz theme_id or default to 9
                quiz_status: "IN_PROGRESS",
                start_date: new Date().toISOString().split('T')[0],
                end_date: null,
                responses: [
                    {
                        question_id: questionId,
                        response_id: responseId
                    }
                ]
            };

            console.log('Saving quiz response:', responseBody);

            const response = await fetch('https://apshwp.ap.gov.in/api/quizzes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(responseBody)
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('API Error Response:', errorData);
                throw new Error(`API Error: ${response.status}`);
            }

            const result = await response.json();
            console.log('Quiz response saved successfully:', result);
            return true;

        } catch (error) {
            console.error('Error saving quiz response:', error);
            Alert.alert('Error', 'Failed to save your answer. Please try again.');
            return false;
        }
    };

    const handleNext = async () => {
        const selectedAnswer = selectedAnswers[currentQuestion.id];
        if (!selectedAnswer) {
            Alert.alert('Please select an answer', 'You must select an answer before proceeding.');
            return;
        }

        setIsSubmitting(true);

        // Save the current answer to API
        const success = await saveQuizResponse(currentQuestion.id, selectedAnswer);
        
        setIsSubmitting(false);

        if (!success) {
            // If saving failed, don't proceed to next question
            return;
        }

        // Proceed to next question or finish quiz
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            finishQuiz();
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const finishQuiz = async () => {
        try {
            // Get user info from AsyncStorage
            const storedUser = await AsyncStorage.getItem('userInfo');
            if (!storedUser) {
                Alert.alert('Error', 'User not found. Please login again.');
                return;
            }

            const user = JSON.parse(storedUser);
            const userId = user.id;

            // Prepare all responses for final submission
            const allResponses = Object.entries(selectedAnswers).map(([questionId, responseId]) => ({
                question_id: parseInt(questionId),
                response_id: responseId
            }));

            const responseBody = {
                user_id: userId,
                quiz_id: quiz.id,
                theme_id: quiz.theme_id || 9,
                quiz_status: "COMPLETED",
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date().toISOString().split('T')[0],
                responses: allResponses
            };

            console.log('Finishing quiz with final submission:', responseBody);

            const response = await fetch('https://apshwp.ap.gov.in/api/quizzes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(responseBody)
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Final API Error Response:', errorData);
                throw new Error(`API Error: ${response.status}`);
            }

            const result = await response.json();
            console.log('Quiz completed successfully:', result);

        } catch (error) {
            console.error('Error completing quiz:', error);
            Alert.alert('Warning', 'Quiz completed locally but failed to sync with server.');
        }

        const score = calculateScore();
        setShowResults(true);
        onComplete(score, quiz.questions.length);
    };

    const calculateScore = () => {
        let correctAnswers = 0;
        quiz.questions.forEach((question) => {
            const selectedAnswer = selectedAnswers[question.id];
            if (selectedAnswer === question.answer_id) {
                correctAnswers++;
            }
        });
        return correctAnswers;
    };

    const getScorePercentage = () => {
        const score = calculateScore();
        return Math.round((score / quiz.questions.length) * 100);
    };

    const getScoreColor = (percentage: number) => {
        if (percentage >= 80) return '#4CAF50'; // Green
        if (percentage >= 60) return '#FF9800'; // Orange
        return '#F44336'; // Red
    };

    if (showResults) {
        const score = calculateScore();
        const percentage = getScorePercentage();

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#0D0D26" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Quiz Results</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.centerContent}>
                    <View style={[styles.scoreCircle, { borderColor: getScoreColor(percentage) }]}>
                        <Text style={[styles.scorePercentage, { color: getScoreColor(percentage) }]}>
                            {percentage}%
                        </Text>
                        <Text style={styles.scoreText}>
                            {score}/{quiz.questions.length}
                        </Text>
                    </View>

                    <Text style={styles.resultTitle}>
                        {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Job!' : 'Keep Learning!'}
                    </Text>

                    <Text style={styles.resultDescription}>
                        You answered {score} out of {quiz.questions.length} questions correctly.
                    </Text>

                    <View style={styles.resultActions}>
                        <TouchableOpacity
                            style={styles.retakeButton}
                            onPress={() => {
                                setCurrentQuestionIndex(0);
                                setSelectedAnswers({});
                                setShowResults(false);
                            }}
                        >
                            <Ionicons name="refresh" size={20} color="#3D5CFF" />
                            <Text style={styles.retakeButtonText}>Retake Quiz</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.finishButton} onPress={onClose}>
                            <Text style={styles.finishButtonText}>Finish</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={24} color="#0D0D26" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{quiz.name}</Text>
                <View style={styles.headerSpacer} />
            </View>

            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }
                        ]}
                    />
                </View>
                <Text style={styles.progressText}>
                    {currentQuestionIndex + 1} of {quiz.questions.length}
                </Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.questionContainer}>
                    <Text style={styles.questionNumber}>
                        Question {currentQuestionIndex + 1}
                    </Text>
                    <Text style={styles.questionText}>
                        {currentQuestion.name}
                    </Text>

                    {currentQuestion.description && (
                        <Text style={styles.questionDescription}>
                            {currentQuestion.description}
                        </Text>
                    )}
                </View>

                <View style={styles.choicesContainer}>
                    {currentQuestion.choices.map((choice, index) => {
                        const isSelected = selectedAnswers[currentQuestion.id] === choice.id;
                        return (
                            <TouchableOpacity
                                key={choice.id}
                                style={[
                                    styles.choiceButton,
                                    isSelected && styles.choiceButtonSelected
                                ]}
                                onPress={() => handleAnswerSelect(choice.id)}
                            >
                                <View style={[
                                    styles.choiceIndicator,
                                    isSelected && styles.choiceIndicatorSelected
                                ]}>
                                    <Text style={[
                                        styles.choiceLabel,
                                        isSelected && styles.choiceLabelSelected
                                    ]}>
                                        {String.fromCharCode(65 + index)} {/* A, B, C, D */}
                                    </Text>
                                </View>
                                <Text style={[
                                    styles.choiceText,
                                    isSelected && styles.choiceTextSelected
                                ]}>
                                    {choice.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={styles.navigationContainer}>
                <TouchableOpacity
                    style={[styles.navButton, currentQuestionIndex === 0 && styles.navButtonDisabled]}
                    onPress={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                >
                    <Ionicons name="chevron-back" size={20} color={currentQuestionIndex === 0 ? "#ccc" : "#3D5CFF"} />
                    <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.navButtonTextDisabled]}>
                        Previous
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.navButton,
                        styles.nextButton,
                        (!selectedAnswers[currentQuestion.id] || isSubmitting) && styles.navButtonDisabled
                    ]}
                    onPress={handleNext}
                    disabled={!selectedAnswers[currentQuestion.id] || isSubmitting}
                >
                    <Text style={[
                        styles.navButtonText,
                        styles.nextButtonText,
                        (!selectedAnswers[currentQuestion.id] || isSubmitting) && styles.navButtonTextDisabled
                    ]}>
                        {isSubmitting 
                            ? 'Saving...' 
                            : currentQuestionIndex === quiz.questions.length - 1 ? 'Finish' : 'Next'
                        }
                    </Text>
                    {!isSubmitting && (
                        <Ionicons
                            name={currentQuestionIndex === quiz.questions.length - 1 ? "checkmark" : "chevron-forward"}
                            size={20}
                            color={(!selectedAnswers[currentQuestion.id] || isSubmitting) ? "#ccc" : "#fff"}
                        />
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    closeButton: {
        padding: 5,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0D0D26',
    },
    headerSpacer: {
        width: 34,
    },
    progressContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#F0F0F0',
        borderRadius: 2,
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 2,
    },
    progressText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 50,
    },
    questionContainer: {
        marginBottom: 30,
    },
    questionNumber: {
        fontSize: 14,
        color: '#3D5CFF',
        fontWeight: 'bold',
        marginBottom: 8,
    },
    questionText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0D0D26',
        lineHeight: 24,
        marginBottom: 8,
    },
    questionDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    choicesContainer: {
        gap: 12,
    },
    choiceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#F0F0F0',
        backgroundColor: '#fff',
    },
    choiceButtonSelected: {
        borderColor: Colors.primary,
        backgroundColor: '#F7F9FF',
    },
    choiceIndicator: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    choiceIndicatorSelected: {
        backgroundColor: Colors.primary,
    },
    choiceLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
    },
    choiceLabelSelected: {
        color: '#fff',
    },
    choiceText: {
        flex: 1,
        fontSize: 16,
        color: '#0D0D26',
        lineHeight: 22,
    },
    choiceTextSelected: {
        color: Colors.primary,
        fontWeight: '500',
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#3D5CFF',
    },
    navButtonDisabled: {
        borderColor: '#ccc',
    },
    nextButton: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    navButtonTextDisabled: {
        color: '#fff',
    },
    nextButtonText: {
        color: '#fff',
    },
    // Results styles
    scoreCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    scorePercentage: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    scoreText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0D0D26',
        marginBottom: 12,
        textAlign: 'center',
    },
    resultDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    },
    resultActions: {
        gap: 16,
        width: '100%',
    },
    retakeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#3D5CFF',
        gap: 8,
    },
    retakeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3D5CFF',
    },
    finishButton: {
        backgroundColor: '#3D5CFF',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    finishButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});
