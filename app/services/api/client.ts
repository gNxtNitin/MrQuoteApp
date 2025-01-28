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
      // const response = await fetch(`${this.baseUrl}${endpoint}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //       mobileOrEmail: data.username,
      //       password: data.password,
      //     }),
      //         });

      const response = {
        "message": "Login successful",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImJ1ZGh0M0BnbWFpbC5jb20iLCJyb2xlIjoiRXN0aW1hdG9yIiwibmJmIjoxNzM3MTE1OTY2LCJleHAiOjE3Mzc5Nzk5NjYsImlhdCI6MTczNzExNTk2NiwiaXNzIjoiTXJHdXR0ZXJBdXRoZW50aWNhdGlvblNlcnZlciIsImF1ZCI6Ik1yR3V0dGVyU2VydmljZVBvc3RtYW5DbGllbnQifQ.Qc01QdpRniZ3TgG91v4hJ-1OS3vY9ER9KMoYyqUCteY",
        "dataResponse": "{\"Users\":[{\"UserId\":1,\"CompanyId\":1,\"FirstName\":\"Budhdev\",\"LastName\":\"Tiwari\",\"Username\":\"buddhadevt\",\"Email\":\"budh@gmail.com\",\"Mobile\":\"9867554634\",\"DOB\":null,\"PasswordHash\":\"kfA8/TepmeB+EB4IY8bkkA==\",\"FilePath\":null,\"OTP\":\"1111\",\"OTPCreatedDate\":\"2024-10-23T17:09:00\",\"IsResendOTP\":false,\"ResendOTPDate\":null,\"IsOTPVerified\":true,\"LastLoginDate\":null,\"IsFirstTimeLogin\":null,\"Status\":\"A\",\"PasswordLastChangedDate\":null,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2024-10-23T17:03:53.137\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":2,\"CompanyId\":1,\"FirstName\":\"Budh Dev\",\"LastName\":\"Tiwari\",\"Username\":\"budht@gmail.com\",\"Email\":\"budht@gmail.com\",\"Mobile\":\"8318466496\",\"DOB\":null,\"PasswordHash\":\"gIUlNk7kG/AvyCEuXsmkrg==\",\"FilePath\":null,\"OTP\":\"1111\",\"OTPCreatedDate\":\"2024-10-25T12:39:00\",\"IsResendOTP\":null,\"ResendOTPDate\":null,\"IsOTPVerified\":true,\"LastLoginDate\":null,\"IsFirstTimeLogin\":false,\"Status\":\"A\",\"PasswordLastChangedDate\":null,\"IsActive\":true,\"CreatedBy\":0,\"CreatedDate\":\"2024-10-25T12:39:21.757\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":3,\"CompanyId\":1,\"FirstName\":\"Budh Dev\",\"LastName\":\"Tiwari\",\"Username\":\"budht2@gmail.com\",\"Email\":\"budht2@gmail.com\",\"Mobile\":\"8318266196\",\"DOB\":null,\"PasswordHash\":\"1djybcp42CbSzx7BpC1yiA==\",\"FilePath\":null,\"OTP\":\"1111\",\"OTPCreatedDate\":\"2024-10-25T12:46:00\",\"IsResendOTP\":null,\"ResendOTPDate\":null,\"IsOTPVerified\":true,\"LastLoginDate\":\"2025-01-14T15:59:00\",\"IsFirstTimeLogin\":false,\"Status\":\"A\",\"PasswordLastChangedDate\":null,\"IsActive\":true,\"CreatedBy\":0,\"CreatedDate\":\"2024-10-25T12:46:18.573\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":1002,\"CompanyId\":1,\"FirstName\":\"Budh Dev\",\"LastName\":\"Tiwari\",\"Username\":\"budht3@gmail.com\",\"Email\":\"budht3@gmail.com\",\"Mobile\":\"8218466496\",\"DOB\":null,\"PasswordHash\":\"1djybcp42CbSzx7BpC1yiA==\",\"FilePath\":null,\"OTP\":\"1111\",\"OTPCreatedDate\":\"2024-11-05T11:11:00\",\"IsResendOTP\":null,\"ResendOTPDate\":null,\"IsOTPVerified\":true,\"LastLoginDate\":\"2025-01-17T17:43:00\",\"IsFirstTimeLogin\":false,\"Status\":\"A\",\"PasswordLastChangedDate\":null,\"IsActive\":true,\"CreatedBy\":0,\"CreatedDate\":\"2024-11-05T11:10:28.01\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":2007,\"CompanyId\":1,\"FirstName\":\"Vansh\",\"LastName\":\"Pratap\",\"Username\":\"pratapvansh584@gmail.com\",\"Email\":\"pratapvansh584@gmail.com\",\"Mobile\":\"8213787878\",\"DOB\":null,\"PasswordHash\":\"1djybcp42CbSzx7BpC1yiA==\",\"FilePath\":null,\"OTP\":null,\"OTPCreatedDate\":null,\"IsResendOTP\":null,\"ResendOTPDate\":null,\"IsOTPVerified\":true,\"LastLoginDate\":null,\"IsFirstTimeLogin\":null,\"Status\":\"A\",\"PasswordLastChangedDate\":null,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T11:53:44.517\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"Roles\":[{\"RoleId\":1003,\"RoleName\":\"Super Admin\",\"Description\":\"Super Admin\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-10T11:06:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"RoleId\":1004,\"RoleName\":\"Admin\",\"Description\":\"Admin\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-10T11:06:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"RoleId\":1005,\"RoleName\":\"Estimator\",\"Description\":\"Estimator\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-10T11:06:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"UserRoles\":[{\"UserId\":1,\"RoleId\":1003,\"AssignedDate\":\"2025-01-10T11:08:00\",\"ModifiedDate\":null},{\"UserId\":2,\"RoleId\":1004,\"AssignedDate\":\"2025-01-10T11:08:00\",\"ModifiedDate\":null},{\"UserId\":3,\"RoleId\":1005,\"AssignedDate\":\"2025-01-10T11:08:00\",\"ModifiedDate\":null},{\"UserId\":1002,\"RoleId\":1005,\"AssignedDate\":\"2025-01-10T11:08:00\",\"ModifiedDate\":null},{\"UserId\":2007,\"RoleId\":1005,\"AssignedDate\":\"2025-01-10T11:08:00\",\"ModifiedDate\":null}],\"Company\":[{\"CompanyId\":1,\"ParentCompanyId\":0,\"CompanyName\":\"Mr. Gutter\",\"ContactPerson\":\"Allen\",\"CompanyEmail\":\"mrgutter@gmail.com\",\"CompanyPhone\":\"+1 2025551234\",\"BusinessNumber\":null,\"CompanyLogo\":\"gutter\",\"WebAddress\":null,\"AreaTitle\":null,\"AreaName1\":null,\"AreaName2\":null,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2024-12-31T15:41:00\",\"ModifiedBy\":1,\"ModifiedDate\":\"2024-12-31T15:50:00\"},{\"CompanyId\":2,\"ParentCompanyId\":0,\"CompanyName\":\"Mr. Roofing\",\"ContactPerson\":\"Bob\",\"CompanyEmail\":\"mrroofing@gmail.com\",\"CompanyPhone\":\"+1 2025554321\",\"BusinessNumber\":null,\"CompanyLogo\":\"roofing\",\"WebAddress\":null,\"AreaTitle\":null,\"AreaName1\":null,\"AreaName2\":null,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-16T18:26:00\",\"ModifiedBy\":1,\"ModifiedDate\":\"2025-01-16T18:26:00\"}],\"UserCompany\":[{\"UserId\":1,\"CompanyId\":1,\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-13T17:12:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":2,\"CompanyId\":1,\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-13T17:13:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":3,\"CompanyId\":1,\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-13T17:13:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":1002,\"CompanyId\":1,\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-13T17:13:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":2007,\"CompanyId\":1,\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-13T17:13:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":1,\"CompanyId\":2,\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-16T18:28:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":2,\"CompanyId\":2,\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-16T18:28:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":1002,\"CompanyId\":2,\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-16T18:28:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":3,\"CompanyId\":2,\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-16T18:28:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"Layout\":[{\"LayoutID\":1,\"CompanyID\":1,\"LayoutName\":\"Default Layout\",\"LayoutType\":\"Quote\",\"Description\":\"This Layout is default for each new quotes\",\"IsShared\":true,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T11:44:00\",\"ModifiedBy\":null,\"ModifiedDate\":null,\"IsDefault\":true},{\"LayoutID\":2,\"CompanyID\":1,\"LayoutName\":\"(Sample) Interior Painting - General\",\"LayoutType\":\"Quote\",\"Description\":\"This Layout is used for residentials\",\"IsShared\":false,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T11:45:00\",\"ModifiedBy\":null,\"ModifiedDate\":null,\"IsDefault\":false},{\"LayoutID\":3,\"CompanyID\":1,\"LayoutName\":\"(Sample) Residential Metals\",\"LayoutType\":\"Quote\",\"Description\":\"Interior\",\"IsShared\":false,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T11:47:00\",\"ModifiedBy\":null,\"ModifiedDate\":null,\"IsDefault\":false}],\"UserLayout\":[{\"UserLayoutID\":1,\"UserId\":2007,\"LayoutId\":2,\"IsActive\":true,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T11:57:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserLayoutID\":2,\"UserId\":2007,\"LayoutId\":3,\"IsActive\":true,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T11:58:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"Pages\":[{\"PageId\":1,\"PageName\":\"Default layout\",\"Description\":\"This is Default Layout Page\",\"IsTemplate\":false,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T12:05:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"PageId\":2,\"PageName\":\"(Sample) Interior Painting - General\",\"Description\":\"This is Layout Page\",\"IsTemplate\":false,\"IsActive\":true,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T12:05:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"PageId\":3,\"PageName\":\"(Sample) Residential Metals\",\"Description\":\"This is Layout Page\",\"IsTemplate\":false,\"IsActive\":true,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T12:06:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"LayoutPages\":[{\"LayoutPageId\":1,\"PageId\":1,\"LayoutId\":1,\"IsTemplate\":false,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T12:08:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"LayoutPageId\":2,\"PageId\":2,\"LayoutId\":2,\"IsTemplate\":false,\"IsActive\":false,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T12:09:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"LayoutPageId\":3,\"PageId\":3,\"LayoutId\":3,\"IsTemplate\":true,\"IsActive\":true,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T12:09:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"TitlePageContent\":[{\"TitlePageId\":1,\"PageId\":1,\"TitleName\":\"Title\",\"ReportType\":\"Default layout\",\"Date\":\"2025-01-08T00:00:00\",\"PrimaryImage\":null,\"CertificationLogo\":null,\"FirstName\":\"Vansh\",\"LastName\":\"Pratap\",\"CompanyName\":\"Mr Gutter\",\"Address\":\"Us\",\"City\":\"US\",\"State\":\"US\",\"ZipCode\":\"234234\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T12:47:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"TitlePageId\":2,\"PageId\":2,\"TitleName\":\"Title2\",\"ReportType\":\"(Sample) Interior Painting - General\",\"Date\":\"2025-01-08T00:00:00\",\"PrimaryImage\":null,\"CertificationLogo\":null,\"FirstName\":\"Vansh\",\"LastName\":\"Pratap\",\"CompanyName\":\"Mr Gutter\",\"Address\":null,\"City\":null,\"State\":null,\"ZipCode\":null,\"IsActive\":true,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T12:48:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"TitlePageId\":3,\"PageId\":3,\"TitleName\":\"Title3\",\"ReportType\":\"(Sample) Residential Metals\",\"Date\":\"2025-01-08T00:00:00\",\"PrimaryImage\":null,\"CertificationLogo\":null,\"FirstName\":\"Vansh\",\"LastName\":\"Pratap\",\"CompanyName\":\"Mr Gutter\",\"Address\":null,\"City\":null,\"State\":null,\"ZipCode\":null,\"IsActive\":true,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T12:49:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}]}"
    };

      const result = response;
      // const result = response.json();

      
      // Map API response to our interface
      return {
        // success: response.ok,
        success: true,
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
