import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface LayoutPagesColumns {
  id: ColumnDefinition;
  page_id: ColumnDefinition;
  layout_id: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface LayoutPagesData {
  id?: number;
  page_id?: number;
  layout_id?: number;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number | null;
  modified_date?: string;
}

export const LayoutPages = {
  tableName: 'layout_pages',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    page_id: { type: 'INTEGER' },
    layout_id: { type: 'INTEGER' },
    is_active: { type: 'BOOLEAN DEFAULT TRUE' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as LayoutPagesColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${LayoutPages.tableName} (
        ${Object.entries(LayoutPages.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (layout_id) REFERENCES layouts(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('LayoutPages table created');
    } catch (error) {
      console.error('Error creating layout_pages table:', error);
      throw error;
    }
  },

  insert: async (layoutPagesData: LayoutPagesData) => {
    const keys = Object.keys(layoutPagesData);
    const values = Object.values(layoutPagesData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${LayoutPages.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<LayoutPagesData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${LayoutPages.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByLayoutId: async (layoutId: number): Promise<LayoutPagesData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${LayoutPages.tableName} 
       WHERE layout_id = ? AND is_active = true 
       ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync([layoutId]);
      return await result.getAllAsync() as LayoutPagesData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByPageId: async (pageId: number): Promise<LayoutPagesData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${LayoutPages.tableName} 
       WHERE page_id = ? AND is_active = true 
       ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync([pageId]);
      return await result.getAllAsync() as LayoutPagesData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<LayoutPagesData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${LayoutPages.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${LayoutPages.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 