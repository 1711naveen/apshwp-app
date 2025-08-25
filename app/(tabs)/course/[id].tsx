import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { WebView } from 'react-native-webview';
import CommonLayout from '../../components/CommonLayout';
import { useAnalytics } from '../../hooks/useAnalytics';

const { width } = Dimensions.get('window');

interface ApiCourse {
  id: number;
  name: string;
  description: string;
  url: string;
  image_path: string;
  status: number;
  created_at: string;
  updated_at: string;
}

interface CourseTheme {
  id: number;
  name: string;
  status: number;
}

interface Question {
  questionId: number;
  questionText: string;
  answer: number;
  status: number;
  options: {
    optionId: number;
    optionText: string;
    status: string;
  }[];
}

interface Section {
  sectionId?: number;
  sectionName?: string;
  sectionVideoLink?: string | null;
  status?: number;
  questions: Question[];
}

interface Module {
  moduleId: number;
  moduleName: string;
  moduleLink: string;
  sections: Section[];
}

interface ModuleProgress {
  id: number;
  users_id: number;
  theme_id: number;
  module_id: number;
  section_id: number | null;
  is_completed: string;
  time_taken: string;
}

interface CourseApiResponse {
  success: boolean;
  message: string;
  data: {
    theme: CourseTheme;
    modules: Module[];
    moduleProgress: ModuleProgress[];
    sectionProgress: any[];
    user_quizzes: any;
    themeId: number;
    userId: number | null;
  };
}

interface ProcessedModule {
  moduleId: number;
  moduleName: string;
  moduleStatus: number;
  videoLink: string | null;
  order: number;
  isCompleted: boolean;
  timeTaken: string;
}

type Course = {
  id: string;
  title: string;
  headerImage: any;
  videoUrl: string;
  topics: string[];
};

export default function CourseDetail() {
  const { id, courseData } = useLocalSearchParams();
  const router = useRouter();
  const [showVideo, setShowVideo] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [courseDetails, setCourseDetails] = useState<CourseApiResponse['data'] | null>(null);
  const [processedModules, setProcessedModules] = useState<ProcessedModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  
  // Quiz states
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [currentQuizQuestions, setCurrentQuizQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizModuleId, setQuizModuleId] = useState<number | null>(null);
  const [quizSectionId, setQuizSectionId] = useState<number | null>(null);
  
  // Initialize analytics hook
  const { trackEvent, trackCourseComplete } = useAnalytics();

  // Fetch course details from API
  const fetchCourseDetails = async (courseId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`https://apshwp.ap.gov.in/api/courses/${courseId}`);
      const data: CourseApiResponse = await response.json();
      
      if (data.success) {
        setCourseDetails(data.data);
        
        // Process and combine modules with their video links and progress
        const processed = processModulesData(data.data);
        setProcessedModules(processed);
        
        // Set the first module as selected by default
        if (processed.length > 0) {
          setSelectedModuleId(processed[0].moduleId);
        }
        
        // Track course view
        await trackEvent('course_detail_viewed', {
          course_id: courseId,
          course_name: data.data.theme.name,
          module_count: processed.length,
        });
      } else {
        Alert.alert('Error', 'Failed to load course details');
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      Alert.alert('Network Error', 'Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Process the complex API response into usable data
  const processModulesData = (data: CourseApiResponse['data']): ProcessedModule[] => {
    const { modules, moduleProgress } = data;
    
    return modules.map((module, index) => {
      // Find progress for this module
      const progress = moduleProgress.find(
        (prog) => prog.module_id === module.moduleId && prog.section_id === null
      );
      
      return {
        moduleId: module.moduleId,
        moduleName: module.moduleName,
        moduleStatus: 1, // Default status since it's not in the new API
        videoLink: module.moduleLink || null,
        order: index + 1, // Use index as order since order is not provided
        isCompleted: progress?.is_completed === 'COMPLETED',
        timeTaken: progress?.time_taken || '00:00:00',
      };
    });
  };

  // Convert YouTube URL to embeddable format
  const getEmbeddableYouTubeUrl = (url: string | null): string | null => {
    if (!url) return null;
    
    // Convert various YouTube URL formats to embed format
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    return url;
  };

  // Handle module selection
  const handleModuleSelect = async (module: ProcessedModule) => {
    setSelectedModuleId(module.moduleId);
    setSelectedSectionId(null); // Reset section selection
    setShowVideo(true);
    setIsMenuOpen(false); // Close menu after selection
    
    await trackEvent('module_selected', {
      course_id: id,
      course_name: courseDetails?.theme.name,
      module_id: module.moduleId,
      module_name: module.moduleName,
      module_order: module.order,
    });
  };

  // Toggle module expansion in menu
  const toggleModuleExpansion = (moduleId: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  // Handle section selection (for quizzes)
  const handleSectionSelect = async (moduleId: number, sectionId: number, sectionName: string) => {
    const module = courseDetails?.modules.find(m => m.moduleId === moduleId);
    const section = module?.sections.find(s => s.sectionId === sectionId);
    
    if (section && section.questions && section.questions.length > 0) {
      // Start local quiz
      setIsMenuOpen(false);
      setCurrentQuizQuestions(section.questions);
      setQuizModuleId(moduleId);
      setQuizSectionId(sectionId);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResults(false);
      setIsQuizModalOpen(true);
      
      await trackEvent('section_quiz_started', {
        course_id: id,
        course_name: courseDetails?.theme.name,
        module_id: moduleId,
        section_id: sectionId,
        section_name: sectionName,
        question_count: section.questions.length,
      });
    } else {
      Alert.alert('No Quiz', 'This section does not have any quiz questions');
    }
  };

  // Toggle hamburger menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Quiz handlers
  const handleAnswerSelect = (questionId: number, optionId: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Show results
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateQuizResults = () => {
    let correctCount = 0;
    let totalQuestions = currentQuizQuestions.length;

    currentQuizQuestions.forEach(question => {
      const selectedAnswer = selectedAnswers[question.questionId];
      if (selectedAnswer === question.answer) {
        correctCount++;
      }
    });

    return {
      correctCount,
      totalQuestions,
      percentage: Math.round((correctCount / totalQuestions) * 100)
    };
  };

  const closeQuiz = () => {
    setIsQuizModalOpen(false);
    setCurrentQuizQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setQuizModuleId(null);
    setQuizSectionId(null);
  };

  const retakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  // Handle quiz navigation
  const handleQuizStart = async () => {
    await trackEvent('quiz_start_from_course', {
      course_id: id,
      course_name: courseDetails?.theme.name,
      theme_id: courseDetails?.themeId,
    });
    router.push(`/(tabs)/quiz`);
  };

  // Parse course data from params or fetch from API
  useEffect(() => {
    const courseId = Array.isArray(id) ? id[0] : id;
    
    if (courseId) {
      if (courseData && typeof courseData === 'string') {
        try {
          const parsedCourse = JSON.parse(courseData);
          setCourse(parsedCourse);
          fetchCourseDetails(courseId);
        } catch (error) {
          console.error('Error parsing course data:', error);
          fetchCourseDetails(courseId);
        }
      } else {
        fetchCourseDetails(courseId);
      }
    }
  }, [id, courseData]);

  // Get current selected module
  const selectedModule = processedModules.find(m => m.moduleId === selectedModuleId);

  // Handle PDF download/view
  const handleViewPdf = async () => {
    // Since PDF URLs are not available in the new API structure, 
    // we'll show a coming soon message for now
    Alert.alert('Coming Soon', 'Course materials will be available soon');
    
    await trackEvent('course_pdf_requested', {
      course_id: id,
      course_name: courseDetails?.theme.name,
    });
  };

  // Loading state
  if (loading) {
    return (
      <CommonLayout title="Loading..." showBackButton={true}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3D5CFF" />
          <Text style={styles.loadingText}>Loading course details...</Text>
        </View>
      </CommonLayout>
    );
  }

  // Error state - no course details found
  if (!courseDetails) {
    return (
      <CommonLayout title="Course Not Found" showBackButton={true}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Course not found or failed to load.</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              const courseId = Array.isArray(id) ? id[0] : id;
              if (courseId) fetchCourseDetails(courseId);
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout title={courseDetails.theme.name} showBackButton={true}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {/* Menu backdrop/overlay */}
          {isMenuOpen && (
            <TouchableOpacity
              style={styles.menuBackdrop}
              activeOpacity={1}
              onPress={toggleMenu}
            />
          )}

          {/* Collapsible Left side - Module List */}
          {isMenuOpen && (
            <View style={styles.modulesList}>
              <View style={styles.modulesHeader}>
                <Text style={styles.modulesTitle}>Course Modules</Text>
                <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <ScrollView showsVerticalScrollIndicator={false} style={styles.modulesScrollView}>
                {courseDetails.modules.map((module, index) => (
                  <View key={module.moduleId} style={styles.moduleContainer}>
                    {/* Module Header */}
                    <TouchableOpacity
                      style={[
                        styles.moduleItem,
                        selectedModuleId === module.moduleId && styles.moduleItemSelected,
                      ]}
                      onPress={() => {
                        const processedModule: ProcessedModule = {
                          moduleId: module.moduleId,
                          moduleName: module.moduleName,
                          moduleStatus: 1,
                          videoLink: module.moduleLink || null,
                          order: index + 1,
                          isCompleted: false,
                          timeTaken: '00:00:00',
                        };
                        handleModuleSelect(processedModule);
                      }}
                    >
                      <View style={styles.moduleInfo}>
                        <Text style={styles.moduleNumber}>
                          {String(index + 1).padStart(2, '0')}
                        </Text>
                        <View style={styles.moduleTextContainer}>
                          <Text
                            style={[
                              styles.moduleTitle,
                              selectedModuleId === module.moduleId && styles.moduleSelected,
                            ]}
                            numberOfLines={2}
                          >
                            {module.moduleName}
                          </Text>
                        </View>
                      </View>
                      
                      {/* Play button and expand button */}
                      <View style={styles.moduleActions}>
                        <TouchableOpacity
                          style={[
                            styles.playButton,
                            selectedModuleId === module.moduleId && styles.playButtonSelected,
                          ]}
                          onPress={() => {
                            const processedModule: ProcessedModule = {
                              moduleId: module.moduleId,
                              moduleName: module.moduleName,
                              moduleStatus: 1,
                              videoLink: module.moduleLink || null,
                              order: index + 1,
                              isCompleted: false,
                              timeTaken: '00:00:00',
                            };
                            handleModuleSelect(processedModule);
                          }}
                        >
                          <Ionicons 
                            name="play" 
                            size={16} 
                            color={selectedModuleId === module.moduleId ? "#fff" : "#3D5CFF"} 
                          />
                        </TouchableOpacity>
                        
                        {/* Expand button for sections */}
                        {module.sections && module.sections.length > 0 && (
                          <TouchableOpacity
                            style={styles.expandButton}
                            onPress={() => toggleModuleExpansion(module.moduleId)}
                          >
                            <Ionicons 
                              name={expandedModules.has(module.moduleId) ? "chevron-up" : "chevron-down"} 
                              size={16} 
                              color="#666" 
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </TouchableOpacity>

                    {/* Module Sections - Expandable */}
                    {expandedModules.has(module.moduleId) && module.sections && (
                      <View style={styles.sectionsContainer}>
                        {module.sections.map((section, sectionIndex) => (
                          <TouchableOpacity
                            key={section.sectionId || sectionIndex}
                            style={styles.sectionItem}
                            onPress={() => {
                              if (section.sectionId && section.sectionName) {
                                handleSectionSelect(module.moduleId, section.sectionId, section.sectionName);
                              }
                            }}
                          >
                            <View style={styles.sectionInfo}>
                              <Ionicons 
                                name="help-circle-outline" 
                                size={16} 
                                color="#3D5CFF" 
                              />
                              <Text style={styles.sectionName}>
                                {section.sectionName || `Section ${sectionIndex + 1}`}
                              </Text>
                              {section.questions && section.questions.length > 0 && (
                                <Text style={styles.questionCount}>
                                  ({section.questions.length} questions)
                                </Text>
                              )}
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#999" />
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>

              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={styles.pdfButton}
                  onPress={handleViewPdf}
                >
                  <Ionicons name="document-text-outline" size={16} color="#3D5CFF" />
                  <Text style={styles.pdfButtonText}>View PDF</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.quizButtonBottom}
                  onPress={handleQuizStart}
                >
                  <Ionicons name="help-circle-outline" size={16} color="#fff" />
                  <Text style={styles.quizButtonText}>Take Quiz</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Main Video Section */}
          <View style={[
            styles.videoSection, 
            isMenuOpen && styles.videoSectionWithMenu
          ]}>
            {selectedModule && selectedModule.videoLink ? (
              <View style={styles.videoContainer}>
                <View style={styles.videoHeader}>
                  <Text style={styles.videoTitle}>{selectedModule.moduleName}</Text>
                  <TouchableOpacity
                    style={styles.moduleInfoButton}
                    onPress={toggleMenu}
                  >
                    <Ionicons name="list" size={20} color="#3D5CFF" />
                    <Text style={styles.moduleInfoText}>Modules</Text>
                  </TouchableOpacity>
                </View>
                
                <WebView
                  source={{ uri: getEmbeddableYouTubeUrl(selectedModule.videoLink) || '' }}
                  style={styles.video}
                  allowsFullscreenVideo={true}
                  mediaPlaybackRequiresUserAction={false}
                />
                
                {/* Module Progress Info */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressRow}>
                    <Text style={styles.progressLabel}>Status:</Text>
                    <View style={styles.statusContainer}>
                      <View style={[
                        styles.statusDot,
                        { backgroundColor: selectedModule.isCompleted ? '#4CAF50' : '#FF9800' }
                      ]} />
                      <Text style={styles.statusText}>
                        {selectedModule.isCompleted ? 'Completed' : 'In Progress'}
                      </Text>
                    </View>
                  </View>
                  
                  {selectedModule.isCompleted && (
                    <View style={styles.progressRow}>
                      <Text style={styles.progressLabel}>Time taken:</Text>
                      <Text style={styles.timeTaken}>{selectedModule.timeTaken}</Text>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.noVideoContainer}>
                <Ionicons name="play-circle-outline" size={64} color="#A0A0B2" />
                <Text style={styles.noVideoText}>
                  {selectedModule ? 'No video available for this module' : 'Select a module to start learning'}
                </Text>
                <TouchableOpacity
                  style={styles.selectModuleButton}
                  onPress={toggleMenu}
                >
                  <Ionicons name="list" size={20} color="#3D5CFF" />
                  <Text style={styles.selectModuleText}>Browse Modules</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Quiz Modal */}
      <Modal
        visible={isQuizModalOpen}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.quizModalContainer}>
          {/* Quiz Header */}
          <View style={styles.quizHeader}>
            <TouchableOpacity onPress={closeQuiz} style={styles.closeQuizButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.quizTitle}>Section Quiz</Text>
            <View style={styles.quizProgress}>
              <Text style={styles.quizProgressText}>
                {showResults ? 'Results' : `${currentQuestionIndex + 1}/${currentQuizQuestions.length}`}
              </Text>
            </View>
          </View>

          {showResults ? (
            // Quiz Results
            <View style={styles.quizResultsContainer}>
              <ScrollView contentContainerStyle={styles.quizResultsContent}>
                <View style={styles.quizScoreCard}>
                  <Ionicons 
                    name={calculateQuizResults().percentage >= 70 ? "checkmark-circle" : "close-circle"} 
                    size={64} 
                    color={calculateQuizResults().percentage >= 70 ? "#4CAF50" : "#FF5722"} 
                  />
                  <Text style={styles.quizScoreText}>
                    {calculateQuizResults().correctCount}/{calculateQuizResults().totalQuestions}
                  </Text>
                  <Text style={styles.quizPercentageText}>
                    {calculateQuizResults().percentage}% Correct
                  </Text>
                  <Text style={styles.quizResultMessage}>
                    {calculateQuizResults().percentage >= 70 
                      ? "Great job! You passed the quiz." 
                      : "Keep studying and try again."}
                  </Text>
                </View>

                {/* Detailed Results */}
                <View style={styles.quizDetailedResults}>
                  <Text style={styles.detailedResultsTitle}>Detailed Results</Text>
                  {currentQuizQuestions.map((question, index) => {
                    const selectedAnswer = selectedAnswers[question.questionId];
                    const isCorrect = selectedAnswer === question.answer;
                    const selectedOption = question.options.find(opt => opt.optionId === selectedAnswer);
                    const correctOption = question.options.find(opt => opt.optionId === question.answer);

                    return (
                      <View key={question.questionId} style={styles.resultQuestionCard}>
                        <Text style={styles.resultQuestionNumber}>Question {index + 1}</Text>
                        <Text style={styles.resultQuestionText}>{question.questionText}</Text>
                        
                        <View style={styles.resultAnswerSection}>
                          <View style={[styles.answerResult, isCorrect ? styles.correctAnswer : styles.incorrectAnswer]}>
                            <Ionicons 
                              name={isCorrect ? "checkmark-circle" : "close-circle"} 
                              size={16} 
                              color={isCorrect ? "#4CAF50" : "#FF5722"} 
                            />
                            <Text style={styles.answerResultText}>
                              Your answer: {selectedOption?.optionText || 'Not answered'}
                            </Text>
                          </View>
                          
                          {!isCorrect && (
                            <View style={[styles.answerResult, styles.correctAnswer]}>
                              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                              <Text style={styles.answerResultText}>
                                Correct answer: {correctOption?.optionText}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>

                <View style={styles.quizResultActions}>
                  <TouchableOpacity style={styles.retakeQuizButton} onPress={retakeQuiz}>
                    <Ionicons name="refresh" size={16} color="#3D5CFF" />
                    <Text style={styles.retakeQuizText}>Retake Quiz</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.closeQuizResultButton} onPress={closeQuiz}>
                    <Text style={styles.closeQuizResultText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          ) : (
            // Quiz Questions
            <View style={styles.quizContent}>
              {currentQuizQuestions.length > 0 && (
                <ScrollView style={styles.questionContainer}>
                  <View style={styles.questionCard}>
                    <Text style={styles.questionNumber}>
                      Question {currentQuestionIndex + 1}
                    </Text>
                    <Text style={styles.questionText}>
                      {currentQuizQuestions[currentQuestionIndex].questionText}
                    </Text>
                    
                    <View style={styles.optionsContainer}>
                      {currentQuizQuestions[currentQuestionIndex].options.map((option) => {
                        const isSelected = selectedAnswers[currentQuizQuestions[currentQuestionIndex].questionId] === option.optionId;
                        
                        return (
                          <TouchableOpacity
                            key={option.optionId}
                            style={[
                              styles.optionButton,
                              isSelected && styles.selectedOption
                            ]}
                            onPress={() => handleAnswerSelect(currentQuizQuestions[currentQuestionIndex].questionId, option.optionId)}
                          >
                            <View style={[
                              styles.optionRadio,
                              isSelected && styles.selectedOptionRadio
                            ]}>
                              {isSelected && (
                                <View style={styles.optionRadioInner} />
                              )}
                            </View>
                            <Text style={[
                              styles.optionText,
                              isSelected && styles.selectedOptionText
                            ]}>
                              {option.optionText}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </ScrollView>
              )}

              {/* Quiz Navigation */}
              <View style={styles.quizNavigation}>
                <TouchableOpacity 
                  style={[
                    styles.quizNavButton, 
                    styles.prevButton,
                    currentQuestionIndex === 0 && styles.disabledButton
                  ]}
                  onPress={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <Ionicons name="chevron-back" size={20} color={currentQuestionIndex === 0 ? "#ccc" : "#3D5CFF"} />
                  <Text style={[
                    styles.quizNavButtonText,
                    currentQuestionIndex === 0 && styles.disabledButtonText
                  ]}>
                    Previous
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[
                    styles.quizNavButton, 
                    styles.nextButton,
                    !selectedAnswers[currentQuizQuestions[currentQuestionIndex]?.questionId] && styles.disabledButton
                  ]}
                  onPress={handleNextQuestion}
                  disabled={!selectedAnswers[currentQuizQuestions[currentQuestionIndex]?.questionId]}
                >
                  <Text style={[
                    styles.quizNavButtonText,
                    !selectedAnswers[currentQuizQuestions[currentQuestionIndex]?.questionId] && styles.disabledButtonText
                  ]}>
                    {currentQuestionIndex === currentQuizQuestions.length - 1 ? 'Finish Quiz' : 'Next'}
                  </Text>
                  <Ionicons 
                    name={currentQuestionIndex === currentQuizQuestions.length - 1 ? "checkmark" : "chevron-forward"} 
                    size={20} 
                    color={!selectedAnswers[currentQuizQuestions[currentQuestionIndex]?.questionId] ? "#ccc" : "#fff"} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </CommonLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#3D5CFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Main layout
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  // Menu backdrop
  menuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },

  // Left side - Modules list (collapsible)
  modulesList: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modulesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modulesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D0D26',
  },
  closeButton: {
    padding: 4,
  },
  modulesScrollView: {
    flex: 1,
  },
  moduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  moduleItemSelected: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#3D5CFF',
  },
  moduleContainer: {
    marginBottom: 8,
  },
  moduleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expandButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#F0F0F0',
  },
  
  // Sections styles
  sectionsContainer: {
    marginLeft: 42, // Align with module text
    marginTop: 8,
    paddingLeft: 16,
    borderLeftWidth: 2,
    borderLeftColor: '#E0E0E0',
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  sectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionName: {
    fontSize: 13,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
    flex: 1,
  },
  questionCount: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  moduleInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A0A0B2',
    width: 30,
  },
  moduleTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  moduleTitle: {
    fontSize: 14,
    color: '#0D0D26',
    fontWeight: '500',
    lineHeight: 18,
  },
  moduleSelected: {
    color: '#3D5CFF',
    fontWeight: '600',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  completedText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
    fontWeight: '500',
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: '#3D5CFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonSelected: {
    backgroundColor: '#3D5CFF',
    borderColor: '#3D5CFF',
  },

  // Action buttons
  actionButtonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    gap: 8,
  },
  pdfButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3D5CFF',
  },
  pdfButtonText: {
    color: '#3D5CFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  quizButtonBottom: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3D5CFF',
    paddingVertical: 12,
    borderRadius: 8,
  },
  quizButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },

  // Main Video Section
  videoSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  videoSectionWithMenu: {
    marginLeft: 8,
  },
  videoContainer: {
    flex: 1,
    padding: 16,
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D0D26',
    flex: 1,
    lineHeight: 24,
  },
  moduleInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3D5CFF',
  },
  moduleInfoText: {
    color: '#3D5CFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  video: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 200,
  },
  noVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noVideoText: {
    fontSize: 16,
    color: '#A0A0B2',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  selectModuleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3D5CFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  selectModuleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Progress section
  progressContainer: {
    marginTop: 16,
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    width: 80,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  timeTaken: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },

  // Legacy styles (kept for compatibility)
  headerContainer: {
    position: 'relative',
    backgroundColor: '#fff',
  },
  headerImage: {
    width: width,
    height: 220,
  },
  overlayPanel: {
    backgroundColor: '#fff',
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 50,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D0D26',
    marginBottom: 12,
    lineHeight: 24,
  },
  courseDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
  },
  actionButtons: {
    marginBottom: 30,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3D5CFF',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3D5CFF',
  },
  secondaryButtonText: {
    color: '#3D5CFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusSection: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#6B7280',
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  topicNumber: {
    color: '#A0A0B2',
    fontWeight: 'bold',
    width: 30,
    fontSize: 16,
  },
  topicText: {
    flex: 1,
    color: '#0D0D26',
    fontSize: 14,
  },
  videoContainerLegacy: {
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    height: 200,
  },
  quizButton: {
    marginTop: 30,
    backgroundColor: '#3D5CFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  // Quiz Modal Styles
  quizModalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeQuizButton: {
    padding: 8,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D0D26',
  },
  quizProgress: {
    backgroundColor: '#3D5CFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  quizProgressText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Quiz Content
  quizContent: {
    flex: 1,
  },
  questionContainer: {
    flex: 1,
    padding: 16,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 14,
    color: '#3D5CFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    color: '#0D0D26',
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#E3F2FD',
    borderColor: '#3D5CFF',
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOptionRadio: {
    borderColor: '#3D5CFF',
  },
  optionRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3D5CFF',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  selectedOptionText: {
    color: '#3D5CFF',
    fontWeight: '600',
  },
  
  // Quiz Navigation
  quizNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  quizNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  prevButton: {
    backgroundColor: '#F8F9FA',
  },
  nextButton: {
    backgroundColor: '#3D5CFF',
  },
  disabledButton: {
    backgroundColor: '#F0F0F0',
  },
  quizNavButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 4,
  },
  disabledButtonText: {
    color: '#ccc',
  },
  
  // Quiz Results
  quizResultsContainer: {
    flex: 1,
  },
  quizResultsContent: {
    padding: 16,
  },
  quizScoreCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  quizScoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0D0D26',
    marginTop: 16,
  },
  quizPercentageText: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
  },
  quizResultMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 12,
  },
  quizDetailedResults: {
    marginBottom: 20,
  },
  detailedResultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D0D26',
    marginBottom: 16,
  },
  resultQuestionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resultQuestionNumber: {
    fontSize: 14,
    color: '#3D5CFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  resultQuestionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
  resultAnswerSection: {
    gap: 8,
  },
  answerResult: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  correctAnswer: {
    backgroundColor: '#E8F5E8',
  },
  incorrectAnswer: {
    backgroundColor: '#FFE8E8',
  },
  answerResultText: {
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  quizResultActions: {
    flexDirection: 'row',
    gap: 12,
  },
  retakeQuizButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3D5CFF',
  },
  retakeQuizText: {
    color: '#3D5CFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  closeQuizResultButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3D5CFF',
    paddingVertical: 14,
    borderRadius: 8,
  },
  closeQuizResultText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
