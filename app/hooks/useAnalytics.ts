import analytics from '@react-native-firebase/analytics';

export const useAnalytics = () => {
  // Track custom events
  const trackEvent = async (eventName: string, parameters?: any) => {
    try {
      await analytics().logEvent(eventName, parameters);
      console.log(`Analytics: ${eventName}`, parameters);
    } catch (error) {
      console.error('Analytics trackEvent error:', error);
    }
  };

  // Track screen views (if you need manual tracking)
  const trackScreenView = async (screenName: string, screenClass?: string) => {
    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
      console.log(`Analytics: Screen view - ${screenName}`);
    } catch (error) {
      console.error('Analytics trackScreenView error:', error);
    }
  };

  // Track login
  const trackLogin = async (method = 'email') => {
    try {
      await analytics().logLogin({ method });
      console.log(`Analytics: Login with ${method}`);
    } catch (error) {
      console.error('Analytics trackLogin error:', error);
    }
  };

  // Track signup
  const trackSignUp = async (method = 'email') => {
    try {
      await analytics().logSignUp({ method });
      console.log(`Analytics: Sign up with ${method}`);
    } catch (error) {
      console.error('Analytics trackSignUp error:', error);
    }
  };

  // Track quiz events
  const trackQuizStart = async (quizId: string, quizName?: string) => {
    try {
      await analytics().logEvent('quiz_start', {
        quiz_id: quizId,
        quiz_name: quizName,
      });
      console.log(`Analytics: Quiz started - ${quizId}`);
    } catch (error) {
      console.error('Analytics trackQuizStart error:', error);
    }
  };

  const trackQuizComplete = async (quizId: string, score: number, totalQuestions: number) => {
    try {
      await analytics().logEvent('quiz_complete', {
        quiz_id: quizId,
        score,
        total_questions: totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
      });
      console.log(`Analytics: Quiz completed - ${quizId}, Score: ${score}/${totalQuestions}`);
    } catch (error) {
      console.error('Analytics trackQuizComplete error:', error);
    }
  };

  // Track course events
  const trackCourseStart = async (courseId: string, courseName?: string) => {
    try {
      await analytics().logEvent('course_start', {
        course_id: courseId,
        course_name: courseName,
      });
      console.log(`Analytics: Course started - ${courseId}`);
    } catch (error) {
      console.error('Analytics trackCourseStart error:', error);
    }
  };

  const trackCourseComplete = async (courseId: string, courseName?: string) => {
    try {
      await analytics().logEvent('course_complete', {
        course_id: courseId,
        course_name: courseName,
      });
      console.log(`Analytics: Course completed - ${courseId}`);
    } catch (error) {
      console.error('Analytics trackCourseComplete error:', error);
    }
  };

  // Track user engagement
  const trackButtonPress = async (buttonName: string, screenName?: string) => {
    try {
      await analytics().logEvent('button_press', {
        button_name: buttonName,
        screen_name: screenName,
      });
      console.log(`Analytics: Button pressed - ${buttonName}`);
    } catch (error) {
      console.error('Analytics trackButtonPress error:', error);
    }
  };

  // Track search
  const trackSearch = async (searchTerm: string, resultCount?: number) => {
    try {
      await analytics().logEvent('search', {
        search_term: searchTerm,
        result_count: resultCount,
      });
      console.log(`Analytics: Search - ${searchTerm}`);
    } catch (error) {
      console.error('Analytics trackSearch error:', error);
    }
  };

  // Set user properties
  const setUserProperty = async (name: string, value: string) => {
    try {
      await analytics().setUserProperty(name, value);
      console.log(`Analytics: User property set - ${name}: ${value}`);
    } catch (error) {
      console.error('Analytics setUserProperty error:', error);
    }
  };

  // Set user ID
  const setUserId = async (userId: string) => {
    try {
      await analytics().setUserId(userId);
      console.log(`Analytics: User ID set - ${userId}`);
    } catch (error) {
      console.error('Analytics setUserId error:', error);
    }
  };

  return {
    trackEvent,
    trackScreenView,
    trackLogin,
    trackSignUp,
    trackQuizStart,
    trackQuizComplete,
    trackCourseStart,
    trackCourseComplete,
    trackButtonPress,
    trackSearch,
    setUserProperty,
    setUserId,
  };
};
