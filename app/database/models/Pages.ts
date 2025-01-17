import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface PagesColumns {
  id: ColumnDefinition;
  page_name: ColumnDefinition;
  description: ColumnDefinition;
  is_template: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface PagesData {
  id?: number;
  page_name?: string;
  description?: string | null;
  is_template?: boolean;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number | null;
  modified_date?: string;
}

export const Pages = {
  tableName: 'pages',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    page_name: { type: 'TEXT' },
    description: { type: 'TEXT NULL' },
    is_template: { type: 'BOOLEAN' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as PagesColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${Pages.tableName} (
        ${Object.entries(Pages.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('Pages table created');
    } catch (error) {
      console.error('Error creating pages table:', error);
      throw error;
    }
  },

  insert: async (pagesData: PagesData) => {
    const keys = Object.keys(pagesData);
    const values = Object.values(pagesData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${Pages.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
      console.log('Pages inserted');
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<PagesData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Pages.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getAll: async (): Promise<PagesData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Pages.tableName} WHERE is_active = true ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync();
      return await result.getAllAsync() as PagesData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<PagesData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${Pages.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${Pages.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 