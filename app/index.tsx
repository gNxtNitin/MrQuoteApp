import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/features/splashScreen/SplashScreen';
import { LoginScreen } from './components/features/login/LoginScreen';
import { useDatabase } from './hooks/useDatabase';
import ErrorScreen from './components/ErrorScreen';
import { useAuth } from './hooks/useAuth';
import { useRouter } from 'expo-router';
import { authService } from './services/auth/authService';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { db, dbLoading, error } = useDatabase();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const initApp = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);

      if (user) {
        const hasPin = await authService.checkPin(user.id!);
        if (hasPin) {
          router.replace('/pin');
        } else {
          router.replace('/setpin');
        }
      } else {
        router.replace('/login');
      }
    };

    if (!dbLoading && !authLoading) {
      initApp();
    }
  }, [dbLoading, authLoading, user]);

  if (isLoading || dbLoading || authLoading) {
    return <SplashScreen />;
  }
  
  if (error) {
    return <ErrorScreen message="Your database is not initialized properly. Please restart the app."/>;
  }

  return null;
} 
