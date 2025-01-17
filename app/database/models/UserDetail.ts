import { SQLiteVariadicBindParams } from 'expo-sqlite';
import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface UserDetailColumns {
  id: ColumnDefinition;
  company_id: ColumnDefinition;
  first_name: ColumnDefinition;
  last_name: ColumnDefinition;
  username: ColumnDefinition;
  email: ColumnDefinition;
  phone_number: ColumnDefinition;
  password_hash: ColumnDefinition;
  pin: ColumnDefinition;
  face_id: ColumnDefinition;
  is_logged_in: ColumnDefinition;
  is_first_login: ColumnDefinition;
  last_login_at: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition; // Added created_by
  modified_by: ColumnDefinition; // Added modified_by
  created_date: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface UserDetailData {
  id?: number;
  company_id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  phone_number?: string;
  password_hash?: string;
  pin?: number;
  face_id?: string;
  is_logged_in?: boolean;
  is_first_login?: boolean;
  last_login_at?: string;
  is_active?: boolean;
  created_by?: number; // Added created_by
  modified_by?: number; // Added modified_by
  created_date?: string;
  modified_date?: string;
}

export const UserDetail = {
  tableName: 'user_details',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    company_id: { type: 'INTEGER' },
    first_name: { type: 'TEXT' },
    last_name: { type: 'TEXT' },
    username: { type: 'TEXT UNIQUE' },
    email: { type: 'TEXT UNIQUE' },
    phone_number: { type: 'TEXT' },
    password_hash: { type: 'TEXT' },
    pin: { type: 'INTEGER' },
    face_id: { type: 'TEXT' },
    is_logged_in: { type: 'BOOLEAN DEFAULT false' },
    is_first_login: { type: 'BOOLEAN DEFAULT true' },
    last_login_at: { type: 'DATETIME' },
    is_active: { type: 'BOOLEAN DEFAULT true' },
    created_by: { type: 'INTEGER' }, // Added created_by
    modified_by: { type: 'INTEGER' }, // Added modified_by
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as UserDetailColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${UserDetail.tableName} (
        ${Object.entries(UserDetail.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')}
      );
    `;
    await db.execAsync(query);
    console.log('UserDetail table created');
  },

  insert: async (userDetailData: UserDetailData) => {
    const keys = Object.keys(userDetailData);
    const values = Object.values(userDetailData);
    const placeholders = values.map(() => '?').join(',');
    console.log('UserDetail inserting...');

    const query = `
      INSERT INTO ${UserDetail.tableName} (${keys.join(',')})
      VALUES (${placeholders});
    `;
    await db.runAsync(query, values);
    console.log('UserDetail inserted');
  },

  getById: async (id: number): Promise<UserDetailData | null> => {
    const query = `SELECT * FROM ${UserDetail.tableName} WHERE id = ?;`;
    const result = await db.getAllAsync(query, [id]);
    return result[0] || null;
  },

  findByCredentials: async (username: string, password: string): Promise<UserDetailData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${UserDetail.tableName} 
       WHERE (username = ? OR email = ?) 
       AND password_hash = ?
       AND is_active = true`
    );

    try {
      const result = await statement.executeAsync([username, username, password]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  findByPin: async (pin: number): Promise<UserDetailData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${UserDetail.tableName} 
       WHERE pin = ? 
       AND is_active = true`
    );

    try {
      const result = await statement.executeAsync([pin]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<UserDetailData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${UserDetail.tableName} 
       SET ${setClause} 
       WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  findByPinAndId: async (pin: number, userId: number): Promise<UserDetailData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${UserDetail.tableName}
       WHERE pin = ?
       AND id = ?
       AND is_active = true`
    );

    try {
      const result = await statement.executeAsync([pin, userId]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const;