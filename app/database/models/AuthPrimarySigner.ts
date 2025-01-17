import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface AuthPrimarySignerColumns {
  auth_p_signer_id: ColumnDefinition;
  authorization_page_id: ColumnDefinition;
  first_name: ColumnDefinition;
  last_name: ColumnDefinition;
  email_address: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface AuthPrimarySignerData {
  auth_p_signer_id?: number;
  authorization_page_id: number;
  first_name?: string;
  last_name?: string;
  email_address?: string;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const AuthPrimarySigner = {
  tableName: 'auth_primary_signer',
  columns: {
    auth_p_signer_id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    authorization_page_id: { type: 'INTEGER NOT NULL' },
    first_name: { type: 'TEXT' },
    last_name: { type: 'TEXT' },
    email_address: { type: 'TEXT' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as AuthPrimarySignerColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${AuthPrimarySigner.tableName} (
        ${Object.entries(AuthPrimarySigner.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (authorization_page_id) REFERENCES authorization_page_content(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('AuthPrimarySigner table created');
    } catch (error) {
      console.error('Error creating auth_primary_signer table:', error);
      throw error;
    }
  },

  insert: async (data: AuthPrimarySignerData) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${AuthPrimarySigner.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<AuthPrimarySignerData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${AuthPrimarySigner.tableName} WHERE auth_p_signer_id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() as AuthPrimarySignerData | null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByAuthorizationPageId: async (authPageId: number): Promise<AuthPrimarySignerData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${AuthPrimarySigner.tableName} 
       WHERE authorization_page_id = ? AND is_active = true 
       ORDER BY auth_p_signer_id ASC`
    );

    try {
      const result = await statement.executeAsync([authPageId]);
      return await result.getAllAsync() as AuthPrimarySignerData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<AuthPrimarySignerData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${AuthPrimarySigner.tableName} SET ${setClause} WHERE auth_p_signer_id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${AuthPrimarySigner.tableName} WHERE auth_p_signer_id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 