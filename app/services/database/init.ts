import * as SQLite from 'expo-sqlite';
import { Company } from '../../database/models/Company';
import { Role } from '../../database/models/Role';
import { UserDetail } from '../../database/models/UserDetail';
import { User } from '../../database/models/User';
import { Estimate } from '../../database/models/Estimate';
import { EstimateDetail } from '../../database/models/EstimateDetail';
import { UserRole } from '@/app/database/models/UserRole';

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
                // Create tables
                await Company.createTable();
                await Role.createTable();
                await UserDetail.createTable();
                await User.createTable();
                await Estimate.createTable();
                await EstimateDetail.createTable();
                await UserRole.createTable();

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
                        estimate_number: 1001,
                        sales_person: "Demo User",
                        email: "user@democompany.com",
                        phone: "0987654321",
                        estimate_created_date: new Date().toISOString(),
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
                        estimate_number: 1002,
                        sales_person: "Demo User",
                        email: "user@democompany.com",
                        phone: "0987654321",
                        estimate_created_date: new Date().toISOString(),
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
                        estimate_number: 1002,
                        sales_person: "Demo User",
                        email: "user@democompany.com",
                        phone: "0987654321",
                        estimate_created_date: new Date().toISOString(),
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
                        estimate_number: 1002,
                        sales_person: "Demo User",
                        email: "user@democompany.com",
                        phone: "0987654321",
                        estimate_created_date: new Date().toISOString(),
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
                        estimate_number: 1002,
                        sales_person: "Demo User",
                        email: "user@democompany.com",
                        phone: "0987654321",
                        estimate_created_date: new Date().toISOString(),
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
