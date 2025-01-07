import * as SQLite from 'expo-sqlite';
import { Company } from '../../database/models/Company';
import { Role } from '../../database/models/Role';
import { UserDetail } from '../../database/models/UserDetail';
import { User } from '../../database/models/User';

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
