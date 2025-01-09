import { openDatabase } from '../database/init';
import { UserDetail, UserDetailData } from '../../database/models/UserDetail';
import { User } from '../../database/models/User';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CURRENT_USER_KEY = '@user_id';
const PIN_ATTEMPTS_KEY = '@pin_attempts';
const MAX_PIN_ATTEMPTS = 3;

interface LoginResponse {
  success: boolean;
  message: string;
  user?: UserDetailData;
  requiresPin?: boolean;
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const user = await UserDetail.findByCredentials(username, password);
      
      if (!user || !user.id) {
        return {
          success: false,
          message: 'Invalid username or password'
        };
      }

      // Update login status
      await UserDetail.update(user.id, {
        is_logged_in: true,
        last_login_at: new Date().toISOString()
      });

      // Store current user
      await AsyncStorage.setItem(CURRENT_USER_KEY, user.id.toString());

      return {
        success: true,
        message: 'Login successful',
        user
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login'
      };
    }
  },

  loginWithPin: async (pin: number): Promise<LoginResponse> => {
    try {
      // Check PIN attempts
      const attempts = await AsyncStorage.getItem(PIN_ATTEMPTS_KEY);
      const pinAttempts = attempts ? parseInt(attempts) : 0;

      if (pinAttempts >= MAX_PIN_ATTEMPTS) {
        return {
          success: false,
          message: 'Too many failed attempts. Please login with password click on reset pin.'
        };
      }

      const user = await UserDetail.findByPin(pin);
      
      if (!user || !user.id) {
        // Increment failed attempts
        await AsyncStorage.setItem(PIN_ATTEMPTS_KEY, (pinAttempts + 1).toString());
        return {
          success: false,
          message: 'Invalid PIN'
        };
      }

      // Reset PIN attempts on success
      await AsyncStorage.removeItem(PIN_ATTEMPTS_KEY);

      // Update login status
      await UserDetail.update(user.id, {
        is_logged_in: true,
        last_login_at: new Date().toISOString()
      });

      await AsyncStorage.setItem(CURRENT_USER_KEY, user.id.toString());

      return {
        success: true,
        message: 'Login successful',
        user
      };
    } catch (error) {
      console.error('PIN login error:', error);
      return {
        success: false,
        message: 'An error occurred during PIN login'
      };
    }
  },

  setupPin: async (userId: number, pin: number): Promise<boolean> => {
    try {
      await UserDetail.update(userId, { pin });
      return true;
    } catch (error) {
      console.error('PIN setup error:', error);
      return false;
    }
  },

  getCurrentUser: async () => {
    try {
      const userId = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (!userId) return null;

      return await UserDetail.getById(parseInt(userId));
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  logout: async () => {
    try {
      const userId = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (userId) {
        // Clear PIN and logged in status
        await UserDetail.update(parseInt(userId), { 
          is_logged_in: false,
        });
        // Remove stored user ID
        await AsyncStorage.removeItem(CURRENT_USER_KEY);
        // Remove PIN attempts
        await AsyncStorage.removeItem(PIN_ATTEMPTS_KEY);
      }
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }
}; 