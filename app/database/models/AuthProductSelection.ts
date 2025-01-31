import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface AuthProductSelectionColumns {
  id: ColumnDefinition;
  authorization_page_id: ColumnDefinition;
  item: ColumnDefinition;
  selection: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface AuthProductSelectionData {
  id?: number;
  authorization_page_id: number;
  item: string;
  selection?: string;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const AuthProductSelection = {
  tableName: 'auth_product_selection',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    authorization_page_id: { type: 'INTEGER NOT NULL' },
    item: { type: 'TEXT NOT NULL' },
    selection: { type: 'TEXT' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as AuthProductSelectionColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${AuthProductSelection.tableName} (
        ${Object.entries(AuthProductSelection.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (authorization_page_id) REFERENCES authorization_page_content(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      // console.log.log('AuthProductSelection table created');
    } catch (error) {
      console.error('Error creating auth_product_selection table:', error);
      throw error;
    }
  },

  insert: async (data: AuthProductSelectionData) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${AuthProductSelection.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<AuthProductSelectionData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${AuthProductSelection.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() as AuthProductSelectionData | null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByAuthorizationPageId: async (authPageId: number): Promise<AuthProductSelectionData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${AuthProductSelection.tableName} 
       WHERE authorization_page_id = ? AND is_active = true 
       ORDER BY id ASC`
    );

    try {
      const result = await statement.executeAsync([authPageId]);
      return await result.getAllAsync() as AuthProductSelectionData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<AuthProductSelectionData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${AuthProductSelection.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${AuthProductSelection.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 