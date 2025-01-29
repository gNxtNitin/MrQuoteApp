import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  companyId: number;
  roleId: number;
  roleName: string;
  status: string;
  isActive: boolean;
}

interface LoginResponse {
  Users: Array<{
    UserId: number;
    CompanyId: number;
    FirstName: string;
    LastName: string;
    Username: string;
    Email: string;
    Mobile: string;
    Status: string;
    IsActive: boolean;
  }>;
  UserRoles: Array<{
    UserId: number;
    RoleId: number;
  }>;
  Roles: Array<{
    RoleId: number;
    RoleName: string;
  }>;
}

interface UserStore {
  currentUser: UserData | null;
  setCurrentUser: (user: UserData) => void;
  setCurrentUserFromLogin: (loginData: LoginResponse, username: string) => void;
  clearCurrentUser: () => void;
}

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      currentUser: null,
      
      setCurrentUser: (user: UserData) => set({ currentUser: user }),
      
      setCurrentUserFromLogin: (loginData: LoginResponse, username: string) => {
        try {
          // Find the logged-in user by username
          const user = loginData.Users.find(u => u.Username === username);
          
          if (!user) {
            console.error('User not found in login data');
            return;
          }

          // Find user's role
          const userRole = loginData.UserRoles.find(ur => ur.UserId === user.UserId);
          const role = userRole 
            ? loginData.Roles.find(r => r.RoleId === userRole.RoleId)
            : null;

          // Set current user with all required data
          set({
            currentUser: {
              id: user.UserId,
              firstName: user.FirstName,
              lastName: user.LastName,
              email: user.Email,
              mobile: user.Mobile,
              companyId: user.CompanyId,
              roleId: userRole?.RoleId || 0,
              roleName: role?.RoleName || '',
              status: user.Status,
              isActive: user.IsActive
            }
          });

          console.log('Current user set successfully:', user.FirstName);
        } catch (error) {
          console.error('Error setting current user:', error);
        }
      },
      
      clearCurrentUser: () => set({ currentUser: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 