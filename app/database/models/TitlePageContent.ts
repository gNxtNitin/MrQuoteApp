import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface TitlePageContentColumns {
  id: ColumnDefinition;
  page_id: ColumnDefinition;
  title_name: ColumnDefinition;
  report_type: ColumnDefinition;
  date: ColumnDefinition;
  primary_image: ColumnDefinition;
  certification_logo: ColumnDefinition;
  first_name: ColumnDefinition;
  last_name: ColumnDefinition;
  company_name: ColumnDefinition;
  address: ColumnDefinition;
  city: ColumnDefinition;
  state: ColumnDefinition;
  zip_code: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface TitlePageContentData {
  id?: number;
  page_id?: number;
  title_name?: string;
  report_type?: string;
  date?: string;
  primary_image?: string;
  certification_logo?: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export const TitlePageContent = {
  tableName: 'title_page_content',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    page_id: { type: 'INTEGER' },
    title_name: { type: 'TEXT' },
    report_type: { type: 'TEXT' },
    date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    primary_image: { type: 'TEXT' },
    certification_logo: { type: 'TEXT' },
    first_name: { type: 'TEXT' },
    last_name: { type: 'TEXT' },
    company_name: { type: 'TEXT' },
    address: { type: 'TEXT' },
    city: { type: 'TEXT' },
    state: { type: 'TEXT' },
    zip_code: { type: 'TEXT' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as TitlePageContentColumns,

  createTable: async () => {
    const query = `
      CREATE TABLE IF NOT EXISTS ${TitlePageContent.tableName} (
        ${Object.entries(TitlePageContent.columns)
          .map(([key, value]) => `${key} ${value.type}`)
          .join(',\n')},
        FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
      );
    `;
    try {
      await db.execAsync(query);
      console.log('TitlePageContent table created');
    } catch (error) {
      console.error('Error creating title_page_content table:', error);
      throw error;
    }
  },

  insert: async (titlePageContentData: TitlePageContentData) => {
    const keys = Object.keys(titlePageContentData);
    const values = Object.values(titlePageContentData);
    const placeholders = values.map(() => '?').join(',');

    const statement = await db.prepareAsync(
      `INSERT INTO ${TitlePageContent.tableName} (${keys.join(',')}) VALUES (${placeholders})`
    );

    try {
      await statement.executeAsync(values);
    } finally {
      await statement.finalizeAsync();
    }
  },

  getById: async (id: number): Promise<TitlePageContentData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${TitlePageContent.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByPageId: async (pageId: number): Promise<TitlePageContentData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${TitlePageContent.tableName} WHERE page_id = ?`
    );

    try {
      const result = await statement.executeAsync([pageId]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<TitlePageContentData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${TitlePageContent.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${TitlePageContent.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 