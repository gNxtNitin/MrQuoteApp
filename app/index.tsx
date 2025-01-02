import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/features/splashScreen/SplashScreen';
import { LoginScreen } from './components/features/login/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeScreen } from './components/features/home/HomeScreen';
import { EstimateDetails } from './components/features/estimate/EstimateDetails';
import { EstimateScreen } from './components/features/estimate/EstimateScreen';
import { useDatabase } from './hooks/useDatabase';
import ErrorScreen from './components/ErrorScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { db, dbLoading, error } = useDatabase();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  if (isLoading || dbLoading) {
    return <SplashScreen />;
  }
  
  if (error) {
    return <ErrorScreen message="Your database is not initialized properly. Please restart the app."/>;
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} isDarkMode={false} />;
  }

  return <HomeScreen />;
} 
