import { useEffect } from 'react';
import AnalyticsService from '../services/AnalyticsService';

// Hook for tracking screen views automatically
export const useAnalyticsScreenView = (screenName: string, screenClass?: string) => {
  useEffect(() => {
    AnalyticsService.logScreenView(screenName, screenClass);
  }, [screenName, screenClass]);
};

// Hook for tracking user sessions
export const useAnalyticsUser = (userId?: string, userProperties?: { [key: string]: string }) => {
  useEffect(() => {
    if (userId) {
      AnalyticsService.setUserId(userId);
    }
    
    if (userProperties) {
      Object.entries(userProperties).forEach(([key, value]) => {
        AnalyticsService.setUserProperty(key, value);
      });
    }
  }, [userId, userProperties]);
};

export { AnalyticsService };

