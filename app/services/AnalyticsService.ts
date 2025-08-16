import analytics from '@react-native-firebase/analytics';

class AnalyticsService {
  // Initialize analytics (optional - it's initialized automatically)
  async initialize() {
    try {
      await analytics().setAnalyticsCollectionEnabled(true);
      console.log('Analytics initialized successfully');
    } catch (error) {
      console.error('Error initializing analytics:', error);
    }
  }

  // Set user ID
  async setUserId(userId: string) {
    try {
      await analytics().setUserId(userId);
      console.log('User ID set:', userId);
    } catch (error) {
      console.error('Error setting user ID:', error);
    }
  }

  // Set user properties
  async setUserProperty(name: string, value: string) {
    try {
      await analytics().setUserProperty(name, value);
      console.log(`User property set: ${name} = ${value}`);
    } catch (error) {
      console.error('Error setting user property:', error);
    }
  }

  // Log screen view
  async logScreenView(screenName: string, screenClass?: string) {
    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
      console.log('Screen view logged:', screenName);
    } catch (error) {
      console.error('Error logging screen view:', error);
    }
  }

  // Log custom event
  async logEvent(eventName: string, parameters?: { [key: string]: any }) {
    try {
      await analytics().logEvent(eventName, parameters);
      console.log('Event logged:', eventName, parameters);
    } catch (error) {
      console.error('Error logging event:', error);
    }
  }

  // Predefined events for your app
  async logLogin(method: string = 'email') {
    await this.logEvent('login', { method });
  }

  async logSignUp(method: string = 'email') {
    await this.logEvent('sign_up', { method });
  }

  async logQuizStart(quizId: string, quizName: string) {
    await this.logEvent('quiz_start', {
      quiz_id: quizId,
      quiz_name: quizName,
    });
  }

  async logQuizComplete(quizId: string, quizName: string, score: number, totalQuestions: number) {
    await this.logEvent('quiz_complete', {
      quiz_id: quizId,
      quiz_name: quizName,
      score: score,
      total_questions: totalQuestions,
      accuracy: (score / totalQuestions) * 100,
    });
  }

  async logCourseView(courseId: string, courseName: string) {
    await this.logEvent('course_view', {
      course_id: courseId,
      course_name: courseName,
    });
  }

  async logVideoPlay(videoId: string, videoName: string) {
    await this.logEvent('video_play', {
      video_id: videoId,
      video_name: videoName,
    });
  }

  async logShare(contentType: string, contentId: string) {
    await this.logEvent('share', {
      content_type: contentType,
      content_id: contentId,
    });
  }

  async logSearch(searchTerm: string) {
    await this.logEvent('search', {
      search_term: searchTerm,
    });
  }
}

export default new AnalyticsService();
