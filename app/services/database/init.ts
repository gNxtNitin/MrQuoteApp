import * as SQLite from 'expo-sqlite';

export const openDatabase = ():SQLite.SQLiteDatabase => {
  const db:SQLite.SQLiteDatabase = SQLite.openDatabaseSync('mrQuote.db');
  return db;
};

export const initDatabase = async () => {
    const db = openDatabase();

    // Create tables
    db.withTransactionAsync(async() => { 
        try {
            await db.execAsync(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                user_detail_id INTEGER,
                role_id INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'active',
                FOREIGN KEY (user_detail_id) REFERENCES user_details(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE
            );`
            );
            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS user_roles (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                role_name TEXT,
                description TEXT,
                is_active BOOLEAN,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP
            );`
            );
            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS user_details (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                company_id INTEGER,
                first_name TEXT,
                last_name TEXT,
                username TEXT,
                email TEXT,
                phone_number TEXT,
                password_hash TEXT,
                pin INTEGER,
                face_id TEXT,
                is_logged_in BOOLEAN,
                is_first_login BOOLEAN,
                last_login_at DATETIME,
                is_active BOOLEAN,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE
            );`
            );
            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS roles (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                role_name TEXT,
                description TEXT,
                is_active BOOLEAN,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_by INTEGER,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
            );`
            );
            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS companies (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                parent_company_id INTEGER,
                report_theme_id INTEGER,
                company_name TEXT,
                company_phone_number TEXT,
                company_email TEXT,
                business_number TEXT,
                company_logo TEXT,
                web_address TEXT,
                area_title TEXT,
                area_name_1 TEXT,
                area_name_2 TEXT,
                created_by INTEGER,
                modified_by INTEGER,
                is_active BOOLEAN,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (parent_company_id) REFERENCES companies(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (report_theme_id) REFERENCES report_themes(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
            );`
            );
            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS report_themes (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                theme_name TEXT,
                description TEXT,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_by INTEGER,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
            );`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS menu (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                parent_id INTEGER,
                menu_name TEXT,
                area TEXT,
                controller_name TEXT,
                action_name TEXT,
                url TEXT,
                order_number INTEGER,
                is_active BOOLEAN,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_by INTEGER,    
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (parent_id) REFERENCES menu(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS user_menu_access (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                role_id INTEGER,
                menu_id INTEGER,
                is_active BOOLEAN,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_by INTEGER,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (menu_id) REFERENCES menu(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS company_report_themes (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                company_id INTEGER,
                report_theme_id INTEGER,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_by INTEGER,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (report_theme_id) REFERENCES report_themes(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );
            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS estimate (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                company_id INTEGER,
                estimate_name TEXT,
                description TEXT,
                estimate_status TEXT,
                is_active BOOLEAN,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_by INTEGER,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS estimate_details (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                estimate_id INTEGER,
                estimate_number INTEGER,
                sales_person TEXT,
                estimate_created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                estimate_revenue TEXT,
                next_call_date DATETIME,
                image_url TEXT,
                address TEXT,
                state TEXT,
                zip_code TEXT,
                is_active BOOLEAN,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_by INTEGER,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (estimate_id) REFERENCES estimate(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS roof_measurement_token (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                estimate_id INTEGER,
                total_roof_area INTEGER,
                total_eaves TEXT,
                total_rakes TEXT,
                total_valleys TEXT,
                total_ridges_hips TEXT,
                total_hips TEXT,
                total_ridges TEXT,
                suggested_waste_percentage TEXT,
                quick_squares TEXT,
                is_active BOOLEAN,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_by INTEGER,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (estimate_id) REFERENCES estimate(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS roofing_accessories (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                estimate_id INTEGER,
                vents_standard TEXT,
                vents_turbine TEXT,
                vents_phoenix TEXT,
                exhaust_cap TEXT,
                pipe_jacks TEXT,
                bin_disposal_roofing TEXT,
                skylights TEXT,
                skylight_flashing_kits TEXT,
                chimney_flashing_kits_average TEXT,
                chimney_flashing_kits_large TEXT,
                minimum_charge INTEGER NULL,
                labor_hours DATETIME,
                modified_by INTEGER,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (estimate_id) REFERENCES estimate(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS wall_measurement_token (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                estimate_id INTEGER,
                total_wall_area INTEGER,
                north_wall_area TEXT,
                east_wall_area TEXT,
                south_wall_area TEXT,
                west_wall_area TEXT,
                bin_disposal_siding TEXT,
                FOREIGN KEY (estimate_id) REFERENCES estimate(id) ON DELETE CASCADE ON UPDATE CASCADE
                )`
            );
            
            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS roof_pitch (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                estimate_id INTEGER,
                eight_by_twelve TEXT,
                seven_by_twelve TEXT,
                nine_by_twelve TEXT,
                ten_by_twelve TEXT,
                eleven_by_twelve TEXT,
                twelve_by_twelve TEXT,
                FOREIGN KEY (estimate_id) REFERENCES estimate(id) ON DELETE CASCADE ON UPDATE CASCADE
                )`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS residential_metals (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                estimate_id INTEGER,
                gutters INTEGER,
                downspouts TEXT,
                FOREIGN KEY (estimate_id) REFERENCES estimate(id) ON DELETE CASCADE ON UPDATE CASCADE
                )`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS report (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                estimate_id INTEGER,
                report_name TEXT,
                description TEXT,
                report_status TEXT,
                is_active BOOLEAN DEFAULT TRUE,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_by INTEGER,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (estimate_id) REFERENCES estimate(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS report_pages (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                page_id INTEGER,
                report_id INTEGER,
                is_active BOOLEAN DEFAULT TRUE,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_by INTEGER,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (report_id) REFERENCES report(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );
            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS layouts (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                company_id INTEGER,
                layout_name TEXT,
                layout_type TEXT CHECK(layout_type IN ('Report', 'Order')),
                description TEXT,
                is_shared BOOLEAN,
                is_active BOOLEAN,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_by INTEGER,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS CompanyLayout (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                company_id INTEGER,
                layout_id INTEGER,
                is_active BOOLEAN,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_by INTEGER,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (layout_id) REFERENCES layouts(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS pages (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                page_name TEXT,
                description TEXT NULL,
                is_template BOOLEAN,
                is_active BOOLEAN,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_by INTEGER,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS LayoutPages (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                page_id INTEGER,
                layout_id INTEGER,
                is_active BOOLEAN DEFAULT TRUE,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_by INTEGER,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (layout_id) REFERENCES layouts(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );
            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS title_page_content (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                page_id INTEGER,
                title_name TEXT,
                report_type TEXT,
                date DATETIME DEFAULT CURRENT_TIMESTAMP,
                primary_image TEXT,
                certification_logo TEXT,
                first_name TEXT,
                last_name TEXT,
                company_name TEXT,
                address TEXT,
                city TEXT,
                state TEXT,
                zip_code TEXT,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_by INTEGER,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );
            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS introduction_page_content (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                page_id INTEGER,
                introduction_content TEXT,
                is_active BOOLEAN,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_by INTEGER,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS inspection_page_content (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                page_id INTEGER,
                inspection_title TEXT,
                is_active BOOLEAN,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_by INTEGER,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS templates_category (
                template_cat_id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                company_id INTEGER,
                category_name TEXT,
                description TEXT,
                is_active BOOLEAN,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS templates (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                template_cat_id INTEGER,
                company_id INTEGER,
                template_type TEXT CHECK(template_type IN ('Report', 'Order', 'QuickText')),
                template_name TEXT,
                description TEXT,
                is_shared BOOLEAN,
                is_active BOOLEAN,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (template_cat_id) REFERENCES templates_category(template_cat_id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS template_pages (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                page_id INTEGER,
                template_id INTEGER,
                is_active BOOLEAN,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_by INTEGER,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS custom_email_invoice_quick_text (
                id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                company_id INTEGER,
                template_id INTEGER,
                content TEXT,
                is_active BOOLEAN,
                created_by INTEGER,
                created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                modified_by INTEGER,
                modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE ON UPDATE CASCADE,
                FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                )`
            );

            // Configuration Account Setting (PDF's)

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS folders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                    company_id INTEGER,
                    folder_name TEXT,
                    parent_folder_id INTEGER,
                    owner_id INTEGER,
                    is_shared BOOLEAN,
                    is_active BOOLEAN,
                    created_by INTEGER,
                    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    modified_by INTEGER,
                    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (parent_folder_id) REFERENCES folders(id) ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                    FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                );`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS files (
                    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                    folder_id INTEGER,
                    company_id INTEGER,
                    file_name TEXT,
                    file_type TEXT,
                    file_size BIGINT,
                    file_path TEXT NOT NULL,
                    owner_id INTEGER,
                    is_active BOOLEAN,
                    created_by INTEGER,
                    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    modified_by INTEGER,
                    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                    FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                );`
            );

            // Configuration Account Setting (Measurements)
            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS unit_of_measurement (
                    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                    company_id INTEGER,
                    unit_name TEXT,
                    description TEXT,
                    is_active BOOLEAN,
                    created_by INTEGER,
                    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    modified_by INTEGER,
                    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                    FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                );`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS MeasurementCategory (
                    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                    company_id INTEGER,
                    category_name TEXT,
                    order_number INTEGER,
                    is_active BOOLEAN,
                    created_by INTEGER,
                    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    modified_by INTEGER,
                    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                    FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                );`
            );

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS measurement_token (
                    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                    company_id INTEGER,
                    token_name TEXT,
                    unit_of_measurement_id INTEGER,
                    is_active BOOLEAN,
                    created_by INTEGER,
                    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    modified_by INTEGER,
                    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (unit_of_measurement_id) REFERENCES unit_of_measurement(id) ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                    FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                );`
            );

            // Configuration Account Setting (ProductsPricing)

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS products_pricing (
                    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                    company_id INTEGER,
                    name TEXT,
                    description TEXT,
                    unit TEXT,
                    material_price DECIMAL(10,2),
                    labor DECIMAL(10,2),
                    margin DECIMAL(10,2),
                    price DECIMAL(10,2),
                    tax_exempt_status BOOLEAN,
                    is_active BOOLEAN,
                    created_by INTEGER,
                    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    modified_by INTEGER,
                    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                    FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                );`
            );

            // Configuration Account Setting (TaxSetting)

            await db.execAsync(
                `CREATE TABLE IF NOT EXISTS tax_setting (
                    id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
                    company_id INTEGER,
                    tax_name TEXT,
                    description TEXT,
                    tax_rate DECIMAL(10,2),
                    is_required BOOLEAN,
                    order_number INTEGER,
                    is_active BOOLEAN,
                    created_by INTEGER,
                    created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    modified_by INTEGER,
                    modified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
                    FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
                );`
            );

/*
 Misses these tables Maybe we need to add them
 - EmailAddresses
 - EmailTemplates
*/
            

            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Error creating tables:', error);
        }
    });
    return db;
};
