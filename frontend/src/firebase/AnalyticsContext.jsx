import React, { createContext, useContext } from 'react';
import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

const AnalyticsContext = createContext(null);

export const AnalyticsProvider = ({ children }) => {
  console.log('AnalyticsProvider rendered');
  const logCustomEvent = (eventName, params = {}) => {
    logEvent(analytics, eventName, params);
  };

  return (
    <AnalyticsContext.Provider value={{ analytics, logCustomEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAppAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAppAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
