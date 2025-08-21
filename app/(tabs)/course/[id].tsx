import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
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

interface QuizThemeIcon {
  id: number;
  name: string;
  description: string;
  url: string;
  image_path: string;
  status: number;
  quizId: number;
  quizname: string;
  moduleId: number;
  moduleName: string;
  link: string;
  order: number;
  Modulepdf: string | null;
  moduleStatus: number;
  sectionId: number | null;
  sectionName: string | null;
  sectionVideos: string | null;
  sectionorder: number | null;
  sectionStatus: number | null;
}

interface GroupedModule {
  moduleId: number;
  moduleName: string;
  moduleStatus: number;
  sections: any[];
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
    quizz_themeicon: QuizThemeIcon[];
    groupedModules: GroupedModule[];
    moduleProgress: ModuleProgress[];
    sectionProgress: any[];
    user_quizzes: any;
    themeId: string;
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
  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [courseDetails, setCourseDetails] = useState<CourseApiResponse['data'] | null>(null);
  const [processedModules, setProcessedModules] = useState<ProcessedModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
    const { groupedModules, quizz_themeicon, moduleProgress } = data;
    
    return groupedModules.map((module) => {
      // Find the video link for this module
      const moduleWithVideo = quizz_themeicon.find(
        (item) => item.moduleId === module.moduleId
      );
      
      // Find progress for this module
      const progress = moduleProgress.find(
        (prog) => prog.module_id === module.moduleId && prog.section_id === null
      );
      
      return {
        moduleId: module.moduleId,
        moduleName: module.moduleName,
        moduleStatus: module.moduleStatus,
        videoLink: moduleWithVideo?.link || null,
        order: moduleWithVideo?.order || module.moduleId,
        isCompleted: progress?.is_completed === 'COMPLETED',
        timeTaken: progress?.time_taken || '00:00:00',
      };
    }).sort((a, b) => a.order - b.order);
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

  // Toggle hamburger menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle quiz navigation
  const handleQuizStart = async () => {
    await trackEvent('quiz_start_from_course', {
      course_id: id,
      course_name: courseDetails?.theme.name,
      quiz_id: courseDetails?.quizz_themeicon[0]?.quizId,
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
    if (courseDetails?.quizz_themeicon[0]?.url && courseDetails.quizz_themeicon[0].url !== 'https://apshwp.ap.gov.in/storage/') {
      try {
        await trackEvent('course_pdf_opened', {
          course_id: id,
          course_name: courseDetails.theme.name,
        });
        await WebBrowser.openBrowserAsync(courseDetails.quizz_themeicon[0].url);
      } catch (error) {
        Alert.alert('Error', 'Could not open the course material');
      }
    } else {
      Alert.alert('Coming Soon', 'This course material will be available soon');
    }
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
        {/* Hamburger Menu Button */}
        <TouchableOpacity
          style={styles.hamburgerButton}
          onPress={toggleMenu}
        >
          <Ionicons 
            name={isMenuOpen ? "close" : "menu"} 
            size={24} 
            color="#3D5CFF" 
          />
          <Text style={styles.hamburgerText}>
            {isMenuOpen ? "Close Menu" : "Course Modules"}
          </Text>
        </TouchableOpacity>

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
                  <Ionicons name="chevron-back" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              
              <ScrollView showsVerticalScrollIndicator={false} style={styles.modulesScrollView}>
                {processedModules.map((module, index) => (
                  <TouchableOpacity
                    key={module.moduleId}
                    style={[
                      styles.moduleItem,
                      selectedModuleId === module.moduleId && styles.moduleItemSelected,
                    ]}
                    onPress={() => handleModuleSelect(module)}
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
                        {module.isCompleted && (
                          <View style={styles.completedBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                            <Text style={styles.completedText}>Completed</Text>
                          </View>
                        )}
                      </View>
                    </View>
                    
                    {/* Play button */}
                    <View style={[
                      styles.playButton,
                      selectedModuleId === module.moduleId && styles.playButtonSelected,
                    ]}>
                      <Ionicons 
                        name="play" 
                        size={16} 
                        color={selectedModuleId === module.moduleId ? "#fff" : "#3D5CFF"} 
                      />
                    </View>
                  </TouchableOpacity>
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
                  {/* <TouchableOpacity
                    style={styles.moduleInfoButton}
                    onPress={toggleMenu}
                  >
                    <Ionicons name="list" size={20} color="#3D5CFF" />
                    <Text style={styles.moduleInfoText}>Modules</Text>
                  </TouchableOpacity> */}
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

  // Hamburger menu button
  hamburgerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  hamburgerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D5CFF',
    marginLeft: 8,
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
});
