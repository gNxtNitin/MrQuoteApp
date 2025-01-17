import { openDatabase } from '../database/init';
import { UserDetail, UserDetailData } from '../../database/models/UserDetail';
import { User } from '../../database/models/User';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '@/app/constants/api';
import { syncService } from '../sync/syncService';

const CURRENT_USER_KEY = '@user_id';
const PIN_ATTEMPTS_KEY = '@pin_attempts';
const MAX_PIN_ATTEMPTS = 5;

interface LoginResponse {
  success: boolean;
  message: string;
  user?: UserDetailData;
  requiresPin?: boolean;
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const isOnline = await apiClient.isOnline();

      console.log('isOnline', isOnline);
      // if (isOnline) {
      //   console.log('Attempting online login...');
      //   const response = await apiClient.post<UserDetailData>(API_ENDPOINTS.LOGIN, {
      //     username: username,
      //     password: password,
      //   });
      //   // console.log('response from login', response);

      //   if (response.success && response.dataResponse) {
      //     try {
      //       // Store the auth token
      //       if (response.token) {
      //         await AsyncStorage.setItem('auth_token', response.token);
      //       }

      //       // Sync the data from API response
      //       await syncService.syncLoginData(response.dataResponse);

      //       // Get the user data
      //       const user = response.data;
      //       if (!user || !user.id) {
      //         throw new Error('Invalid user data received');
      //       }

      //       console.log('User data from API:', user);
            
      //       // Update local user state
      //       await AsyncStorage.setItem(CURRENT_USER_KEY, user.id.toString());
      //       await UserDetail.update(user.id, {
      //         is_logged_in: true,
      //         last_login_at: new Date().toISOString(),
      //       });

      //       return {
      //         success: true,
      //         message: 'Login successful',
      //         user,
      //       };
      //     } catch (syncError) {
      //       console.error('Error during data sync:', syncError);
      //       // Fall back to offline login if sync fails
      //       return await performOfflineLogin(username, password);
      //     }
      //   } else {
      //     console.log('Online login failed, trying offline login');
      //     return await performOfflineLogin(username, password);
      //   }
      // } else {
      //   console.log('Offline login checking user');
      // }

      // If offline, try offline login
      return await performOfflineLogin(username, password);
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
      // Get current user ID
      const userId = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (!userId) {
        return {
          success: false,
          message: 'Please login with username and password'
        };
      }

      // Check PIN attempts
      const attempts = await AsyncStorage.getItem(PIN_ATTEMPTS_KEY);
      const pinAttempts = attempts ? parseInt(attempts) : 0;

      if (pinAttempts >= MAX_PIN_ATTEMPTS) {
        return {
          success: false,
          message: 'Too many failed attempts. Please login with password click on reset pin.'
        };
      }

      // Find user by ID and verify PIN
      const user = await UserDetail.findByPinAndId(pin, parseInt(userId));
      
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

async function performOfflineLogin(username: string, password: string): Promise<LoginResponse> {
  // const encryptedPassword = await encrypt(password);
  // console.log('encryptedPassword', encryptedPassword);
  const user = await UserDetail.findByCredentials(username, password);
  console.log('Offline login attempt for user:', user);
  
  if (!user || !user.id) {
    return {
      success: false,
      message: 'Invalid credentials (Offline Mode)'
    };
  }

  await AsyncStorage.setItem(CURRENT_USER_KEY, user.id.toString());
  await UserDetail.update(user.id, {
    is_logged_in: true,
    last_login_at: new Date().toISOString()
  });

  return {
    success: true,
    message: 'Login successful (Offline Mode)',
    user
  };
} 