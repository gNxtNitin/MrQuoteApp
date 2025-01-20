import { openDatabase } from '../database/init';
import { UserDetail, UserDetailData } from '../../database/models/UserDetail';
import { User } from '../../database/models/User';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/client';
import { API_ENDPOINTS } from '@/app/constants/api';
import { syncEstimateData, syncService } from '../sync/syncService';

const CURRENT_USER_KEY = '@user_id';
const PIN_ATTEMPTS_KEY = '@pin_attempts';
const MAX_PIN_ATTEMPTS = 5;

interface LoginResponse {
  success: boolean;
  message: string;
  user?: UserDetailData;
  requiresPin?: boolean;
  hasPin?: boolean;
}

async function performOfflineLogin(username: string, password: string, status: string, offlineUser: UserDetailData | null): Promise<LoginResponse> {
  // const offlineUser = await UserDetail.findByCredentials(username, "4SD4gzWOX9OfEdba9/7fRg==");
      
  console.log('offlineUser', offlineUser);
  // If user exists offline, return the user
  if (offlineUser && offlineUser.id) {
    console.log('User found in offline database');
    const hasPin = offlineUser.pin != null && offlineUser.pin !== undefined;
    console.log(`hasPin (${status}):`, hasPin);

    await AsyncStorage.setItem(CURRENT_USER_KEY, offlineUser.id.toString());
    await UserDetail.update(offlineUser.id, {
      is_logged_in: true,
      last_login_at: new Date().toISOString()
    });

    return {
      success: true,
      message: `Login successful (${status} Mode)`,
      user: offlineUser,
      hasPin
    } as LoginResponse;
  } else {
    return {
      success: false,
      message: `User not found!`
    } as LoginResponse;
  }
}


export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      // First try offline login
      const offlineUser = await UserDetail.findByCredentials(username, "4SD4gzWOX9OfEdba9/7fRg==");
      
      console.log('offlineUser', offlineUser);
      // If user exists offline, return the user
      if (offlineUser && offlineUser.id) {
        const response = await performOfflineLogin(username, password, 'offline', offlineUser);
      
        await syncEstimateData.insertSampleEstimates();
        return response;
        // console.log('User found in offline database');
        // const hasPin = offlineUser.pin != null && offlineUser.pin !== undefined;
        // console.log('hasPin (offline):', hasPin);

        // await AsyncStorage.setItem(CURRENT_USER_KEY, offlineUser.id.toString());
        // await UserDetail.update(offlineUser.id, {
        //   is_logged_in: true,
        //   last_login_at: new Date().toISOString()
        // });

        // return {
        //   success: true,
        //   message: 'Login successful (Offline Mode)',
        //   user: offlineUser,
        //   hasPin
        // };
      }

      // If user not found offline, try online login
      const isOnline = await apiClient.isOnline();
      console.log('isOnline:', isOnline);

      if (isOnline) {
        console.log('Attempting online login...');
        const response = await apiClient.post<UserDetailData>(API_ENDPOINTS.LOGIN, {
          username: username,
          password: password,
        });

        if (response.success && response.dataResponse) {
          try {
            // Store the auth token
            if (response.token) {
              await AsyncStorage.setItem('auth_token', response.token);
            }

            // Sync the data from API response
            await syncService.syncLoginData(response.dataResponse);
            const offlineUser = await UserDetail.findByCredentials(username, "4SD4gzWOX9OfEdba9/7fRg==");
      
            console.log('offlineUser', offlineUser);
            // If user exists offline, return the user
            if (offlineUser && offlineUser.id) {
              const response = await performOfflineLogin(username, password, 'offline', offlineUser);
              await syncEstimateData.insertSampleEstimates();
              return response;
            } else {
              return {
                success: false,
                message: `User not found!`
              } as LoginResponse;
            }
            // Get the user data
            // const user = response.data;
            // if (!user || !user.id) {
            //   throw new Error('Invalid user data received');
            // }
            
            // // Check if user has PIN set up
            // const hasPin = user.pin != null && user.pin !== undefined;
            // console.log('hasPin (online):', hasPin);

            // // Update local user state
            // await AsyncStorage.setItem(CURRENT_USER_KEY, user.id.toString());
            // await UserDetail.update(user.id, {
            //   is_logged_in: true,
            //   last_login_at: new Date().toISOString(),
            // });

            // return {
            //   success: true,
            //   message: 'Login successful',
            //   user,
            //   hasPin
            // };
          } catch (syncError) {
            console.error('Error during data sync:', syncError);
            return {
              success: false,
              message: 'Failed to sync user data'
            };
          }
        }
      }

      // If we reach here, neither offline nor online login worked
      return {
        success: false,
        message: 'Invalid credentials'
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
      // Update the user's PIN in the database
      await UserDetail.update(userId, { 
        pin: pin,
        is_logged_in: true,
        last_login_at: new Date().toISOString()
      });
      
      // Store the current user ID in AsyncStorage
      await AsyncStorage.setItem(CURRENT_USER_KEY, userId.toString());
      
      // Reset PIN attempts if any
      await AsyncStorage.removeItem(PIN_ATTEMPTS_KEY);

      // Check if user has PIN set up
      const hasPin = await authService.checkPin(userId);
      console.log('hasPin', hasPin);
      
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

  logout: async (resetPin: boolean = false) => {
    try {
      const userId = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (userId) {
        const updates: Partial<UserDetailData> = {
          is_logged_in: false,
        };

        // If resetting PIN, set pin to null in the database
        if (resetPin) {
          updates.pin = undefined;
        }

        // Update user details
        await UserDetail.update(parseInt(userId), updates);
        
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
  },

  checkPin: async (userId: number): Promise<boolean> => {
    try {
      const user = await UserDetail.getById(userId);
      return user?.pin != null && user?.pin !== undefined;
    } catch (error) {
      console.error('Error checking PIN:', error);
      return false;
    }
  }
}; 