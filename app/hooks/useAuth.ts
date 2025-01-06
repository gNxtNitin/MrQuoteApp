import { useState, useEffect } from 'react';
import { authService } from '../services/auth/authService';
import { UserDetailData } from '../database/models/UserDetail';
import { useRouter } from 'expo-router';

export function useAuth() {
  const [user, setUser] = useState<UserDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const response = await authService.login(username, password);
    if (response.success && !response.requiresPin && response.user) {
      setUser(response.user);
    }
    return response;
  };

  const loginWithPin = async (pin: number) => {
    const response = await authService.loginWithPin(pin);
    if (response.success && response.user) {
      setUser(response.user);
    }
    return response;
  };

  const setupPin = async (userId: number, pin: number) => {
    const success = await authService.setupPin(userId, pin);
    if (success) {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    }
    return success;
  };

  const logout = async () => {
    try {
      const success = await authService.logout();
      if (success) {
        setUser(null);
        router.replace('/login');
      }
      return success;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  return {
    user,
    loading,
    login,
    loginWithPin,
    setupPin,
    logout
  };
}
