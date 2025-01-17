import { UserDetail } from '@/app/database/models/UserDetail';
import { Company } from '@/app/database/models/Company';
import { Role } from '@/app/database/models/Role';
import { UserRole } from '@/app/database/models/UserRole';
import { Layouts } from '@/app/database/models/Layouts';
import { Pages } from '@/app/database/models/Pages';
import { LayoutPages } from '@/app/database/models/LayoutPages';
import { TitlePageContent } from '@/app/database/models/TitlePageContent';
import { IntroductionPageContent } from '@/app/database/models/IntroductionPageContent';
import { User } from '@/app/database/models/User';
import { UserCompany } from '@/app/database/models/UserCompany';

interface LoginDataResponse {
  Users: Array<{
    UserId: number;
    CompanyId: number;
    FirstName: string;
    LastName: string;
    Username: string;
    Email: string;
    Mobile: string;
    PasswordHash: string;
    Status: string;
    IsActive: boolean;
    CreatedBy: number;
    CreatedDate: string;
    ModifiedBy: number | null;
    ModifiedDate: string | null;
  }>;
  Roles: Array<{
    RoleId: number;
    RoleName: string;
    Description: string;
    IsActive: boolean;
    CreatedBy: number;
    CreatedDate: string;
    ModifiedBy: number | null;
    ModifiedDate: string | null;
  }>;
  UserRoles: Array<{
    UserId: number;
    RoleId: number;
    AssignedDate: string;
    ModifiedDate: string | null;
  }>;
  Company: Array<{
    CompanyId: number;
    ParentCompanyId: number;
    CompanyName: string;
    CompanyEmail: string;
    CompanyPhone: string;
    BusinessNumber: string | null;
    CompanyLogo: string | null;
    WebAddress: string | null;
    AreaTitle: string | null;
    AreaName1: string | null;
    AreaName2: string | null;
    IsActive: boolean;
    CreatedBy: number;
    CreatedDate: string;
    ModifiedBy: number;
    ModifiedDate: string;
  }>;
  Layout: Array<{
    LayoutID: number;
    CompanyID: number;
    LayoutName: string;
    LayoutType: string;
    Description: string;
    IsShared: boolean;
    IsActive: boolean;
    IsDefault: boolean;
    CreatedBy: number;
    CreatedDate: string;
    ModifiedBy: number | null;
    ModifiedDate: string | null;
  }>;
  Pages: Array<{
    PageId: number;
    PageName: string;
    Description: string;
    IsTemplate: boolean;
    IsActive: boolean;
    CreatedBy: number;
    CreatedDate: string;
    ModifiedBy: number | null;
    ModifiedDate: string | null;
  }>;
  LayoutPages: Array<{
    LayoutPageId: number;
    PageId: number;
    LayoutId: number;
    IsTemplate: boolean;
    IsActive: boolean;
    CreatedBy: number;
    CreatedDate: string;
    ModifiedBy: number | null;
    ModifiedDate: string | null;
  }>;
  TitlePageContent: Array<{
    TitlePageId: number;
    PageId: number;
    TitleName: string;
    ReportType: string;
    Date: string;
    PrimaryImage: string | null;
    CertificationLogo: string | null;
    FirstName: string;
    LastName: string;
    CompanyName: string;
    Address: string | null;
    City: string | null;
    State: string | null;
    ZipCode: string | null;
    IsActive: boolean;
    CreatedBy: number;
    CreatedDate: string;
    ModifiedBy: number | null;
    ModifiedDate: string | null;
  }>;
  IntroductionPageContent: Array<{
    IntroductionPageId: number;
    PageId: number;
    IntroductionTitle: string;
    IntroductionContent: string;
    IsActive: boolean;
    CreatedBy: number;
    CreatedDate: string;
    ModifiedBy: number | null;
    ModifiedDate: string | null;
  }>;
  UserCompany: Array<{
    UserId: number;
    CompanyId: number;
    IsActive: boolean;
    CreatedBy: number;
    CreatedDate: string;
    ModifiedBy: number | null;
    ModifiedDate: string | null;
  }>;
}

export const syncService = {
  syncLoginData: async (dataResponse: string) => {
    try {
      // console.log('dataResponse', dataResponse);
      const data: LoginDataResponse = JSON.parse(dataResponse);
      // console.log('data', data);
      // console.log('Syncing data...');
      
      // Sync Companies
      for (const company of data.Company) {
        const existingCompany = await Company.getById(company.CompanyId);
        if (!existingCompany) {
          await Company.insert({
            id: company.CompanyId,
            parent_company_id: company.ParentCompanyId,
            company_name: company.CompanyName,
            company_phone_number: company.CompanyPhone,
            company_email: company.CompanyEmail,
            business_number: company.BusinessNumber ?? '',
            web_address: company.WebAddress ?? '',
            company_logo: company.CompanyLogo ?? '',
            area_title: company.AreaTitle ?? '',
            area_name_1: company.AreaName1 ?? '',
            area_name_2: company.AreaName2 ?? '',
            is_active: company.IsActive,
            created_by: company.CreatedBy,
            created_date: company.CreatedDate,
            modified_by: company.ModifiedBy ?? '',
            modified_date: company.ModifiedDate ?? ''
          });
          // console.log('Company synced:', company.CompanyName);
        }
      }

      // Sync Roles
      for (const role of data.Roles) {
        const existingRole = await Role.getById(role.RoleId);
        if (!existingRole) {
          await Role.insert({
            id: role.RoleId,
            role_name: role.RoleName,
            description: role.Description,
            is_active: role.IsActive,
            created_by: role.CreatedBy,
            created_date: role.CreatedDate,
            modified_by: role.ModifiedBy ?? -1,
            modified_date: role.ModifiedDate ?? ''
          });
          // console.log('Role synced:', role.RoleName);
        }
      }

      // Sync Users and UserDetails
      for (const user of data.Users) {
        const existingUserDetail = await UserDetail.getById(user.UserId);
        if (!existingUserDetail) {
          console.log('user', user);
          await UserDetail.insert({
            id: user.UserId,
            company_id: user.CompanyId,
            first_name: user.FirstName,
            last_name: user.LastName,
            username: user.Username,
            email: user.Email,
            phone_number: user.Mobile,
            password_hash: user.PasswordHash,
            is_active: user.IsActive,
            created_by: user.CreatedBy,
            created_date: user.CreatedDate,
            modified_by: user.ModifiedBy ?? -1,
            modified_date: user.ModifiedDate ?? ''
          });
          // console.log('UserDetail synced:', user.UserId);
        }
        

        const existingUser = await User.getById(user.UserId);
        if (!existingUser) {
          await User.insert({
            id: user.UserId,
            user_detail_id: user.UserId,
            role_id: data.UserRoles.find(ur => ur.UserId === user.UserId)?.RoleId,
            status: user.Status,
            created_date: user.CreatedDate,
            modified_date: user.ModifiedDate ?? ''
          });
          // console.log('User synced:', user.Username);
        }
      }

      // Sync UserRoles
      for (const userRole of data.UserRoles) {
        const existingUserRole = await UserRole.getById(userRole.UserId);
        if (!existingUserRole) {
          await UserRole.insert({
            user_id: userRole.UserId,
            role_id: userRole.RoleId,
            created_date: userRole.AssignedDate,
            modified_date: userRole.ModifiedDate ?? ''
          });
          // console.log('UserRole synced for user:', userRole.UserId);
        }
      }

      // Sync Layouts
      for (const layout of data.Layout) {
        // console.log('layout', layout);
        const existingLayout = await Layouts.getById(layout.LayoutID);
        // console.log('existingLayout', existingLayout);
        if (!existingLayout) {
          // console.log('layout not found. inserting...');
          await Layouts.insert({
            id: layout.LayoutID,
            company_id: layout.CompanyID,
            layout_name: layout.LayoutName,
            layout_type: layout.LayoutType as 'Quote' | 'Order',
            description: layout.Description,
            is_shared: layout.IsShared,
            is_active: layout.IsActive,
            is_default: layout.IsDefault,
            created_by: layout.CreatedBy,
            created_date: layout.CreatedDate,
            modified_by: layout.ModifiedBy ?? null,
            modified_date: layout.ModifiedDate ?? ''
          });
          // console.log('Layout synced:', layout.LayoutName);
        } else {
          // console.log('Layout already exists:', layout.LayoutName);
        }
      }

      // Sync Pages
      for (const page of data.Pages) {
        // console.log('page', page);
        const existingPage = await Pages.getById(page.PageId);
        if (!existingPage) {
          // console.log('page.CreatedBy', page.CreatedBy);
          // console.log('page.modified_by', page.ModifiedBy);
          await Pages.insert({
            id: page.PageId,
            page_name: page.PageName,
            description: page.Description,
            is_template: page.IsTemplate,
            is_active: page.IsActive,
            created_by: page.CreatedBy,
            created_date: page.CreatedDate,
            modified_by: page.ModifiedBy ?? null,
            modified_date: page.ModifiedDate ?? ''
          });
          // console.log('Page synced:', page.PageName);
        } else {
          // console.log('Page already exists:', page.PageName);
        }
      }

      // Sync LayoutPages
      for (const layoutPage of data.LayoutPages) {
        // console.log('layoutPage', layoutPage);
        const existingLayoutPage = await LayoutPages.getById(layoutPage.LayoutPageId);
        // console.log('existingLayoutPage', existingLayoutPage);
        if (!existingLayoutPage) {
          // console.log('layoutPage not found. inserting...');
          await LayoutPages.insert({
            id: layoutPage.LayoutPageId,
            page_id: layoutPage.PageId,
            layout_id: layoutPage.LayoutId,
            is_active: layoutPage.IsActive,
            created_by: layoutPage.CreatedBy,
            created_date: layoutPage.CreatedDate,
            modified_by: layoutPage.ModifiedBy ?? null,
            modified_date: layoutPage.ModifiedDate ?? ''
          });
          // console.log('LayoutPage synced:', layoutPage.LayoutPageId);
        } else {
          // console.log('LayoutPage already exists:', layoutPage.LayoutPageId);
        }
      }

      // Sync TitlePageContent
      for (const titlePage of data.TitlePageContent) {
        // console.log('titlePage', titlePage);
        const existingTitlePage = await TitlePageContent.getById(titlePage.TitlePageId);
        if (!existingTitlePage) {
          // console.log('TitlePageContent not found, inserting...');
          await TitlePageContent.insert({
            id: titlePage.TitlePageId,
            page_id: titlePage.PageId,
            title_name: titlePage.TitleName,
            report_type: titlePage.ReportType,
            date: titlePage.Date,
            primary_image: titlePage.PrimaryImage,
            certification_logo: titlePage.CertificationLogo,
            first_name: titlePage.FirstName,
            last_name: titlePage.LastName,
            company_name: titlePage.CompanyName,
            address: titlePage.Address,
            city: titlePage.City,
            state: titlePage.State,
            zip_code: titlePage.ZipCode,
            is_active: titlePage.IsActive,
            created_by: titlePage.CreatedBy,
            created_date: titlePage.CreatedDate,
            modified_by: titlePage.ModifiedBy ?? null,
            modified_date: titlePage.ModifiedDate ?? ''
          });
          // console.log('TitlePage synced:', titlePage.TitleName);
        } else {
          // console.log('TitlePage already exists:', titlePage.TitleName);
        }
      }

      // Sync IntroductionPageContent
    //   for (const introPage of data.IntroductionPageContent) {
    //     // console.log('introPage', introPage);
    //     const existingIntroPage = await IntroductionPageContent.getById(introPage.IntroductionPageId);
    //     // console.log('existingIntroPage', existingIntroPage);
    //     if (!existingIntroPage) {
    //       // console.log('IntroductionPageContent not found, inserting...');
    //       await IntroductionPageContent.insert({
    //         id: introPage.IntroductionPageId,
    //         page_id: introPage.PageId,
    //         introduction_name: introPage.IntroductionTitle,
    //         introduction_content: introPage.IntroductionContent,
    //         is_active: introPage.IsActive,
    //         created_by: introPage.CreatedBy,
    //         created_date: introPage.CreatedDate,
    //         modified_by: introPage.ModifiedBy ?? null,
    //         modified_date: introPage.ModifiedDate ?? ''
    //       });
    //       // console.log('IntroductionPage synced:', introPage.IntroductionTitle);
    //     } else {
    //       // console.log('IntroductionPage already exists:', introPage.IntroductionTitle);
    //     }
    //   }

      // Sync UserCompany
      for (const userCompany of data.UserCompany) {
        // console.log('userCompany', userCompany);
        const existingUserCompany = await UserCompany.getById(userCompany.UserId, userCompany.CompanyId);
        // console.log('existingUserCompany', existingUserCompany);
        if (!existingUserCompany) {
          // console.log('UserCompany not found, inserting...');
          await UserCompany.insert({
            user_id: userCompany.UserId,
            company_id: userCompany.CompanyId,
            is_active: userCompany.IsActive,
            created_by: userCompany.CreatedBy,
            created_date: userCompany.CreatedDate,
            modified_by: userCompany.ModifiedBy ?? null,
            modified_date: userCompany.ModifiedDate ?? ''
          });
          // console.log('UserCompany synced for user:', userCompany.UserId);
        } else {
          // console.log('UserCompany already exists for user:', userCompany.UserId);
        }
      }

      // console.log('Data sync completed successfully');
      return true;
    } catch (error) {
      console.error('Error syncing data:', error);
      return false;
    }
  }
};