import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { API_BASE_URL } from '@/app/constants/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
  dataResponse?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async isOnline(): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected ?? false;
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            mobileOrEmail: data.username,
            password: data.password,
          }),
              });

      const result = await response.json();
      
      // Map API response to our interface
      return {
        success: response.ok,
        message: result.message,
        token: result.token,
        dataResponse: result.dataResponse,
        data: this.extractUserFromDataResponse(result.dataResponse)
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        message: 'Network request failed',
      };
    }
  }

  private extractUserFromDataResponse(dataResponse: string): any {
    try {
      if (!dataResponse) return null;
      
      const parsed = JSON.parse(dataResponse);
      if (!parsed.Users || !parsed.Users.length) return null;

      // Get the matching user based on login credentials
      const user = parsed.Users[0]; // Or use some logic to find the correct user
      
      return {
        id: user.UserId,
        company_id: user.CompanyId,
        first_name: user.FirstName,
        last_name: user.LastName,
        username: user.Username,
        email: user.Email,
        phone_number: user.Mobile,
        is_active: user.IsActive
      };
    } catch (error) {
      console.error('Error extracting user from response:', error);
      return null;
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
