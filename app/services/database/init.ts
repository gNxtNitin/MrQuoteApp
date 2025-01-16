import * as SQLite from 'expo-sqlite';
import { Company } from '../../database/models/Company';
import { Role } from '../../database/models/Role';
import { UserDetail } from '../../database/models/UserDetail';
import { User } from '../../database/models/User';
import { Estimate } from '../../database/models/Estimate';
import { EstimateDetail } from '../../database/models/EstimateDetail';
import { UserRole } from '@/app/database/models/UserRole';
import { ReportTheme } from '@/app/database/models/ReportTheme';
import { Menu } from '@/app/database/models/Menu';
import { UserMenuAccess } from '@/app/database/models/UserMenuAccess';
import { RoofMeasurementToken } from '@/app/database/models/RoofMeasurementToken';
import { RoofingAccessories } from '@/app/database/models/RoofingAccessories';
import { RoofPitch } from '@/app/database/models/RoofPitch';
import { ResidentialMetals } from '@/app/database/models/ResidentialMetals';
import { WallMeasurementToken } from '@/app/database/models/WallMeasurementToken';
import { Report } from '@/app/database/models/Report';
import { Pages } from '@/app/database/models/Pages';
import { Layouts } from '@/app/database/models/Layouts';
import { ReportPages } from '@/app/database/models/ReportPages';
import { LayoutPages } from '@/app/database/models/LayoutPages';
import { TitlePageContent } from '@/app/database/models/TitlePageContent';
import { IntroductionPageContent } from '@/app/database/models/IntroductionPageContent';
import { InspectionPageContent } from '@/app/database/models/InspectionPageContent';
import { TemplatesCategory } from '@/app/database/models/TemplatesCategory';
import { Templates } from '@/app/database/models/Templates';
import { TemplatePages } from '@/app/database/models/TemplatePages';
import { CustomEmailInvoiceQuickText } from '@/app/database/models/CustomEmailInvoiceQuickText';
import { Folders } from '@/app/database/models/Folders';
import { Files } from '@/app/database/models/Files';
import { UnitOfMeasurement } from '@/app/database/models/UnitOfMeasurement';
import { MeasurementCategory } from '@/app/database/models/MeasurementCategory';
import { MeasurementToken } from '@/app/database/models/MeasurementToken';
import { ProductsPricing } from '@/app/database/models/ProductsPricing';
import { TaxSetting } from '@/app/database/models/TaxSetting';
import { SectionStyle } from '@/app/database/models/SectionStyle';
import { InspectionPageSection } from '@/app/database/models/InspectionPageSection';
import { InspectionSectionItems } from '@/app/database/models/InspectionSectionItems';
import { QuotePageContent } from '@/app/database/models/QuotePageContent';
import { QuotePageSection } from '@/app/database/models/QuotePageSection';
import { QuotePagePriceSection } from '@/app/database/models/QuotePagePriceSection';
import { PriceSection } from '@/app/database/models/PriceSection';
import { PriceSectionDetail } from '@/app/database/models/PriceSectionDetail';
import { AuthorizationPageContent } from '@/app/database/models/AuthorizationPageContent';
import { AuthPagePriceSection } from '@/app/database/models/AuthPagePriceSection';
import { AuthProductSelection } from '@/app/database/models/AuthProductSelection';
import { AuthPrimarySigner } from '@/app/database/models/AuthPrimarySigner';
import { TermConditionsPageContent } from '@/app/database/models/TermConditionsPageContent';
import { InvoicePageContent } from '@/app/database/models/InvoicePageContent';
import { CustomPageContent } from '@/app/database/models/CustomPageContent';
import { MaterialPageContent } from '@/app/database/models/MaterialPageContent';
import { Canvas } from '@/app/database/models/Canvas';

// Create singleton database instance
let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Opens or returns existing SQLite database instance
 */
export function openDatabase(): SQLite.SQLiteDatabase {
    if (!dbInstance) {
        try {
            dbInstance = SQLite.openDatabaseSync('mrQuote.db');
            console.log('Database opened successfully');
        } catch (error) {
            console.error('Error opening database:', error);
            throw error;
        }
    }
    return dbInstance;
}

async function isDatabaseEmpty(db: SQLite.SQLiteDatabase): Promise<boolean> {
    try {
        const result = await db.getFirstAsync<{ count: number }>(
            "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='user_details'"
        );
        return !result || result.count === 0;
    } catch (error) {
        console.log('Database is empty or first run');
        return true;
    }
}

/**
 * Initializes database schema and sample data
 */
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
    try {
        const database = openDatabase();

        // Enable WAL mode and foreign keys
        await database.execAsync('PRAGMA journal_mode = WAL');
        await database.execAsync('PRAGMA foreign_keys = ON');

        const shouldInitialize = await isDatabaseEmpty(database);

        await database.withTransactionAsync(async () => {
            try {
                // Create tables in correct order (TemplatesCategory first, then Templates, then TemplatePages)
                await Company.createTable();
                await Role.createTable();
                await UserDetail.createTable();
                await User.createTable();
                await Estimate.createTable();
                await EstimateDetail.createTable();
                await UserRole.createTable();
                await ReportTheme.createTable();
                await Menu.createTable();
                await UserMenuAccess.createTable();
                await RoofMeasurementToken.createTable();
                await RoofingAccessories.createTable();
                await RoofPitch.createTable();
                await ResidentialMetals.createTable();
                await WallMeasurementToken.createTable();
                await Report.createTable();
                await Pages.createTable();
                await Layouts.createTable();
                await ReportPages.createTable();
                await LayoutPages.createTable();
                await TitlePageContent.createTable();
                await IntroductionPageContent.createTable();
                await InspectionPageContent.createTable();
                await TemplatesCategory.createTable();
                await Templates.createTable();
                await TemplatePages.createTable();
                await CustomEmailInvoiceQuickText.createTable();
                await Folders.createTable();
                await Files.createTable();
                await UnitOfMeasurement.createTable();
                await MeasurementCategory.createTable();
                await MeasurementToken.createTable();
                await ProductsPricing.createTable();
                await TaxSetting.createTable();
                await SectionStyle.createTable();
                await InspectionPageSection.createTable();
                await InspectionSectionItems.createTable();
                await QuotePageContent.createTable();
                await QuotePageSection.createTable();
                await QuotePagePriceSection.createTable();
                await PriceSection.createTable();
                await PriceSectionDetail.createTable();
                await AuthorizationPageContent.createTable();
                await AuthPagePriceSection.createTable();
                await AuthProductSelection.createTable();
                await AuthPrimarySigner.createTable();
                await TermConditionsPageContent.createTable();
                await InvoicePageContent.createTable();
                await CustomPageContent.createTable();
                await MaterialPageContent.createTable();
                await Canvas.createTable();

                // Only insert sample data if database is empty
                if (shouldInitialize) {
                    console.log('Initializing database with sample data...');
                    
                    // Insert sample data
                    await Company.insert({
                        id: 1,
                        company_name: 'Mr. Gutter',
                        company_phone_number: '1234567890',
                        company_email: 'contact@gutter.com',
                        area_title: 'USA',
                        area_name_1: 'California',
                        area_name_2: 'San Diego',
                        business_number: 'BN123456',
                        company_logo: 'gutter',
                        is_active: true
                    });

                    await Company.insert({
                        id: 2,
                        company_name: 'Mr. Roofing',
                        company_phone_number: '0987654321',
                        company_email: 'contact@roofing.com',
                        business_number: 'BN654321',
                        web_address: 'www.roofing.com',
                        company_logo: 'roofing',
                        is_active: true
                    });
                    
                    await Role.insert({
                        id: 1,
                        role_name: 'User',
                        is_active: true
                    });

                    await UserDetail.insert({
                        id: 1,
                        username: 'demo',
                        password_hash: 'demo123',
                        email: 'user@democompany.com',
                        first_name: 'Demo',
                        last_name: 'User',
                        phone_number: '0987654321',
                        company_id: '[1, 2]',
                        is_active: true,
                        is_logged_in: false,
                        created_date: new Date().toISOString(),
                        modified_date: new Date().toISOString()
                    });

                    // Insert user records
                    await User.insert({
                        id: 1,
                        user_detail_id: 1,
                        created_date: new Date().toISOString(),
                        modified_date: new Date().toISOString()
                    });

                    await UserDetail.insert({
                        id: 2,
                        username: 'demo2',
                        password_hash: 'demo123',
                        email: 'user2@democompany.com',
                        first_name: 'Demo2',
                        last_name: 'User2',
                        phone_number: '0987654321',
                        company_id: '[2]',
                        is_active: true,
                        is_logged_in: false,
                        created_date: new Date().toISOString(),
                        modified_date: new Date().toISOString()
                    });

                    // Insert user records
                    await User.insert({
                        id: 2,
                        user_detail_id: 2,
                        created_date: new Date().toISOString(),
                        modified_date: new Date().toISOString()
                    });

                    UserRole.insert({
                        id: 1,
                        role_id: 1,
                        user_id: 1,
                        created_date: new Date().toISOString(),
                        modified_date: new Date().toISOString()
                    });

                    UserRole.insert({
                        id: 2,
                        role_id: 1,
                        user_id: 2,
                        created_date: new Date().toISOString(),
                        modified_date: new Date().toISOString()
                    });

                    // Insert sample estimates
                    await Estimate.insert({
                        id: 1,
                        company_id: 1,
                        user_id: 2,
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
                        user_id: 1,
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

                    await Estimate.insert({
                        id: 3,
                        company_id: 2,
                        user_id: 2,
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
                        id: 3,
                        estimate_id: 3,
                        estimate_number: '8766789879',
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

                    await Estimate.insert({
                        id: 4,
                        company_id: 2,
                        user_id: 1,
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
                        id: 4,
                        estimate_id: 4,
                        estimate_number: '6578654320',
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

                    await Estimate.insert({
                        id: 5,
                        company_id: 2,
                        user_id: 1,
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
                        id: 5,
                        estimate_id: 5,
                        estimate_number: '7656753420',
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

                    // // Add sample report themes
                    // await ReportTheme.insert({
                    //     id: 1,
                    //     theme_name: 'Default Theme',
                    //     description: 'Default report theme',
                    //     created_by: 1,
                    //     modified_by: 1,
                    //     created_date: new Date().toISOString(),
                    //     modified_date: new Date().toISOString()
                    // });

                    // await ReportTheme.insert({
                    //     id: 2,
                    //     theme_name: 'Professional Theme',
                    //     description: 'Professional looking report theme',
                    //     created_by: 1,
                    //     modified_by: 1,
                    //     created_date: new Date().toISOString(),
                    //     modified_date: new Date().toISOString()
                    // });

                    // Add sample menu items
                    // await Menu.insert({
                    //     id: 1,
                    //     menu_name: 'Dashboard',
                    //     area: 'Home',
                    //     controller_name: 'HomeScreen',
                    //     url: '/home',
                    //     order_number: 1,
                    //     is_active: true,
                    //     created_by: 1,
                    //     modified_by: 1
                    // });

                    // await Menu.insert({
                    //     id: 2,
                    //     menu_name: 'Estimates',
                    //     area: 'Estimates',
                    //     controller_name: 'EstimateScreen',
                    //     url: '/estimates',
                    //     order_number: 2,
                    //     is_active: true,
                    //     created_by: 1,
                    //     modified_by: 1
                    // });

                    // // Add sample user menu access entries
                    // await UserMenuAccess.insert({
                    //     id: 1,
                    //     role_id: 1,
                    //     menu_id: 1,
                    //     is_active: true,
                    //     created_by: 1,
                    //     modified_by: 1
                    // });

                    // await UserMenuAccess.insert({
                    //     id: 2,
                    //     role_id: 1,
                    //     menu_id: 2,
                    //     is_active: true,
                    //     created_by: 1,
                    //     modified_by: 1
                    // });

                    // Add sample roof measurement data
                    await RoofMeasurementToken.insert({
                        id: 1,
                        estimate_id: 1,
                        total_roof_area: 2500,
                        total_eaves: '120',
                        total_rakes: '80',
                        total_valleys: '40',
                        total_ridges_hips: '60',
                        total_hips: '30',
                        total_ridges: '30',
                        suggested_waste_percentage: '10',
                        quick_squares: '25',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample roofing accessories data
                    // await RoofingAccessories.insert({
                    //     id: 1,
                    //     estimate_id: 1,
                    //     vents_standard: '5',
                    //     vents_turbine: '2',
                    //     vents_phoenix: '1',
                    //     exhaust_cap: '3',
                    //     pipe_jacks: '4',
                    //     bin_disposal_roofing: '1',
                    //     skylights: '2',
                    //     skylight_flashing_kits: '2',
                    //     chimney_flashing_kits_average: '1',
                    //     chimney_flashing_kits_large: '0',
                    //     minimum_charge: 500,
                    //     labor_hours: new Date().toISOString(),
                    //     modified_by: 1
                    // });

                    // // Add sample roof pitch data
                    // await RoofPitch.insert({
                    //     id: 1,
                    //     estimate_id: 1,
                    //     eight_by_twelve: '25',
                    //     seven_by_twelve: '20',
                    //     nine_by_twelve: '15',
                    //     ten_by_twelve: '10',
                    //     eleven_by_twelve: '5',
                    //     twelve_by_twelve: '25'
                    // });

                    // Add sample residential metals data
                    // await ResidentialMetals.insert({
                    //     id: 1,
                    //     estimate_id: 1,
                    //     gutters: 150,
                    //     downspouts: '8'
                    // });

                    // Add sample wall measurement data
                    // await WallMeasurementToken.insert({
                    //     id: 1,
                    //     estimate_id: 1,
                    //     total_wall_area: 1800,
                    //     north_wall_area: '500',
                    //     east_wall_area: '400',
                    //     south_wall_area: '500',
                    //     west_wall_area: '400',
                    //     bin_disposal_siding: '1'
                    // });

                    // Add sample report data
                    // await Report.insert({
                    //     id: 1,
                    //     estimate_id: 1,
                    //     report_name: 'Initial Report',
                    //     description: 'First assessment report',
                    //     report_status: 'DRAFT',
                    //     is_active: true,
                    //     created_by: 1,
                    //     modified_by: 1
                    // });

                    // Add sample pages data
                    await Pages.insert({
                        id: 1,
                        page_name: 'Sample Page',
                        description: 'Sample Pages for Layout',
                        is_template: true,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1,
                        created_date: new Date().toISOString(),
                        modified_date: new Date().toISOString()
                    });

                    // Add sample title page content
                    await TitlePageContent.insert({
                        id: 1,
                        page_id: 1,
                        title_name: 'Title',
                        report_type: 'Roofing System',
                        primary_image: null,
                        certification_logo: null,
                        first_name: null,
                        last_name: null,
                        company_name: null,
                        address: null,
                        city: null,
                        state: null,
                        zip_code: null,
                        created_by: 1,
                        created_date: new Date().toISOString(),
                        modified_by: 1,
                        modified_date: new Date().toISOString()
                    });

                    // Add sample introduction page content
                    await IntroductionPageContent.insert({
                        id: 1,
                        page_id: 1,
                        introduction_name: 'Introduction',
                        introduction_content: 'Welcome to our detailed project assessment report. This document provides a comprehensive overview of our findings and recommendations.',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    //TODO: Inspection Page
                    // Add sample inspection page content
                    await InspectionPageContent.insert({
                        id: 1,
                        page_id: 1,
                        inspection_title: 'Property Inspection Report',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1,
                        created_date: new Date().toISOString(),
                        modified_date: new Date().toISOString()
                    });

                     // Add sample section styles
                     await SectionStyle.insert({
                        id: 1,
                        style_name: 'Default Style',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1,
                        created_date: new Date().toISOString(),
                        modified_date: new Date().toISOString()
                    });

                    await SectionStyle.insert({
                        id: 2,
                        style_name: 'Modern Style',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1,
                        created_date: new Date().toISOString(),
                        modified_date: new Date().toISOString()
                    });

                    await SectionStyle.insert({
                        id: 3,
                        style_name: 'Classic Style',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1,
                        created_date: new Date().toISOString(),
                        modified_date: new Date().toISOString()
                    });

                    // Add sample inspection page sections
                    await InspectionPageSection.insert({
                        id: 1,
                        inspection_page_id: 1,
                        section_style_id: 1,
                        section_title: 'Roof Inspection',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    await InspectionPageSection.insert({
                        id: 2,
                        inspection_page_id: 1,
                        section_style_id: 2,
                        section_title: 'Gutter Assessment',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample inspection section items
                    await InspectionSectionItems.insert({
                        id: 1,
                        inspection_section_id: 1,
                        inspection_file: 'roof-damage.jpg',
                        inspection_content: 'Significant wear observed on the north-facing shingles. Multiple shingles showing signs of deterioration.',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    //TODO: Layout Pages (Canvas)
                    
                    //TODO: Quote Page

                    //TODO: Authorization Page

                    //TODO: Terms and Conditions Page

                    // Add sample layouts data
                    await Layouts.insert({
                        id: 1,
                        company_id: 1,
                        layout_name: 'Default Report Layout',
                        layout_type: 'Report',
                        description: 'Standard report layout',
                        is_shared: true,
                        is_active: true,
                        is_default: true,
                        created_by: 1,
                        modified_by: 1,
                        created_date: new Date().toISOString(),
                        modified_date: new Date().toISOString()
                    });

                    await Layouts.insert({
                        id: 2,
                        company_id: 1,
                        layout_name: 'Default Report Layout 2',
                        layout_type: 'Report',
                        description: 'Standard report layout 2',
                        is_shared: true,
                        is_active: true,
                        is_default: false,
                        created_by: 1,
                        modified_by: 1
                    });

                    await Layouts.insert({
                        id: 3,
                        company_id: 1,
                        layout_name: 'Default Report Layout 3',
                        layout_type: 'Report',
                        description: 'Standard report layout 3',
                        is_shared: true,
                        is_active: true,
                        is_default: false,
                        created_by: 1,
                        modified_by: 1
                    });

                    await Layouts.insert({
                        id: 4,
                        company_id: 1,
                        layout_name: 'Default Report Layout 4',
                        layout_type: 'Report',
                        description: 'Standard report layout 4',
                        is_shared: true,
                        is_active: true,
                        is_default: false,
                        created_by: 1,
                        modified_by: 1
                    });

                    await Layouts.insert({
                        id: 5,
                        company_id: 1,
                        layout_name: 'Default Report Layout Local 1',
                        layout_type: 'Report',
                        description: 'Standard report layout local 1',
                        is_shared: false,
                        is_active: true,
                        is_default: false,
                        created_by: 1,
                        modified_by: 1
                    });

                    await Layouts.insert({
                        id: 6,
                        company_id: 1,
                        layout_name: 'Default Report Layout Local 2',
                        layout_type: 'Report',
                        description: 'Standard report layout local 2',
                        is_shared: false,
                        is_active: true,
                        is_default: false,
                        created_by: 1,
                        modified_by: 1
                    });

                    await Layouts.insert({
                        id: 7,
                        company_id: 1,
                        layout_name: 'Default Report Layout Local 3',
                        layout_type: 'Report',
                        description: 'Standard report layout local 3',
                        is_shared: false,
                        is_active: true,
                        is_default: false,
                        created_by: 1,
                        modified_by: 1
                    }); 

                    await Layouts.insert({
                        id: 8,
                        company_id: 1,
                        layout_name: 'Default Report Layout Local 4',
                        layout_type: 'Report',
                        description: 'Standard report layout local 4',
                        is_shared: false,
                        is_active: true,
                        is_default: false,
                        created_by: 1,
                        modified_by: 1
                    });

                    await Layouts.insert({
                        id: 9,
                        company_id: 2,
                        layout_name: 'Default Report Layout Local 5',
                        layout_type: 'Report',
                        description: 'Standard report layout local 5',
                        is_shared: false,
                        is_active: true,
                        is_default: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    await Layouts.insert({
                        id: 10,
                        company_id: 2,
                        layout_name: 'Default Report Layout 6',
                        layout_type: 'Report',
                        description: 'Standard report layout 6',
                        is_shared: true,
                        is_active: true,
                        is_default: false,
                        created_by: 1,
                        modified_by: 1
                    });


                    // Add sample layout pages data
                    await LayoutPages.insert({
                        id: 1,
                        page_id: 1,
                        layout_id: 1,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    await LayoutPages.insert({
                        id: 2,
                        page_id: 1,
                        layout_id: 2,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    await LayoutPages.insert({
                        id: 3,
                        page_id: 1,
                        layout_id: 3,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    await LayoutPages.insert({
                        id: 4,
                        page_id: 1,
                        layout_id: 4,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    await LayoutPages.insert({
                        id: 5,
                        page_id: 1,
                        layout_id: 5,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    await LayoutPages.insert({
                        id: 6,
                        page_id: 1,
                        layout_id: 6,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    await LayoutPages.insert({
                        id: 7,
                        page_id: 1,
                        layout_id: 7,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    await LayoutPages.insert({
                        id: 8,
                        page_id: 1,
                        layout_id: 8,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    await LayoutPages.insert({
                        id: 9,
                        page_id: 1,
                        layout_id: 9,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    await LayoutPages.insert({
                        id: 10,
                        page_id: 1,
                        layout_id: 10,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample templates category
                    await TemplatesCategory.insert({
                        template_cat_id: 1,
                        company_id: 1,
                        category_name: 'Roofing Templates',
                        description: 'Standard templates for roofing inspections',
                        is_active: true,
                        created_by: 1
                    });

                    // Add sample template data
                    await Templates.insert({
                        id: 1,
                        template_cat_id: 1,
                        company_id: 1,
                        template_type: 'Report',
                        template_name: 'Standard Inspection Report',
                        description: 'Default template for inspection reports',
                        is_shared: true,
                        is_active: true,
                        created_by: 1
                    });

                    // Add sample template pages data
                    await TemplatePages.insert({
                        id: 1,
                        page_id: 1,
                        template_id: 1,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample quick text
                    await CustomEmailInvoiceQuickText.insert({
                        id: 1,
                        company_id: 1,
                        template_id: 1,
                        content: 'Thank you for your business. Please find your invoice attached.',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample folder
                    await Folders.insert({
                        id: 1,
                        company_id: 1,
                        folder_name: 'Reports',
                        is_shared: true,
                        is_active: true,
                        owner_id: 1,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample file
                    await Files.insert({
                        id: 1,
                        folder_id: 1,
                        company_id: 1,
                        file_name: 'Sample Report.pdf',
                        file_type: 'application/pdf',
                        file_size: 1024,
                        file_path: '/storage/reports/sample.pdf',
                        owner_id: 1,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample unit of measurement
                    await UnitOfMeasurement.insert({
                        id: 1,
                        company_id: 1,
                        unit_name: 'Square Feet',
                        description: 'Standard unit for area measurement',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample measurement category
                    await MeasurementCategory.insert({
                        id: 1,
                        company_id: 1,
                        category_name: 'Roofing Measurements',
                        order_number: 1,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample measurement token
                    await MeasurementToken.insert({
                        id: 1,
                        company_id: 1,
                        token_name: 'Total Roof Area',
                        unit_of_measurement_id: 1,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample products pricing
                    await ProductsPricing.insert({
                        id: 1,
                        company_id: 1,
                        name: 'Standard Shingles',
                        description: 'Basic roofing shingles',
                        unit: 'sq ft',
                        material_price: 2.50,
                        labor: 1.75,
                        margin: 0.30,
                        price: 5.50,
                        tax_exempt_status: false,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample tax setting
                    await TaxSetting.insert({
                        id: 1,
                        company_id: 1,
                        tax_name: 'Sales Tax',
                        description: 'Standard sales tax rate',
                        tax_rate: 8.50,
                        is_required: true,
                        order_number: 1,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample canvas
                    await Canvas.insert({
                        id: 1,
                        page_id: 1,
                        paths: '[]',
                        current_path: '',
                        created_by: 1,
                        created_date: new Date().toISOString(),
                        is_active: true
                    });

                    // Add sample quote page content
                    await QuotePageContent.insert({
                        id: 1,
                        page_id: 1,
                        quote_page_title: 'Project Quote',
                        quote_subtotal: 2500.00,
                        total: 2875.00,
                        notes: 'Price includes materials and labor. Valid for 30 days.',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample quote page sections
                    await QuotePageSection.insert({
                        id: 1,
                        quote_page_id: 1,
                        section_title: 'Roofing Materials',
                        section_total: 1500.00,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    await QuotePageSection.insert({
                        id: 2,
                        quote_page_id: 1,
                        section_title: 'Labor Costs',
                        section_total: 1000.00,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample quote page price sections
                    await QuotePagePriceSection.insert({
                        id: 1,
                        quote_section_id: 1,
                        price_section_id: 1,
                        section_total: 1500.00,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    await QuotePagePriceSection.insert({
                        id: 2,
                        quote_section_id: 2,
                        price_section_id: 1,
                        section_total: 1000.00,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample price sections
                    await PriceSection.insert({
                        id: 1,
                        company_id: 1,
                        item: 'Architectural Shingles',
                        quantity: 50,
                        price: 75.00,
                        line_total: 3750.00,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    await PriceSection.insert({
                        id: 2,
                        company_id: 1,
                        item: 'Labor - Installation',
                        quantity: 40,
                        price: 45.00,
                        line_total: 1800.00,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample price section details
                    await PriceSectionDetail.insert({
                        id: 1,
                        price_section_id: 1,
                        name: 'Premium Shingles',
                        description: 'High-quality architectural shingles',
                        unit: 'sq ft',
                        material: 45.00,
                        line_total: 2250.00,
                        labor: 30.00,
                        margin: 15.00,
                        price: 90.00,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    await PriceSectionDetail.insert({
                        id: 2,
                        price_section_id: 1,
                        name: 'Underlayment',
                        description: 'Synthetic underlayment material',
                        unit: 'roll',
                        material: 85.00,
                        line_total: 425.00,
                        labor: 25.00,
                        margin: 10.00,
                        price: 120.00,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample authorization page content
                    await AuthorizationPageContent.insert({
                        id: 1,
                        page_id: 1,
                        authorization_page_title: 'Project Authorization',
                        disclaimer: 'By signing below, you agree to the terms and conditions outlined in this document.',
                        section_title: 'Authorization Details',
                        footer_notes: 'Please read all terms carefully before signing.',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample auth page price sections
                    await AuthPagePriceSection.insert({
                        id: 1,
                        authorization_page_id: 1,
                        price_section_id: 1,
                        section_total: 3750.00,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    await AuthPagePriceSection.insert({
                        id: 2,
                        authorization_page_id: 1,
                        price_section_id: 2,
                        section_total: 1800.00,
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample auth product selections
                    await AuthProductSelection.insert({
                        id: 1,
                        authorization_page_id: 1,
                        item: 'Shingle Type',
                        selection: 'Architectural Shingles',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    await AuthProductSelection.insert({
                        id: 2,
                        authorization_page_id: 1,
                        item: 'Underlayment',
                        selection: 'Synthetic Underlayment',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample auth primary signer
                    await AuthPrimarySigner.insert({
                        auth_p_signer_id: 1,
                        authorization_page_id: 1,
                        first_name: 'John',
                        last_name: 'Smith',
                        email_address: 'john.smith@example.com',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample terms and conditions page content
                    await TermConditionsPageContent.insert({
                        id: 1,
                        page_id: 1,
                        tc_page_title: 'Terms and Conditions',
                        is_acknowledged: false,
                        is_summary: true,
                        is_pdf: true,
                        summary_content: 'This document outlines the terms and conditions for our services. Please read carefully before proceeding.',
                        pdf_file_path: '/storage/terms/terms_and_conditions.pdf',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample invoice page content
                    await InvoicePageContent.insert({
                        id: 1,
                        page_id: 1,
                        invoice_page_title: 'Project Invoice',
                        invoice_terms: 'Net 30 - Payment is due within 30 days of invoice date',
                        invoice_notes: 'Thank you for your business. Please make checks payable to Demo Company.',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample custom page content
                    await CustomPageContent.insert({
                        id: 1,
                        page_id: 1,
                        custom_page_title: 'Additional Information',
                        is_acknowledged: false,
                        my_pdf: 'my_document.pdf',
                        shared_pdf: 'shared_document.pdf',
                        single_use: 'single_use_document.pdf',
                        text_page_notes: 'Additional notes and information about the project.',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    // Add sample material page content
                    await MaterialPageContent.insert({
                        id: 1,
                        page_id: 1,
                        material_page_title: 'Project Materials',
                        job_number: 'JOB-2024-001',
                        start_date: new Date('2024-02-01').toISOString(),
                        delivery_date: new Date('2024-02-15').toISOString(),
                        address_line1: '789 Pine Street',
                        city: 'San Diego',
                        state: 'CA',
                        zip: '92103',
                        is_active: true,
                        created_by: 1,
                        modified_by: 1
                    });

                    console.log('Sample data inserted successfully');
                } else {
                    console.log('Database already contains data, skipping sample data insertion');
                }
                
                console.log('Database initialized successfully');
            } catch (error) {
                console.error('Error in transaction:', error);
                throw error;
            }
        });

        return database;
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}

// Export database types
export type Database = SQLite.SQLiteDatabase;
