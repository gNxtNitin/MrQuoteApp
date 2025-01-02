import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

export const openDatabase = ():SQLite.SQLiteDatabase => {

  const db:SQLite.SQLiteDatabase = SQLite.openDatabaseSync('mrQuote.db');
  return db;
};

export const initDatabase = async () => {
    const db = openDatabase();

  // Create tables
    db.withExclusiveTransactionAsync(async(txn) => { 
    await txn.execAsync(
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        title TEXT,
        customer_id TEXT,
        created_at INTEGER,
        updated_at INTEGER,
        status TEXT,
        total_amount REAL,
        profit_margin REAL,
        notes TEXT
      );`,
    );
    console.log('Database initialized successfully');
  });
  return db;
};