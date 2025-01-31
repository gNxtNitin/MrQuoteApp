import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface CustomPageContentColumns {
  id: ColumnDefinition;
  page_id: ColumnDefinition;
  custom_page_title: ColumnDefinition;
  is_acknowledged: ColumnDefinition;
  my_pdf: ColumnDefinition;
  shared_pdf: ColumnDefinition;
  single_use: ColumnDefinition;
  text_page_notes: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface CustomPageContentData {
  id?: number;
  page_id: number;
  custom_page_title?: string;
  is_acknowledged?: boolean;
  my_pdf?: string;
  shared_pdf?: string;
  single_use?: string;
  text_page_notes?: string;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const CustomPageContent = {
  tableName: 'custom_page_content',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    page_id: { type: 'INTEGER NOT NULL' },
    custom_page_title: { type: 'TEXT' },
    is_acknowledged: { type: 'BOOLEAN' },
    my_pdf: { type: 'TEXT' },
    shared_pdf: { type: 'TEXT' },
    single_use: { type: 'TEXT' },
    text_page_notes: { type: 'TEXT' },
    is_active: { type: 'BOOLEAN' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as CustomPageContentColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${CustomPageContent.tableName} (
        ${Object.entries(CustomPageContent.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      // console.log.log('CustomPageContent table created');
    } catch (error) {
      console.error('Error creating custom_page_content table:', error);
      throw error;
    }
  },

  insert: async (data: CustomPageContentData) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${CustomPageContent.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<CustomPageContentData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${CustomPageContent.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() as CustomPageContentData | null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByPageId: async (pageId: number): Promise<CustomPageContentData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${CustomPageContent.tableName} 
       WHERE page_id = ? AND is_active = true`
    );

    try {
      const result = await statement.executeAsync([pageId]);
      return await result.getFirstAsync() as CustomPageContentData | null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<CustomPageContentData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${CustomPageContent.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${CustomPageContent.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 