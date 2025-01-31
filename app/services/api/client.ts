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

    //   const response = {
    //     "message": "Login successful",
    //     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImJ1ZGh0M0BnbWFpbC5jb20iLCJyb2xlIjoiRXN0aW1hdG9yIiwibmJmIjoxNzM3MTE1OTY2LCJleHAiOjE3Mzc5Nzk5NjYsImlhdCI6MTczNzExNTk2NiwiaXNzIjoiTXJHdXR0ZXJBdXRoZW50aWNhdGlvblNlcnZlciIsImF1ZCI6Ik1yR3V0dGVyU2VydmljZVBvc3RtYW5DbGllbnQifQ.Qc01QdpRniZ3TgG91v4hJ-1OS3vY9ER9KMoYyqUCteY",
    //     "dataResponse": "{\"Users\":[{\"UserId\":1,\"CompanyId\":1,\"FirstName\":\"Budhdev\",\"LastName\":\"Tiwari\",\"Username\":\"buddhadevt\",\"Email\":\"budh@gmail.com\",\"Mobile\":\"9867554634\",\"DOB\":null,\"PasswordHash\":\"AtyUbT5JlSzbY2lAiHss2Q==\",\"FilePath\":null,\"OTP\":\"1111\",\"OTPCreatedDate\":\"2024-10-23T17:09:00\",\"IsResendOTP\":false,\"ResendOTPDate\":null,\"IsOTPVerified\":true,\"LastLoginDate\":null,\"IsFirstTimeLogin\":null,\"Status\":\"A\",\"PasswordLastChangedDate\":null,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2024-10-23T17:03:53.137\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":2,\"CompanyId\":1,\"FirstName\":\"Budh Dev\",\"LastName\":\"Tiwari\",\"Username\":\"budht@gmail.com\",\"Email\":\"budht@gmail.com\",\"Mobile\":\"8318466496\",\"DOB\":null,\"PasswordHash\":\"4SD4gzWOX9MsGLnzQrUVKQ==\",\"FilePath\":null,\"OTP\":\"1111\",\"OTPCreatedDate\":\"2024-10-25T12:39:00\",\"IsResendOTP\":null,\"ResendOTPDate\":null,\"IsOTPVerified\":true,\"LastLoginDate\":null,\"IsFirstTimeLogin\":false,\"Status\":\"A\",\"PasswordLastChangedDate\":null,\"IsActive\":true,\"CreatedBy\":0,\"CreatedDate\":\"2024-10-25T12:39:21.757\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":3,\"CompanyId\":1,\"FirstName\":\"Budh Dev\",\"LastName\":\"Tiwari\",\"Username\":\"budht2@gmail.com\",\"Email\":\"budht2@gmail.com\",\"Mobile\":\"8318266196\",\"DOB\":null,\"PasswordHash\":\"4SD4gzWOX9OfEdba9/7fRg==\",\"FilePath\":null,\"OTP\":\"1111\",\"OTPCreatedDate\":\"2024-10-25T12:46:00\",\"IsResendOTP\":null,\"ResendOTPDate\":null,\"IsOTPVerified\":true,\"LastLoginDate\":\"2025-01-14T15:59:00\",\"IsFirstTimeLogin\":false,\"Status\":\"A\",\"PasswordLastChangedDate\":null,\"IsActive\":true,\"CreatedBy\":0,\"CreatedDate\":\"2024-10-25T12:46:18.573\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":1002,\"CompanyId\":1,\"FirstName\":\"Budh Dev\",\"LastName\":\"Tiwari\",\"Username\":\"budht3@gmail.com\",\"Email\":\"budht3@gmail.com\",\"Mobile\":\"8218466496\",\"DOB\":null,\"PasswordHash\":\"4SD4gzWOX9OfEdba9/7fRg==\",\"FilePath\":null,\"OTP\":\"1111\",\"OTPCreatedDate\":\"2024-11-05T11:11:00\",\"IsResendOTP\":null,\"ResendOTPDate\":null,\"IsOTPVerified\":true,\"LastLoginDate\":\"2025-01-17T17:43:00\",\"IsFirstTimeLogin\":false,\"Status\":\"A\",\"PasswordLastChangedDate\":null,\"IsActive\":true,\"CreatedBy\":0,\"CreatedDate\":\"2024-11-05T11:10:28.01\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":2007,\"CompanyId\":1,\"FirstName\":\"Vansh\",\"LastName\":\"Pratap\",\"Username\":\"pratapvansh584@gmail.com\",\"Email\":\"pratapvansh584@gmail.com\",\"Mobile\":\"8213787878\",\"DOB\":null,\"PasswordHash\":\"4SD4gzWOX9OfEdba9/7fRg==\",\"FilePath\":null,\"OTP\":null,\"OTPCreatedDate\":null,\"IsResendOTP\":null,\"ResendOTPDate\":null,\"IsOTPVerified\":true,\"LastLoginDate\":null,\"IsFirstTimeLogin\":null,\"Status\":\"A\",\"PasswordLastChangedDate\":null,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T11:53:44.517\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"Roles\":[{\"RoleId\":1003,\"RoleName\":\"Super Admin\",\"Description\":\"Super Admin\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-10T11:06:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"RoleId\":1004,\"RoleName\":\"Admin\",\"Description\":\"Admin\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-10T11:06:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"RoleId\":1005,\"RoleName\":\"Estimator\",\"Description\":\"Estimator\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-10T11:06:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"UserRoles\":[{\"UserId\":1,\"RoleId\":1003,\"AssignedDate\":\"2025-01-10T11:08:00\",\"ModifiedDate\":null},{\"UserId\":2,\"RoleId\":1004,\"AssignedDate\":\"2025-01-10T11:08:00\",\"ModifiedDate\":null},{\"UserId\":3,\"RoleId\":1005,\"AssignedDate\":\"2025-01-10T11:08:00\",\"ModifiedDate\":null},{\"UserId\":1002,\"RoleId\":1005,\"AssignedDate\":\"2025-01-10T11:08:00\",\"ModifiedDate\":null},{\"UserId\":2007,\"RoleId\":1005,\"AssignedDate\":\"2025-01-10T11:08:00\",\"ModifiedDate\":null}],\"Company\":[{\"CompanyId\":1,\"ParentCompanyId\":0,\"CompanyName\":\"Mr. Gutter\",\"ContactPerson\":\"Allen\",\"CompanyEmail\":\"mrgutter@gmail.com\",\"CompanyPhone\":\"+1 2025551234\",\"BusinessNumber\":null,\"CompanyLogo\":\"gutter\",\"WebAddress\":null,\"AreaTitle\":null,\"AreaName1\":null,\"AreaName2\":null,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2024-12-31T15:41:00\",\"ModifiedBy\":1,\"ModifiedDate\":\"2024-12-31T15:50:00\"},{\"CompanyId\":2,\"ParentCompanyId\":0,\"CompanyName\":\"Mr. Roofing\",\"ContactPerson\":\"Bob\",\"CompanyEmail\":\"mrroofing@gmail.com\",\"CompanyPhone\":\"+1 2025554321\",\"BusinessNumber\":null,\"CompanyLogo\":\"roofing\",\"WebAddress\":null,\"AreaTitle\":null,\"AreaName1\":null,\"AreaName2\":null,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-16T18:26:00\",\"ModifiedBy\":1,\"ModifiedDate\":\"2025-01-16T18:26:00\"}],\"UserCompany\":[{\"UserId\":1,\"CompanyId\":1,\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-13T17:12:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":2,\"CompanyId\":1,\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-13T17:13:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":3,\"CompanyId\":1,\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-13T17:13:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":1002,\"CompanyId\":1,\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-13T17:13:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":2007,\"CompanyId\":1,\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-13T17:13:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":1,\"CompanyId\":2,\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-16T18:28:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":2,\"CompanyId\":2,\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-16T18:28:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":1002,\"CompanyId\":2,\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-16T18:28:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserId\":3,\"CompanyId\":2,\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-16T18:28:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"Layout\":[{\"LayoutID\":1,\"CompanyID\":1,\"LayoutName\":\"Default Layout\",\"LayoutType\":\"Quote\",\"Description\":\"This Layout is default for each new quotes\",\"IsShared\":true,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T11:44:00\",\"ModifiedBy\":null,\"ModifiedDate\":null,\"IsDefault\":true},{\"LayoutID\":2,\"CompanyID\":1,\"LayoutName\":\"(Sample) Interior Painting - General\",\"LayoutType\":\"Quote\",\"Description\":\"This Layout is used for residentials\",\"IsShared\":false,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T11:45:00\",\"ModifiedBy\":null,\"ModifiedDate\":null,\"IsDefault\":false},{\"LayoutID\":3,\"CompanyID\":1,\"LayoutName\":\"(Sample) Residential Metals\",\"LayoutType\":\"Quote\",\"Description\":\"Interior\",\"IsShared\":false,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T11:47:00\",\"ModifiedBy\":null,\"ModifiedDate\":null,\"IsDefault\":false}],\"UserLayout\":[{\"UserLayoutID\":1,\"UserId\":2007,\"LayoutId\":2,\"IsActive\":true,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T11:57:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"UserLayoutID\":2,\"UserId\":2007,\"LayoutId\":3,\"IsActive\":true,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T11:58:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"Pages\":[{\"PageId\":1,\"PageName\":\"Default layout\",\"Description\":\"This is Default Layout Page\",\"IsTemplate\":false,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T12:05:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"PageId\":2,\"PageName\":\"(Sample) Interior Painting - General\",\"Description\":\"This is Layout Page\",\"IsTemplate\":false,\"IsActive\":true,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T12:05:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"PageId\":3,\"PageName\":\"(Sample) Residential Metals\",\"Description\":\"This is Layout Page\",\"IsTemplate\":false,\"IsActive\":true,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T12:06:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"LayoutPages\":[{\"LayoutPageId\":1,\"PageId\":1,\"LayoutId\":1,\"IsTemplate\":false,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T12:08:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"LayoutPageId\":2,\"PageId\":2,\"LayoutId\":2,\"IsTemplate\":false,\"IsActive\":false,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T12:09:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"LayoutPageId\":3,\"PageId\":3,\"LayoutId\":3,\"IsTemplate\":true,\"IsActive\":true,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T12:09:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"TitlePageContent\":[{\"TitlePageId\":1,\"PageId\":1,\"TitleName\":\"Title\",\"ReportType\":\"Default layout\",\"Date\":\"2025-01-08T00:00:00\",\"PrimaryImage\":null,\"CertificationLogo\":null,\"FirstName\":\"Vansh\",\"LastName\":\"Pratap\",\"CompanyName\":\"Mr Gutter\",\"Address\":\"Us\",\"City\":\"US\",\"State\":\"US\",\"ZipCode\":\"234234\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T12:47:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"TitlePageId\":2,\"PageId\":2,\"TitleName\":\"Title2\",\"ReportType\":\"(Sample) Interior Painting - General\",\"Date\":\"2025-01-08T00:00:00\",\"PrimaryImage\":null,\"CertificationLogo\":null,\"FirstName\":\"Vansh\",\"LastName\":\"Pratap\",\"CompanyName\":\"Mr Gutter\",\"Address\":null,\"City\":null,\"State\":null,\"ZipCode\":null,\"IsActive\":true,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T12:48:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"TitlePageId\":3,\"PageId\":3,\"TitleName\":\"Title3\",\"ReportType\":\"(Sample) Residential Metals\",\"Date\":\"2025-01-08T00:00:00\",\"PrimaryImage\":null,\"CertificationLogo\":null,\"FirstName\":\"Vansh\",\"LastName\":\"Pratap\",\"CompanyName\":\"Mr Gutter\",\"Address\":null,\"City\":null,\"State\":null,\"ZipCode\":null,\"IsActive\":true,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T12:49:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"IntroductionPageContent\":[{\"IntroductionPageId\":1,\"PageId\":1,\"IntroductionTitle\":\"Default layout\",\"IntroductionContent\":\" {{SALESPERSON_LAST_NAME}}{{ACCOUNT_NAME}}{{SALESPERSON_TITLE}}Hi {{CUSTOMER_FIRST_NAME}}, \\r\\n\\r\\n Thank you for the opportunity to quote on the painting of your home. Please find your estimate below along with upgrade options for potential impr{{ACCOUNT_NAME}}{{SALESPERSON_TITLE}}{{SALESPERSON_TITLE}}ovements to your project, if applicable. \\r\\n\\r\\n The following estimate is for: \\r\\n\\r\\n 1. Preparation of specified surfaces 2. Supply of all products and materials 3. 1 or 2 Full coats to all selected surfaces (see quote details) 4. Clean up upon completion 5. Safety certification and coverage for all employees 6. Full Licensing to work in your geographical region 7. Final inspection of all work completed by you the owner 8. 2-Year Workmanship Warranty on complete projects \\r\\n\\r\\n We don’t want you to be personally liable should a worker happen to get injured therefore, we maintain current liability insurance for all employees and crews. We carry $2,000,000 liability insurance. \\r\\n\\r\\n Once the job is complete, we will inspect your project to make sure we did everything correct and up to our strict standards and site is spotless. \\r\\n\\r\\n If you have any questions, please give me a call. We always want to provide the best service to our clients. If we are outside your budget, please let us know and we will do our best to work within that! \\r\\n\\r\\n As per your request, I have also included some optional upgrades for you should you wish to have a premium paint or finish completed on your home. These are available on the Authorization page for you to review. \\r\\n\\r\\nKind regards,\\r\\n\\r\\n {{SALESPERSON_NAME}} \\r\\n\\r\\n {{SALESPERSON_EMAIL}} \\r\\n\\r\\n {{SALESPERSON_PHONE}} \",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T12:54:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"IntroductionPageId\":2,\"PageId\":2,\"IntroductionTitle\":\"(Sample) Interior Painting - General\",\"IntroductionContent\":\" {{SALESPERSON_LAST_NAME}}{{ACCOUNT_NAME}}{{SALESPERSON_TITLE}}Hi {{CUSTOMER_FIRST_NAME}}, \\r\\n\\r\\n Thank you for the opportunity to quote on the painting of your home. Please find your estimate below along with upgrade options for potential impr{{ACCOUNT_NAME}}{{SALESPERSON_TITLE}}{{SALESPERSON_TITLE}}ovements to your project, if applicable. \\r\\n\\r\\n The following estimate is for: \\r\\n\\r\\n 1. Preparation of specified surfaces 2. Supply of all products and materials 3. 1 or 2 Full coats to all selected surfaces (see quote details) 4. Clean up upon completion 5. Safety certification and coverage for all employees 6. Full Licensing to work in your geographical region 7. Final inspection of all work completed by you the owner 8. 2-Year Workmanship Warranty on complete projects \\r\\n\\r\\n We don’t want you to be personally liable should a worker happen to get injured therefore, we maintain current liability insurance for all employees and crews. We carry $2,000,000 liability insurance. \\r\\n\\r\\n Once the job is complete, we will inspect your project to make sure we did everything correct and up to our strict standards and site is spotless. \\r\\n\\r\\n If you have any questions, please give me a call. We always want to provide the best service to our clients. If we are outside your budget, please let us know and we will do our best to work within that! \\r\\n\\r\\n As per your request, I have also included some optional upgrades for you should you wish to have a premium paint or finish completed on your home. These are available on the Authorization page for you to review. \\r\\n\\r\\nKind regards,\\r\\n\\r\\n {{SALESPERSON_NAME}} \\r\\n\\r\\n {{SALESPERSON_EMAIL}} \\r\\n\\r\\n {{SALESPERSON_PHONE}} \",\"IsActive\":true,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T12:54:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"IntroductionPageId\":3,\"PageId\":3,\"IntroductionTitle\":\"(Sample) Residential Metals\",\"IntroductionContent\":\" {{SALESPERSON_LAST_NAME}}{{ACCOUNT_NAME}}{{SALESPERSON_TITLE}}Hi {{CUSTOMER_FIRST_NAME}}, \\r\\n\\r\\n Thank you for the opportunity to quote on the painting of your home. Please find your estimate below along with upgrade options for potential impr{{ACCOUNT_NAME}}{{SALESPERSON_TITLE}}{{SALESPERSON_TITLE}}ovements to your project, if applicable. \\r\\n\\r\\n The following estimate is for: \\r\\n\\r\\n 1. Preparation of specified surfaces 2. Supply of all products and materials 3. 1 or 2 Full coats to all selected surfaces (see quote details) 4. Clean up upon completion 5. Safety certification and coverage for all employees 6. Full Licensing to work in your geographical region 7. Final inspection of all work completed by you the owner 8. 2-Year Workmanship Warranty on complete projects \\r\\n\\r\\n We don’t want you to be personally liable should a worker happen to get injured therefore, we maintain current liability insurance for all employees and crews. We carry $2,000,000 liability insurance. \\r\\n\\r\\n Once the job is complete, we will inspect your project to make sure we did everything correct and up to our strict standards and site is spotless. \\r\\n\\r\\n If you have any questions, please give me a call. We always want to provide the best service to our clients. If we are outside your budget, please let us know and we will do our best to work within that! \\r\\n\\r\\n As per your request, I have also included some optional upgrades for you should you wish to have a premium paint or finish completed on your home. These are available on the Authorization page for you to review. \\r\\n\\r\\nKind regards,\\r\\n\\r\\n {{SALESPERSON_NAME}} \\r\\n\\r\\n {{SALESPERSON_EMAIL}} \\r\\n\\r\\n {{SALESPERSON_PHONE}} \",\"IsActive\":true,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T12:54:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"TermConditionsPageContent\":[{\"TC_PageId\":1,\"PageId\":1,\"TCPageTitle\":\"Terms&Conditions\",\"IsAcknowledged\":true,\"IsSummary\":false,\"IsPdf\":false,\"SummaryContent\":\"You may cancel this contract from the day you enter into the contract until 10 days after you receive a copy of the contract. You do not need a reason to cancel. If you do not receive the goods or services within 30 days of the date stated in the contract, you may cancel this contract within one year of the contract date. You lose that right if you accept delivery after the 30 days. There are other grounds for extended cancellation. For more information, you may contact your provincial/ territorial consumer affairs office. If you cancel this contract, the seller has 15 days to refund your money and any trade-in, or the cash value of the trade-in. You must then return the goods. To cancel, you must give notice of cancellation at the address in this contract. You must give notice of cancellation by a method that will allow you to prove that you gave notice, including registered mail, fax or by personal delivery. \\r\\n\\r\\nI understand that if roof rot is discovered during tear-off {{ACCOUNT_NAME}} reserves the right to replace sheathing and bill me up to $200 in addition to the estimated cost below without notifying me in advance. {{ACCOUNT_NAME}} will call me for authorization if wood replacement will exceed $200.\\r\\n\\r\\n I understand that I must remove items from the interior walls of my home that may be damaged or fall due to vibrations from the loading/installation of shingles on to my roof (if applicable), or installation of siding. {{ACCOUNT_NAME}} is not liable for such damages. \\r\\n\\r\\nI understand that minor stucco damage may result when the roof is torn off areas where stucco meets my roof’s surface, especially where improperly applied. {{ACCOUNT_NAME}} is not liable for repairing said damage.\\r\\n\\r\\nI understand that any warranty for material used during the project is provided by the material manufacturer. Unless agreed upon otherwise, {{ACCOUNT_NAME}} provides a 5-year Workmanship Warranty on portions of the project in which {{ACCOUNT_NAME}} fully replaced any existing products. Roofing workmanship warranties will be reduced to one year when home owners have requested that full synthetic underlayment not be installed. Full warranty details available by request.\\r\\n\\r\\nI understand that, unless agreed upon. This does not apply to products, some of which may deteriorate more rapidly (ie. sealants) and should be inspected on a regular basis, and am not responsible for material shortage and have no claim to material surpluses.\\r\\n\\r\\n I certify that I am the registered owner of the above project property, or have the legal permission to authorize {{ACCOUNT_NAME}} to perform the work as stated and agree to pay the total project price.\\r\\n\\r\\n I understand that any insurance claims are subject to the specific terms and conditions outlined by my insurance company, and may be subject to insurance company approval. \\r\\n\\r\\n I understand that payment in full is due upon completion of work as stated in contract. All invoices not paid in full after 15 days will be subject to a 2% per month interest charge. \\r\\n\\r\\n I understand that approval of my estimate is subject to customer credit approval by {{ACCOUNT_NAME}}. I agree that {{ACCOUNT_NAME}} may access my credit bureau report(s), trade references, and other credit information prior to granting credit approval.\",\"PdfFilePath\":\"\",\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-29T12:04:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"WarrantyPageContent\":[{\"WarrantyPageId\":1,\"PageId\":1,\"WarrantyPageTitle\":\"Warranty\",\"WarrantyDetails\":\"This document warrants that should a defect in workmanship, related to the work completed by {{ACCOUNT_NAME}}, occur within 5 years of the project, {{ACCOUNT_NAME}} will complete repairs within the original project’s scope of work at no charge to the customer. This warranty does not cover normal wear and tear, hail damage, wind damage, sun damage, intentional or accidental damage by any person, or acts of God that may or may not merit an insurance claim. This warranty only applies to portions of the project in which {{ACCOUNT_NAME}}{{ACCOUNT_NAME}} fully replaced any existing products, and does not cover repairs or service done to another contractor’s work. Defects in the building materials used to complete work do not fall under the scope of this workmanship warranty; any building products installed will instead be covered by the product’s original manufacturer warranty. \",\"ThankYouNote\":\"ThankYou\",\"Signature\":\"Signature\",\"SigneeName\":\"SigneeName\",\"SigneeTitle\":\"SigneeTitle\",\"IsActive\":true,\"CreatedBy\":1002,\"CreatedDate\":\"2025-01-29T12:07:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"AuthorizationPageContent\":[],\"InspectionPageContent\":[{\"InspectionPageId\":1,\"PageId\":1,\"InspectionTitle\":\"Default layout\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T13:32:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"InspectionPageId\":2,\"PageId\":2,\"InspectionTitle\":\"(Sample) Interior Painting - General\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T13:47:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"InspectionPageId\":3,\"PageId\":3,\"InspectionTitle\":\"(Sample) Residential Metals\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T13:47:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"InspectionPageSection\":[{\"InspectionSectionId\":1,\"InspectionPageId\":1,\"SectionStyleId\":1,\"SectionTitle\":\"SectionTitle1\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T13:50:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"InspectionSectionId\":2,\"InspectionPageId\":1,\"SectionStyleId\":1,\"SectionTitle\":\"SectionTitle2\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T13:50:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"InspectionSectionId\":3,\"InspectionPageId\":2,\"SectionStyleId\":2,\"SectionTitle\":\"SectionTitle1\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T13:50:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"InspectionSectionId\":4,\"InspectionPageId\":3,\"SectionStyleId\":1,\"SectionTitle\":\"SectionTitle\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T13:51:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"InspectionSectionItems\":[{\"ID\":1,\"InspectionSectionId\":1,\"InspectionFile\":null,\"InspectionContent\":\"This is first item of inspection section1\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T16:21:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"ID\":2,\"InspectionSectionId\":1,\"InspectionFile\":null,\"InspectionContent\":\"This is second item of inspection section1\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T16:21:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"ID\":3,\"InspectionSectionId\":2,\"InspectionFile\":null,\"InspectionContent\":\"This is first item of inspection section2\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T16:22:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"QuotePagePriceSection\":[],\"QuotePageSection\":[{\"QuoteSectionId\":1,\"QuotePageId\":1,\"SectionTitle\":\"Default Layout Quote Section1\",\"SectionTotal\":0.0,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T17:41:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"QuoteSectionId\":2,\"QuotePageId\":1,\"SectionTitle\":\"Default Layout Quote Section2\",\"SectionTotal\":0.0,\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T17:41:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"QuoteSectionId\":3,\"QuotePageId\":2,\"SectionTitle\":\"SectionTitle\",\"SectionTotal\":0.0,\"IsActive\":true,\"CreatedBy\":null,\"CreatedDate\":\"2025-01-08T18:54:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"QuotePageContent\":[{\"QuotePageId\":1,\"PageId\":1,\"QuotePageTitle\":\"Default layout Quote\",\"QuoteSubtotal\":0.0,\"Total\":0.0,\"Notes\":\"This is default layout quote details notes.\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T17:37:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"QuotePageId\":2,\"PageId\":1,\"QuotePageTitle\":\"Default layout Quote 2\",\"QuoteSubtotal\":0.0,\"Total\":0.0,\"Notes\":\"This is second quote details of default layout\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T17:38:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"QuotePageId\":3,\"PageId\":2,\"QuotePageTitle\":\"(Sample) Interior Painting - General\",\"QuoteSubtotal\":0.0,\"Total\":0.0,\"Notes\":\"This is (Sample) Interior Painting - General notes\",\"IsActive\":true,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T17:39:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"QuotePageId\":4,\"PageId\":3,\"QuotePageTitle\":\"(Sample) Residential Metals\",\"QuoteSubtotal\":0.0,\"Total\":0.0,\"Notes\":\"This is (Sample) Residential Metals\",\"IsActive\":true,\"CreatedBy\":2007,\"CreatedDate\":\"2025-01-08T17:39:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}],\"ProductsPricing\":[],\"SectionStyle\":[{\"SectionStyleId\":1,\"StyleName\":\"Standard Fits 2 per page\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T13:26:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"SectionStyleId\":2,\"StyleName\":\"Side-by-side Fits 4 per page\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T13:26:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"SectionStyleId\":3,\"StyleName\":\"Wide Fits 2 per page\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T13:27:00\",\"ModifiedBy\":null,\"ModifiedDate\":null},{\"SectionStyleId\":4,\"StyleName\":\"Full Fits 1 per page\",\"IsActive\":true,\"CreatedBy\":1,\"CreatedDate\":\"2025-01-08T13:27:00\",\"ModifiedBy\":null,\"ModifiedDate\":null}]}"
    // };

      // const result = response;
      const result = await response.json();

      
      // Map API response to our interface
      return {
        success: response.ok,
        // success: true,
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
