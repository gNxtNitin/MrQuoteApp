import { UserDetail } from '@/app/database/models/UserDetail';
import { Company } from '@/app/database/models/Company';
import { Role } from '@/app/database/models/Role';
import { UserRole } from '@/app/database/models/UserRole';
import { Layouts } from '@/app/database/models/Layouts';
import { Pages } from '@/app/database/models/Pages';
import { LayoutPages } from '@/app/database/models/LayoutPages';
import { TitlePageContent } from '@/app/database/models/TitlePageContent';
import { IntroductionPageContent } from '@/app/database/models/IntroductionPageContent';
import { TermConditionsPageContent } from '@/app/database/models/TermConditionsPageContent';
import { User } from '@/app/database/models/User';
import { UserCompany } from '@/app/database/models/UserCompany';
import { Estimate } from '@/app/database/models/Estimate';
import { EstimateDetail } from '@/app/database/models/EstimateDetail';
import { useUserStore } from '@/app/stores/userStore';
import { WarrantyPageContent } from '@/app/database/models/WarrantyPageContent';
import { ProductsPricing } from '@/app/database/models/ProductsPricing';
import { QuotePageContent } from '@/app/database/models/QuotePageContent';
import { QuotePageSection } from '@/app/database/models/QuotePageSection';
import { QuotePagePriceSection } from '@/app/database/models/QuotePagePriceSection';

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
  TermConditionsPageContent: Array<{
    TC_PageId: number;
    PageId: number;
    TCPageTitle: string;
    IsAcknowledged: boolean;
    IsSummary: boolean;
    IsPdf: boolean;
    SummaryContent: string;
    PdfFilePath: string;
    IsActive: boolean;
    CreatedBy: number;
    CreatedDate: string;
    ModifiedBy: number | null;
    ModifiedDate: string | null;
  }>;
  WarrantyPageContent: Array<{
    WarrantyPageId: number;
    PageId: number;
    WarrantyPageTitle: string;
    WarrantyDetails: string;
    ThankYouNote: string;
    Signature: string;
    SigneeName: string;
    SigneeTitle: string;
    IsActive: boolean;
    CreatedBy: number;
    CreatedDate: string;
    ModifiedBy: number;
    ModifiedDate: string;
  }>;
  ProductsPricing: Array<{
    ID: number;
    CompanyID: number;
    Name: string;
    Description: string;
    Unit: string;
    MaterialPrice: number;
    Labor: number;
    Margin: number;
    Price: number;
    TaxExemptStatus: boolean;
    IsActive: boolean;
    CreatedBy: number;
    CreatedDate: string;
    ModifiedBy: number | null;
    ModifiedDate: string | null;
  }>;
  QuotePageContent: Array<{
    QuotePageId: number;
    PageId: number;
    QuotePageTitle: string;
    QuoteSubtotal: number;
    Total: number;
    Notes: string;
    IsActive: boolean;
    CreatedBy: number;
    CreatedDate: string;
    ModifiedBy: number | null;
    ModifiedDate: string | null;
  }>;
  QuotePageSection: Array<{
    QuoteSectionId: number;
    QuotePageId: number;
    SectionTitle: string;
    SectionTotal: number;
    IsActive: boolean;
    CreatedBy: number;
    CreatedDate: string;
    ModifiedBy: number | null;
    ModifiedDate: string | null;
  }>;
  QuotePagePriceSection: Array<{
    QuoteP_Price_Sec_Id: number;
    QuoteSectionId: number;
    PriceSectionId: number;
    SectionTotal: number;
    IsActive: boolean;
    CreatedBy: number;
    CreatedDate: string;
    ModifiedBy: number | null;
    ModifiedDate: string | null;
  }>;
}

export const syncService = {
  syncLoginData: async (dataResponse: string, username: string) => {
    try {
      // // console.log.log('dataResponse', dataResponse);
      const data: LoginDataResponse = JSON.parse(dataResponse);
      // // console.log.log('data', data);
      // // console.log.log('Syncing data...');
      
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
          // // console.log.log('Company synced:', company.CompanyName);
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
          // // console.log.log('Role synced:', role.RoleName);
        }
      }

      // Sync Users and UserDetails
      for (const user of data.Users) {
        const existingUserDetail = await UserDetail.getById(user.UserId);
        if (!existingUserDetail) {
          // console.log.log('user', user);
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
          // // console.log.log('UserDetail synced:', user.UserId);
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
          // // console.log.log('User synced:', user.Username);
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
          // // console.log.log('UserRole synced for user:', userRole.UserId);
        }
      }

      // Sync Layouts
      for (const layout of data.Layout) {
        // // console.log.log('layout', layout);
        const existingLayout = await Layouts.getById(layout.LayoutID);
        // // console.log.log('existingLayout', existingLayout);
        if (!existingLayout) {
          // // console.log.log('layout not found. inserting...');
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
          // // console.log.log('Layout synced:', layout.LayoutName);
        } else {
          // // console.log.log('Layout already exists:', layout.LayoutName);
        }
      }

      // Sync Pages
      for (const page of data.Pages) {
        // // console.log.log('page', page);
        const existingPage = await Pages.getById(page.PageId);
        if (!existingPage) {
          // // console.log.log('page.CreatedBy', page.CreatedBy);
          // // console.log.log('page.modified_by', page.ModifiedBy);
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
          // // console.log.log('Page synced:', page.PageName);
        } else {
          // // console.log.log('Page already exists:', page.PageName);
        }
      }

      // Sync LayoutPages
      for (const layoutPage of data.LayoutPages) {
        // // console.log.log('layoutPage', layoutPage);
        const existingLayoutPage = await LayoutPages.getById(layoutPage.LayoutPageId);
        // // console.log.log('existingLayoutPage', existingLayoutPage);
        if (!existingLayoutPage) {
          // // console.log.log('layoutPage not found. inserting...');
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
          // // console.log.log('LayoutPage synced:', layoutPage.LayoutPageId);
        } else {
          // // console.log.log('LayoutPage already exists:', layoutPage.LayoutPageId);
        }
      }

      // Sync TitlePageContent
      for (const titlePage of data.TitlePageContent) {
        // // console.log.log('titlePage', titlePage);
        const existingTitlePage = await TitlePageContent.getById(titlePage.TitlePageId);
        if (!existingTitlePage) {
          // // console.log.log('TitlePageContent not found, inserting...');
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
          // // console.log.log('TitlePage synced:', titlePage.TitleName);
        } else {
          // // console.log.log('TitlePage already exists:', titlePage.TitleName);
        }
      }

      // Sync IntroductionPageContent
      for (const introPage of data.IntroductionPageContent) {
        // console.log.log('introPage', introPage);
        const existingIntroPage = await IntroductionPageContent.getById(introPage.IntroductionPageId);
        if (!existingIntroPage) {
          // console.log.log('IntroductionPageContent not found, inserting...');
          await IntroductionPageContent.insert({
            id: introPage.IntroductionPageId,
            page_id: introPage.PageId,
            introduction_name: introPage.IntroductionTitle,
            introduction_content: introPage.IntroductionContent,
            is_active: introPage.IsActive,
            created_by: introPage.CreatedBy,
            created_date: introPage.CreatedDate,
            modified_by: introPage.ModifiedBy ?? null,
            modified_date: introPage.ModifiedDate ?? ''
          });
          // console.log.log('IntroductionPageInserted synced:', introPage.IntroductionPageId);
        } else {
          // console.log.log('IntroductionPage already exists:', introPage.IntroductionTitle);
        }
      }

      // Sync TermConditionsPageContent
      for (const tcPage of data.TermConditionsPageContent) {
        const existingTCPage = await TermConditionsPageContent.getById(tcPage.TC_PageId);
        if (!existingTCPage) {
          // console.log.log('TermConditionsPageContent not found, inserting...');
          await TermConditionsPageContent.insert({
            id: tcPage.TC_PageId,
            page_id: tcPage.PageId,
            tc_page_title: tcPage.TCPageTitle,
            is_acknowledged: tcPage.IsAcknowledged ? 1 : 0,
            is_summary: tcPage.IsSummary,
            is_pdf: tcPage.IsPdf,
            summary_content: tcPage.SummaryContent,
            pdf_file_path: tcPage.PdfFilePath,
            is_active: tcPage.IsActive,
            created_by: tcPage.CreatedBy,
            created_date: tcPage.CreatedDate,
            modified_by: tcPage.ModifiedBy ?? undefined,
            modified_date: tcPage.ModifiedDate ?? ''
          });
          // console.log.log('TermConditionsPageContentInserted synced:', tcPage.TC_PageId);
        } else {
          // console.log.log('TermConditionsPageContent already exists:', tcPage.TC_PageId);
        }
      }

      // Sync UserCompany
      for (const userCompany of data.UserCompany) {
        // // console.log.log('userCompany', userCompany);
        const existingUserCompany = await UserCompany.getById(userCompany.UserId, userCompany.CompanyId);
        // // console.log.log('existingUserCompany', existingUserCompany);
        if (!existingUserCompany) {
          // // console.log.log('UserCompany not found, inserting...');
          await UserCompany.insert({
            user_id: userCompany.UserId,
            company_id: userCompany.CompanyId,
            is_active: userCompany.IsActive,
            created_by: userCompany.CreatedBy,
            created_date: userCompany.CreatedDate,
            modified_by: userCompany.ModifiedBy ?? null,
            modified_date: userCompany.ModifiedDate ?? ''
          });
          // // console.log.log('UserCompany synced for user:', userCompany.UserId);
        } else {
          // // console.log.log('UserCompany already exists for user:', userCompany.UserId);
        }
      }

      // Sync WarrantyPageContent
      for (const warrantyPage of data.WarrantyPageContent) {
        const existingWarrantyPage = await WarrantyPageContent.getById(warrantyPage.WarrantyPageId);
        if (!existingWarrantyPage) {
          // console.log.log('warrantyPage', warrantyPage);
          await WarrantyPageContent.insert({
            id: warrantyPage.WarrantyPageId,
            page_id: warrantyPage.PageId,
            warranty_page_title: warrantyPage.WarrantyPageTitle,
            warranty_details: warrantyPage.WarrantyDetails,
            thank_you_note: warrantyPage.ThankYouNote,
            signature: warrantyPage.Signature,
            signee_name: warrantyPage.SigneeName,
            signee_title: warrantyPage.SigneeTitle,
            is_active: warrantyPage.IsActive,
            created_by: warrantyPage.CreatedBy,
            created_date: warrantyPage.CreatedDate,
            modified_by: warrantyPage.ModifiedBy,
            modified_date: warrantyPage.ModifiedDate
          });
          // console.log.log('WarrantyPageContent synced:', warrantyPage.WarrantyPageId);
        } else {
          // console.log.log('WarrantyPageContent already exists:', warrantyPage.WarrantyPageId);
        }
      }

      // Sync ProductsPricing
      for (const productPricing of data.ProductsPricing) {
        console.log('productPricing', productPricing);
        const existingProduct = await ProductsPricing.getById(productPricing.ID);
        if (!existingProduct) {
          console.log('ProductsPricing not found, inserting...');
          await ProductsPricing.insert({
            id: productPricing.ID,
            company_id: productPricing.CompanyID,
            name: productPricing.Name,
            description: productPricing.Description,
            unit: productPricing.Unit,
            material_price: productPricing.MaterialPrice,
            labor: productPricing.Labor,
            margin: productPricing.Margin,
            price: productPricing.Price,
            tax_exempt_status: productPricing.TaxExemptStatus,
            is_active: productPricing.IsActive,
            created_by: productPricing.CreatedBy,
            created_date: productPricing.CreatedDate,
            modified_by: productPricing.ModifiedBy ?? null,
            modified_date: productPricing.ModifiedDate ?? null
          });
          console.log('ProductPricing synced:', productPricing.Name);
        }
      }

       // Sync QuotePageContent
       for (const quoteContent of data.QuotePageContent) {
        console.log('quoteContent', quoteContent);
        const existingQuoteContent = await QuotePageContent.getById(quoteContent.QuotePageId);
        if (!existingQuoteContent) {
          console.log('QuotePageContent not found, inserting...');
          await QuotePageContent.insert({
            id: quoteContent.QuotePageId,
            page_id: quoteContent.PageId,
            quote_page_title: quoteContent.QuotePageTitle,
            quote_subtotal: quoteContent.QuoteSubtotal,
            total: quoteContent.Total,
            notes: quoteContent.Notes,
            is_active: quoteContent.IsActive,
            created_by: quoteContent.CreatedBy,
            created_date: quoteContent.CreatedDate,
            modified_by: quoteContent.ModifiedBy,
            modified_date: quoteContent.ModifiedDate
          });
          console.log('QuotePageContentInserted synced:', quoteContent.QuotePageId);
        } else {
          console.log('QuotePageContent already exists:', quoteContent.QuotePageId);
        }
      }

      // Sync QuotePageSection
      for (const quoteSection of data.QuotePageSection) {
        console.log('quoteSection', quoteSection);
        const existingQuoteSection = await QuotePageSection.getById(quoteSection.QuoteSectionId);
        if (!existingQuoteSection) {
          console.log('QuotePageSection not found, inserting...');
          await QuotePageSection.insert({
            id: quoteSection.QuoteSectionId,
            quote_page_id: quoteSection.QuotePageId,
            section_title: quoteSection.SectionTitle,
            section_total: quoteSection.SectionTotal,
            is_active: quoteSection.IsActive,
            created_by: quoteSection.CreatedBy,
            created_date: quoteSection.CreatedDate,
            modified_by: quoteSection.ModifiedBy,
            modified_date: quoteSection.ModifiedDate
          });
          console.log('QuotePageSectionInserted synced:', quoteSection.QuoteSectionId);
        } else {
          console.log('QuotePageSection already exists:', quoteSection.QuoteSectionId);
        }
      }

      // Sync QuotePagePriceSection
      for (const quotePriceSection of data.QuotePagePriceSection) {
        console.log('quotePriceSection', quotePriceSection);
        const existingQuotePriceSection = await QuotePagePriceSection.getById(quotePriceSection.QuoteP_Price_Sec_Id);
        if (!existingQuotePriceSection) {
          console.log('QuotePagePriceSection not found, inserting...');
          await QuotePagePriceSection.insert({
            id: quotePriceSection.QuoteP_Price_Sec_Id,
            quote_section_id: quotePriceSection.QuoteSectionId,
            price_section_id: quotePriceSection.PriceSectionId,
            section_total: quotePriceSection.SectionTotal,
            is_active: quotePriceSection.IsActive,
            created_by: quotePriceSection.CreatedBy,
            created_date: quotePriceSection.CreatedDate,
            modified_by: quotePriceSection.ModifiedBy,
            modified_date: quotePriceSection.ModifiedDate
          });
          console.log('QuotePagePriceSection synced:', quotePriceSection.QuoteP_Price_Sec_Id);
        } else {
          console.log('QuotePagePriceSection already exists:', quotePriceSection.QuoteP_Price_Sec_Id);
        }
      }

      // Set current user using the enhanced function
      useUserStore.getState().setCurrentUserFromLogin(data, username);

      // // console.log.log('Data sync completed successfully');
      return true;
    } catch (error) {
      console.error('Error syncing data:', error);
      return false;
    }
  }
};

export const syncEstimateData = {
    insertSampleEstimates: async () => {
        try {
            // Delete existing estimates and estimate details
            await Estimate.deleteAll(); // Assuming deleteAll() is a method to delete all records
            await EstimateDetail.deleteAll(); // Assuming deleteAll() is a method to delete all records

            // Insert new estimates
            await Estimate.insert({
                id: 1,
                company_id: 1,
                user_id: 1002,
                estimate_name: "Gutter Installation Project",
                description: "Complete gutter installation for residential property",
                estimate_status: "provided",
                is_active: true,
                created_by: 1,
                modified_by: 1,
                created_date: new Date().toISOString(),
                modified_date: new Date().toISOString()
            });

            await EstimateDetail.insert({
                id: 1,
                estimate_id: 1,
                estimate_number: '4573452677',
                sales_person: "Demo User",
                email: "user@democompany.com",
                phone: "0987654321",
                estimate_revenue: "5000",
                next_call_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
                image_url: "house-1.jpg",
                address: "123 Main Street",
                state: "California",
                zip_code: "92101",
                is_active: true,
                created_by: 1,
                modified_by: 1,
                created_date: new Date().toISOString(),
                modified_date: new Date().toISOString()
            });

            await Estimate.insert({
                id: 2,
                company_id: 1,
                user_id: 1002,
                estimate_name: "Gutter Repair Project",
                description: "Emergency gutter repair and maintenance",
                estimate_status: "provided",
                is_active: true,
                created_by: 1,
                modified_by: 1,
                created_date: new Date().toISOString(),
                modified_date: new Date().toISOString()
            });

            await EstimateDetail.insert({
                id: 2,
                estimate_id: 2,
                estimate_number: '2234576654',
                sales_person: "Demo User",
                email: "user@democompany.com",
                phone: "0987654321",
                estimate_revenue: "2500",
                next_call_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
                image_url: "house-2.jpg",
                address: "456 Oak Avenue",
                state: "California",
                zip_code: "92102",
                is_active: true,
                created_by: 1,
                modified_by: 1,
                created_date: new Date().toISOString(),
                modified_date: new Date().toISOString()
            });

            // console.log.log('Sample estimates inserted successfully');
        } catch (error) {
            console.error('Error inserting sample estimates:', error);
            return false;
        }
    }
};